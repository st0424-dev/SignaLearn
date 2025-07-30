"use client";

import { approvePendingQuestion } from "@/lib/actions/approve";
import type { PendingQuestion } from "@/lib/data";
import { CircleUserRound, VenetianMask } from "lucide-react";
import Form from "next/form";
import Image from "next/image";
import { useActionState, useState } from "react";
import { discardPendingQuestion } from "../actions/discard";
import { QuillEmailDialog } from "./quill";

function TwoColLayout(props: { label: string; desc: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] text-base-content border-base-300 border p-5">
      <span className="">{props.label}</span>
      <p>{props.desc}</p>
    </div>
  );
}

export function PendingQuestion({ q }: { q: PendingQuestion }) {
  const [data, action, isPending] = useActionState(
    approvePendingQuestion,
    null,
  );
  const [isRemoved, setIsIsRemoved] = useState(false);
  const isPendingQuestionApproved = Object.hasOwn(data ?? {}, "success");
  const isAnonymous = !(q.question.name && q.question.email);

  const renderQuillDialogButton = () => {
    if (isPendingQuestionApproved && q.question.email && q.question.name)
      return (
        <div className="flex gap-2">
          <QuillEmailDialog
            body={q.ai_results.description}
            email={q.question.email}
            name={q.question.name}
            buttonLabel={`Inform ${q.question.name}`}
            subject={q.question.title}
          />
          <button
            onClick={() => setIsIsRemoved(true)}
            className="btn btn-error"
          >
            Remove
          </button>
        </div>
      );
  };

  if (isRemoved) {
    return <li className="py-5">You approved {q.question.title} ✅</li>;
  }

  return (
    !isRemoved && (
      <li className="py-8 space-y-5 border-b">
        <p className="text-xl mb-5">Title: {q.question.title}</p>
        <div className="grid gap-x-10 grid-rows-2 grid-cols-2">
          <p className="flex gap-2 items-center">
            <Image width={28} height={28} src="/gemma.svg" alt="gemma" />
            Video validated by gemma
          </p>
          <p className="flex gap-2 items-center">
            <CircleUserRound className="size-6" />
            Details submitted by User
          </p>

          <TwoColLayout label="Title" desc={q.ai_results.title} />
          <TwoColLayout label="Title" desc={q.question.title} />
          <TwoColLayout
            label="Video Description"
            desc={q.ai_results.description}
          />
          <TwoColLayout label="Transcription" desc={q.question.answer} />
        </div>

        <div className="grid gap-10 grid-cols-2">
          <video controls className="w-full h-full" src={q.question.videoUrl} />
          <div>
            <p className="mb-4 text-lg">
              Request to upload a video recieved from{" "}
            </p>
            {isAnonymous ? (
              <div>
                <p>
                  Anonymous user <VenetianMask className="inline" />
                </p>
                <button
                  onClick={() => setIsIsRemoved(true)}
                  className="btn btn-error"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <label className="input w-full">
                  <span className="label w-28">Email</span>
                  <input
                    readOnly
                    type="text"
                    value={q.question.email ?? undefined}
                  />
                </label>
                <label className="input w-full">
                  <span className="label w-28">Name</span>
                  <input
                    readOnly
                    type="text"
                    value={q.question.name ?? undefined}
                  />
                </label>
              </div>
            )}
            <Form className="mt-3" action={action}>
              <input type="hidden" name="id" value={q._id} />
              <input type="hidden" name="title" value={q.question.title} />
              {!isPendingQuestionApproved && (
                <div>
                  <button className="btn btn-success" type="submit">
                    Approve{" "}
                    {isPending && (
                      <span className="loading loading-spinner text-xs" />
                    )}
                  </button>

                  <button
                    formAction={discardPendingQuestion}
                    className="btn ml-2 btn-error"
                  >
                    Deny
                  </button>
                </div>
              )}
            </Form>
            {renderQuillDialogButton()}
          </div>
        </div>
      </li>
    )
  );
}
