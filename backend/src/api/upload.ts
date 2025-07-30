import express from "express";
import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";
import multer from "multer";
import path from "node:path";

import type { gz } from "../ai/index.js";
import type { Question } from "../data/questions.js";

import { captureScreenshots, videoValidatorOutputSchema } from "../ai/flow.js";
import { ai } from "../ai/index.js";
import { videoValidatorPrompt } from "../ai/prompt.js";
import { addPendingQuestionInDb, QuestionSchema } from "../data/questions.js";
import { env } from "../env.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`); // Appending extension
  },
});
const upload = multer({ storage });

type UploadResponse = {
  success: boolean;
  message?: string;
};

router.post<object, UploadResponse>("/", upload.single("video"), async (req, res, next) => {
  const file = req.file!;
  const stats = await ffprobe(file.path, {
    path: ffprobeStatic.path,
  });

  const video = stats.streams[0];
  if (video.codec_type === "video" && video.duration) {
    if (Number.parseInt(video.duration, 10) <= 30)
      next();
    else
      res.json({ success: false, message: "Video should be less than 30 seconds" });
  }
  else {
    res.json({ success: false, message: "Please upload a video only like mp4 formats etc" });
  }
}, async (req, res) => {
  const video = req.file!;

  let validationResults: gz.infer<typeof videoValidatorOutputSchema> | null = null;

  /**
   * This is going to nuke bad, but Ollama is giving
   *  me `null` in the first attempt always whyyyyyy 😭
   */
  while (validationResults === null) {
    const frames = await captureScreenshots(video.path, 5);
    const prompt = [{ text: videoValidatorPrompt }, ...frames.map(f => ({ media: { url: f } }))];
    try {
      const { output } = await ai.generate({
        prompt,
        output: { schema: videoValidatorOutputSchema },
        model: "ollama/gemma3n",
      });

      validationResults = output;
    }
    catch (error) {
      console.error(error);
    }
  }

  const question: Question = {
    id: Date.now().toString(),
    title: req.body.title,
    answer: req.body.answer,
    name: req.body.name,
    email: req.body.email,
    videoUrl: `http://localhost:${env.PORT}/${video.path}`,
  };

  const parsedQuestion = QuestionSchema.safeParse(question);
  if (!parsedQuestion.success) {
    res.json({ success: false, message: "Please ensure you fill all the fields" });
    return;
  }

  try {
    await addPendingQuestionInDb({ question: parsedQuestion.data, ai_results: validationResults });
    res.json({
      success: true,
      message: "Your question was successfully added and we will try our best to approve it once it passes the quality checks",
    });
  }
  catch {
    res.json({
      success: false,
      message: "We messed with our database, please try again later",
    });
  }

  res.json({
    success: true,
    message: "Express is just for MVP only ig anyws, I should have used a robust framework, at this point. I don't know what the error can be 😂",
  });
});

export default router;
