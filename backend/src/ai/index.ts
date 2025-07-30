import { genkit, z as gz } from "genkit";
import { ollama } from "genkitx-ollama";

const ai = genkit({
  plugins: [
    ollama({
      models: [{ name: "gemma3n" }],
      serverAddress: "http://127.0.0.1:11434", // default local address
    }),
  ],
});

export { ai, gz };
