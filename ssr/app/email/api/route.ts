import { ai, gz } from "@/lib/ai/genkit";
import genkitEndpoint from "@/lib/ai/genkit-endpoint";
import { EmailSchema } from "@/lib/schema";

// Return to structured output rather than stream plain text of data without context
export const POST = genkitEndpoint(
  { schema: gz.object({ prompt: gz.string() }) },
  ({ prompt }) =>
    ai.generateStream({
      model: "ollama/gemma3n",
      prompt: `Generate an interesting email based on the following prompt: ${prompt}`,
      output: {
        schema: EmailSchema,
      },
    }),
);
