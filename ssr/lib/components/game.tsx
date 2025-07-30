"use client";

import { validateAnswer } from "@/lib/actions/validate-answer";
import { Answer } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { ArrowLeft, Lightbulb, Sparkle } from "lucide-react";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { getHints } from "../actions/get-hints";

interface GameProps {
  questionId: string;
  videoUrl: string;
  title: string;
}

function AnswerBox(props: {
  action: (payload: FormData) => void;
  value: string;
  answer: Answer | null;
  formAction: (payload: FormData) => void;
  isSubmitting: boolean;
  hintsPending: boolean;
}) {
  return (
    <Form className="right-0 left-0 bottom-8 absolute" action={props.action}>
      <input type="hidden" name="question-id" value={props.value} />
      <div className="flex items-center justify-center">
        <div className="bg-base-100 flex justify-center items-center gap-4 rounded-lg px-8 py-5">
          <textarea
            placeholder="Try your best to decrypt the ASL into English"
            className="textarea w-md"
            name="answer"
          />
          <button
            className="btn border-base-content btn-circle btn-soft"
            disabled={props.isSubmitting}
            type="submit"
          >
            {props.isSubmitting ? (
              <span className="loading loading-spinner" />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"></path>
              </svg>
            )}
          </button>
          {props.answer !== null && !props.answer?.verdict && (
            <button
              className="btn btn-circle btn-warning"
              formAction={props.formAction}
            >
              {props.hintsPending ? (
                <span className="loading loading-spinner" />
              ) : (
                <Lightbulb className="size-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </Form>
  );
}

export function Game({ questionId, videoUrl, title }: GameProps) {
  const [answer, validateAnswerAction, isPending] = useActionState(
    validateAnswer,
    null,
  );

  const [hintsForm, getHintsAction, isHintsPending] = useActionState(
    getHints,
    null,
  );

  if (answer === null && !isPending) {
    return (
      <div className="h-170 relative">
        <video
          className="object-cover w-full h-full"
          muted
          autoPlay
          loop
          src={videoUrl}
        />

        <AnswerBox
          action={validateAnswerAction}
          value={questionId}
          answer={answer}
          formAction={getHintsAction}
          hintsPending={isHintsPending}
          isSubmitting={isPending}
        />
      </div>
    );
  }

  return (
    <div className={cn("grid h-170 gap-8 grid-cols-3")}>
      <div id="user" className="relative col-span-2">
        <video
          className="absolute object-cover inset-0 w-full h-full"
          muted
          autoPlay
          loop
          src={videoUrl}
        />

        <AnswerBox
          action={validateAnswerAction}
          value={questionId}
          answer={answer}
          formAction={getHintsAction}
          hintsPending={isHintsPending}
          isSubmitting={isPending}
        />
      </div>

      <div id="ai" className="space-y-5">
        <h2 className="text-lg">{title}</h2>
        <div className="flex gap-2 justify-center items-center">
          <Image
            className="text-base-content"
            src="/ollama.svg"
            width={35}
            height={35}
            alt="ollama"
          />
          +
          <Image width={35} height={35} src="/google.svg" alt="Google" />= Your
          AI Powered Judge
        </div>

        {isPending && (
          <div className="flex gap-2 animate-pulse items-center text-sm">
            <Sparkle className="size-4.5" />
            Thinking about your answer &hellip;
          </div>
        )}

        {answer && (
          <>
            <div className="bg-base-300 rounded-md text-base-content flex p-2 gap-2 items-start">
              <Image width={40} height={40} src="/gemma.svg" alt="gemma" />
              <p>{answer.remark}</p>
            </div>

            <div
              className={cn("bg-error rounded-md p-5 text-red-100", {
                "bg-success text-success-content": answer.verdict,
              })}
            >
              {answer.verdict
                ? "You got it right pal ✅❤️"
                : "Sorry your answer is wrong 😭, please try again."}
            </div>

            {answer.verdict && (
              <Link href="/" className="btn btn-info">
                Go back to home screen
                <ArrowLeft />
              </Link>
            )}

            {!answer.verdict && hintsForm && (
              <ul className="pl-10 py-5 pr-5 bg-base-200 text-base-content list-decimal">
                <p className="text-lg mb-2">
                  Hints <Lightbulb className="inline" />
                </p>
                {hintsForm.hints.map((h, i) => (
                  <li className="mb-2" key={i}>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
