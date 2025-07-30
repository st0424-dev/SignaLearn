import { z } from "genkit";
// Importing beta channel of genkit
import { genkit } from "genkit/beta";
import { ollama } from "genkitx-ollama";

// import { googleAI } from "@genkit-ai/googleai";

// const ai = genkit({
//   plugins: [googleAI()], // set the GOOGLE_API_KEY env variable
//   model: googleAI.model("gemini-2.0-flash"),
// });

const ai = genkit({
  plugins: [
    ollama({
      models: [
        {
          name: "gemma3n:e4b",
          type: "chat",
        },
      ],
      serverAddress: "http://127.0.0.1:11434", // default local address
    }),
  ],
});

export { ai, z as gz };
