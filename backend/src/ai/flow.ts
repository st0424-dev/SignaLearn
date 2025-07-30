import Ffmpeg from "ffmpeg";
import fs from "node:fs";
import path from "node:path";

import { ai, gz } from "./index.js";

const videoValidatorInputSchema = gz.object({ videoPath: gz.string().describe("Input path of video") });
export const videoValidatorOutputSchema = gz.object({
  flag: gz
    .boolean()
    .describe("if a video does contain NSFW content or it does not contain hand movements relevant to ASL, the statement is True otherwise False"),
  description: gz.string().describe("describe what is shown in the video"),
  title: gz.string().describe("generate title of the video from video provided"),
});
export type VideoValidationOutput = gz.infer<typeof videoValidatorOutputSchema>;

/**
 * This flow decides whether the video uploaded is not NSFW and contains relevant content
 *  Idk why this method is giving me null for every output
 */
const videoValidatorFlow = ai.defineFlow(
  {
    name: "videoValidatorFlow",
    inputSchema: videoValidatorInputSchema,
    outputSchema: videoValidatorOutputSchema,
  },
  async (input) => {
    const frames = await captureScreenshots(input.videoPath, 5);

    const prompt = `You are an AI tasked with analyzing video content to determine if it contains NSFW (Not Safe For Work) material 
      and whether it includes relevant information related to American Sign Language (ASL).`;

    const { output } = await ai.generate({
      prompt: [{ text: prompt }, ...frames.map(f => ({ media: { url: f } }))],
      output: { schema: videoValidatorOutputSchema },
      model: "ollama/gemma3n",
    });

    if (!output) {
      throw new Error("Ollama/gemma3n is just hard to work with");
    }

    return output;
  },
);

/** Better version of `generateFramesOfVideo()` */
export async function captureScreenshots(videoPath: string, number: number) {
  const framesFolder = "screenshots";
  fs.mkdirSync(framesFolder);

  const process = await new Ffmpeg(videoPath);

  const frames = [];
  try {
    await process.fnExtractFrameToJPG(framesFolder, {
      frame_rate: 1,
      number,
    });

    const filenames = listFilesInDirectory(framesFolder);
    for (let i = 0; i < filenames.length; i++) {
      const filename = filenames[i];

      if (!filename.endsWith("jpg")) {
        continue;
      }

      const image = fs.readFileSync(filename);
      const base64Image = `data:image/jpeg;base64,${image.toString("base64")}`;

      frames.push(base64Image);
    }
  }
  catch (error) {
    console.error(error);
    console.error(`Frames generation failure of ${videoPath}`);
  }
  finally {
    fs.rmSync(framesFolder, { recursive: true, force: true });
  }

  return frames;
}

export function listFilesInDirectory(folderPath: string) {
  const isFile = (fileName: string) => {
    return fs.lstatSync(fileName).isFile();
  };

  return fs
    .readdirSync(folderPath)
    .map((fileName) => {
      return path.join(folderPath, fileName);
    })
    .filter(isFile);
}
