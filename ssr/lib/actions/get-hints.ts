"use server";

import { ai, gz } from "../ai/genkit";
import { getQuestionBy } from "../data";

export type OutputSchema = gz.infer<typeof outputSchema>;
export async function getHints(
  prevState: null | OutputSchema,
  formData: FormData,
) {
  const questionId = gz.string().parse(formData.get("question-id"));
  const userAnswer = gz.string().parse(formData.get("answer"));
  const serverAnswer = gz
    .string()
    .parse((await getQuestionBy(questionId))?.answer);
  return await hintsFlowGenerator({ userAnswer, serverAnswer });
}

const outputSchema = gz.object({
  hints: gz
    .string()
    .array()
    .length(2)
    .describe("Two hints provided to help the user"),
});

const inputSchema = gz.object({
  serverAnswer: gz.string().describe("server answer of question"),
  userAnswer: gz.string().describe("user answer to the question"),
});

const hintsFlowGenerator = ai.defineFlow(
  {
    name: "hintsFlowGenerator",
    inputSchema: inputSchema,
    outputSchema: outputSchema,
  },
  async (input) => {
    const systemPrompt = `Help the user in giving the hints to user based upon the correct answer. 
    Highlight the points on what he is missing and make sure to not reveal the server answer`;

    const prompt = `Server Answer: ${input.serverAnswer}
    User Answer: ${input.userAnswer}`;

    const { output } = await ai.generate({
      model: "ollama/gemma3n",
      system: systemPrompt,
      prompt: [{ text: prompt }],
      output: { schema: outputSchema },
    });

    if (!output) {
      throw new Error("Failed to generate with Ai");
    }

    return output;
  },
);
