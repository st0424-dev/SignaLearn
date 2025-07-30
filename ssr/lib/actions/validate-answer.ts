"use server";

import { Answer, AnswerSchema } from "@/lib/schema";
import { ai, gz } from "../ai/genkit";
import { getQuestionBy } from "../data";

export async function validateAnswer(
  prevState: Answer | null,
  formData: FormData,
) {
  const questionId = gz.string().parse(formData.get("question-id"));
  const userAnswer = gz.string().parse(formData.get("answer"));
  const serverAnswer = gz
    .string()
    .parse((await getQuestionBy(questionId))?.answer);

  return await isSimilarFlow({ serverAnswer, userAnswer });
}

const isSimilarFlowSchema = gz.object({
  serverAnswer: gz.string().describe("correct answer of question"),
  userAnswer: gz.string().describe("user answer to the question provided"),
});

const isSimilarFlow = ai.defineFlow(
  {
    name: "isSimilarFlow",
    inputSchema: isSimilarFlowSchema,
    outputSchema: AnswerSchema,
  },
  async (input) => {
    const systemPrompt = `You are a sentence similarity evaluator. 
    Your task is to analyze two provided English sentences and determine whether they convey the same meaning or not`;

    const prompt = `User answer: ${input.userAnswer}
    Actual answer: ${input.serverAnswer}`;

    const { output } = await ai.generate({
      system: systemPrompt,
      prompt: [{ text: prompt }],
      output: { schema: AnswerSchema },
      model: "ollama/gemma3n",
    });

    if (!output) {
      throw new Error("Failed to generate with Ai");
    }

    return output;
  },
);
