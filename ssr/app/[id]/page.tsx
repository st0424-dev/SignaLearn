import { Game } from "@/lib/components/game";
import { Welcome } from "@/lib/components/welcome";
import { getQuestionBy } from "@/lib/data";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await getQuestionBy(id);

  if (!question) {
    return (
      <div>
        <p>Could not find your question</p>
        <Link href="/public">Go to home screen</Link>
      </div>
    );
  }

  return (
    <div>
      {question && (
        <>
          <Welcome />
          <Game
            title={question.title}
            questionId={question.id}
            videoUrl={question.videoUrl}
          />
        </>
      )}
    </div>
  );
}
