import * as z from "zod";

const backend_url = z.string().parse(process.env.BACKEND_API);

export const QuestionSchema = z.object({
  _id: z.string().describe("This is the mongodb _id (ObjectId"),
  id: z.string(),
  title: z.string(),
  answer: z.string(),
  videoUrl: z.string(),
  name: z.string().nullable(),
  email: z.email().nullable(),
});

export type Question = z.infer<typeof QuestionSchema>;
export type PendingQuestion = {
  question: Question;
  ai_results: VideoValidation;
  _id: string;
};

export const VideoValidationSchema = z.object({
  flag: z
    .boolean()
    .describe(
      "if a video does contain NSFW content or it does not contain hand movements relevant to ASL, the statement is True otherwise False",
    ),
  description: z.string().describe("describe what is shown in the video"),
  title: z.string().describe("generate title of the video from video provided"),
});

export type VideoValidation = z.infer<typeof VideoValidationSchema>;

export async function getQuestions() {
  const questions = await fetch(backend_url + `/ques`, {
    cache: "no-cache",
  }).then((response) => response.json());

  return QuestionSchema.array().parse(questions);
}

export async function getQuestionBy(id: string) {
  const question = await fetch(backend_url + `/ques/${id}`).then((response) =>
    response.json(),
  );
  return QuestionSchema.nullable().parse(question);
}
