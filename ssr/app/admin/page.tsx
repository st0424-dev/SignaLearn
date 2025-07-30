import { PendingQuestion } from "@/lib/components/pending";
import type { PendingQuestion as IPendingQuestion } from "@/lib/data";
import z from "zod";

const BACKEND_API = z
  .string("BACKEND_URL is empty")
  .parse(process.env.BACKEND_API);

async function getPendingQuestions() {
  return (await fetch(BACKEND_API + "/ques?pending=true").then((res) =>
    res.json(),
  )) as IPendingQuestion[];
}

export default async function Page() {
  const questions = await getPendingQuestions();
  return (
    <div>
      <h1 className="text-4xl">Admin Panel</h1>
      {questions.length === 0 && <p>No work to worry about</p>}
      <ul>
        {questions.map((q) => (
          <PendingQuestion key={q.question.id} q={q} />
        ))}
      </ul>
    </div>
  );
}
