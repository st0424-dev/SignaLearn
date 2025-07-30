import { ObjectId } from "mongodb";
import { z } from "zod";

import type { VideoValidationOutput } from "../ai/flow.js";

import { database } from "./mongo.js";

export const QuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  answer: z.string(),
  videoUrl: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;
export type PendingQuestion = { question: Question; ai_results: VideoValidationOutput };

async function addPendingQuestionInDb(node: PendingQuestion) {
  const collection = database.collection<PendingQuestion>("pending");
  await collection.insertOne(node);
}

async function approvePendingQuestion(id: string) {
  const collection = database.collection<PendingQuestion>("pending");
  const pendingQuestion = await collection.findOne({ _id: new ObjectId(id) });
  if (pendingQuestion === null)
    return false;
  await addQuestionInDb(pendingQuestion.question);
  await discardPendingQuestion(id);
  return true;
}

async function discardPendingQuestion(id: string) {
  const pending = database.collection("pending");
  const query = { _id: new ObjectId(id) };
  const result = await pending.deleteOne(query);

  if (result.deletedCount === 1) {
    return true;
  }
  else {
    return false;
  }
}

async function getAllPendingQuestionFromDb() {
  const collection = database.collection<PendingQuestion>("pending");
  const cursor = collection.find();

  const questions: PendingQuestion[] = [];
  for await (const doc of cursor) {
    questions.push(doc);
  }

  return questions;
}

async function addQuestionInDb(question: Question) {
  const collection = database.collection<Question>("questions");
  await collection.insertOne(question);
}

async function getAllQuestionFromDb() {
  const collection = database.collection<Question>("questions");
  const cursor = collection.find();

  const questions: Question[] = [];
  for await (const doc of cursor) {
    questions.push(doc);
  }

  return questions;
}

async function getQuestionById(id: string) {
  const collection = database.collection<Question>("questions");
  const question = await collection.findOne({ id });
  return question;
}

export {
  addPendingQuestionInDb,
  addQuestionInDb,
  approvePendingQuestion,
  discardPendingQuestion,
  getAllPendingQuestionFromDb,
  getAllQuestionFromDb,
  getQuestionById,
};
