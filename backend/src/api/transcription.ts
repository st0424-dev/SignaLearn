import express from "express";
import Ffmpeg from "ffmpeg";
import multer from "multer";
import { nanoid } from "nanoid";
import fs from "node:fs";
import path from "node:path";
// Unsafe method: {nodewhisper} library cause erroneous behaviour with NodeJS filesystem method, IDK how to use Gemma in it 😭
import { nodewhisper } from "nodejs-whisper";

import { ai, gz } from "../ai/index.js";

/** Maybe Gemma does not support audio as multi-modal input with Genkit lib */
async function generateTranscriptionWithGemma(audioFilepath: string) {
  const prompt = `Transcribe the audio in English speech`;
  const audio = fs.readFileSync(audioFilepath);
  const base64audio = `data:audio/mpeg;base64,${audio.toString("base64")}`;
  const { output } = await ai.generate({
    prompt: [{ media: { url: base64audio } }, { text: prompt }],
  });
  return output;
}
/** ------------------------------------------------------------------------------------ */

const transcriptionRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "tmp/");
  },
  filename(req, file, cb) {
    cb(null, nanoid() + path.extname(file.originalname)); // Appending extension
  },
});

const upload = multer({ storage });

async function generateTranscriptionWithWhisper(audioFilePath: string) {
  const absPath = path.resolve(audioFilePath);

  const output = await nodewhisper(
    path.resolve(absPath),
    {
      autoDownloadModelName: "base.en",
      modelName: "base.en",
      logger: console,
      withCuda: false,
      removeWavFileAfterTranscription: true,
    },
  );

  const regex = /\n\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]/g;
  return output.replace(regex, "");
}

transcriptionRouter.post<{ transcription: string }>("/", (req, res, next) => {
  if (!fs.existsSync("tmp/"))
    fs.mkdirSync("tmp/");

  next();
}, upload.single("video"), async (req, res, next) => {
  try {
    const videoFile = req.file!.path;
    const audioFilepath = await pathOfAudioFromVid(videoFile);
    const transcription = await generateTranscriptionWithWhisper(audioFilepath);
    // const trancription = await generateTranscriptionWithWhisper(audioFilepath);
    res.json({ transcription });
  }
  finally {
    // fs.rmSync("tmp/", { force: true, recursive: true });
  }
});

export async function pathOfAudioFromVid(videoPath: string) {
  const video = await new Ffmpeg(videoPath);
  const audioFilename = `tmp/${nanoid()}.mp3`;
  return await video.fnExtractSoundToMP3(audioFilename);
}

export default transcriptionRouter;
