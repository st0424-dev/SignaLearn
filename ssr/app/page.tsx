import { getQuestions } from "@/lib/data";
import { CircleUserRound, Gamepad2, Mail, VenetianMask } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const questions = await getQuestions();

  const renderDetails = (name: string | null, email: string | null) => {
    if (name && email)
      return (
        <>
          <span className="flex items-center">
            <CircleUserRound className="size-3 mr-1" /> {name}
          </span>
          <span className="flex items-center">
            <Mail className="size-3 mr-1" /> {email}
          </span>
        </>
      );
    return (
      <span className="flex items-center">
        <VenetianMask className="size-3 mr-1" /> Anonymous
      </span>
    );
  };

  return (
    <main>
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs tracking-wide opacity-60">
          Let&apos;s learn ASL in a fun way, shall we ?
        </li>
        {questions.map((q, idx) => (
          <li key={q._id} className="list-row">
            <div className="text-5xl font-thin tabular-nums opacity-30">
              {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
            </div>
            <div className="list-col-grow">
              <p className="mb-3">{q.title}</p>
              <div className="opacity-60 text-xs space-x-3 space-y-0.5">
                {renderDetails(q.name, q.email)}
              </div>
            </div>
            <Link href={`/${q.id}`} className="btn btn-primary">
              Play <Gamepad2 />
            </Link>
          </li>
        ))}
      </ul>
      <footer className="bg-base-300 flex tracking-wide justify-center items-center py-2 fixed bottom-0 left-0 right-0 text-base-content">
        Made with
        <div className="tooltip" data-tip="gemma">
          <Image
            className="mr-2"
            width={45}
            height={45}
            src="/gemma.svg"
            alt="gemma"
          />
        </div>
        <div className="tooltip" data-tip="genkit">
          <Image
            width={100}
            height={45}
            src="https://genkit.dev/_astro/genkit-darkmode.DHOpUScP_1waD6I.svg"
            alt="genkit"
          />
        </div>
      </footer>
    </main>
  );
}
