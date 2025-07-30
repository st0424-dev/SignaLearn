import { gz } from "@/lib/ai/genkit";

export const AnswerSchema = gz.object({
  verdict: gz
    .boolean()
    .describe("whether both the sentences are identical or not"),
  remark: gz
    .string()
    .min(1)
    .describe(
      "provide an encouraging remark if sentences differ; otherwise, offer a congratulatory remark",
    ),
});

export type Answer = gz.infer<typeof AnswerSchema>;

export const EmailSchema = gz.object({
  body: gz.string().describe("Body of the email"),
  subject: gz.string().describe("Subject of the email in html"),
});

export type EmailSchema = gz.infer<typeof EmailSchema>;
