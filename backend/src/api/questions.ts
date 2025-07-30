import express from "express";
import { z } from "zod";

import type { PendingQuestion, Question } from "../data/questions.js";

import { approvePendingQuestion, discardPendingQuestion, getAllPendingQuestionFromDb, getAllQuestionFromDb, getQuestionById } from "../data/questions.js";

const router = express.Router();

router.get<object, Question[] | PendingQuestion[]>("/", async (req, res) => {
  const pending = req.query.pending === "true";
  if (pending) {
    res.json(await getAllPendingQuestionFromDb());
  }
  else {
    const questions = await getAllQuestionFromDb();
    res.json(questions);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.json(await getQuestionById(id));
});

router.post("/approve", async (req, res) => {
  const id = z.string().parse(req.body?.id);
  const success = await approvePendingQuestion(id);

  res.json({
    success,
  });
});

router.post("/discard", async (req, res) => {
  const id = z.string().min(1).parse(req.body?.id);
  const success = await discardPendingQuestion(id);

  res.json({
    success,
  });
});

export default router;
