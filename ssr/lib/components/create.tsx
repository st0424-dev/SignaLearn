"use client";

import { cn } from "@/lib/utils";
import Form from "next/form";
import { useActionState, useState } from "react";
import { createQuestion } from "../actions/create-question";

export function CreateQuestion() {
  const [questionData, questionAction, areQuestionsPending] = useActionState(
    createQuestion,
    null,
  );
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <>
      {questionData && (
        <div
          className={cn(
            "p-4 rounded-sm mb-5",
            { "bg-error text-error-content": !questionData.success },
            { "bg-success text-success-content": questionData.success },
          )}
        >
          <p>{questionData?.message ?? "Please try again"}</p>
        </div>
      )}
      <Form
        className="flex space-y-3 flex-col"
        formEncType="multipart/form-data"
        action={questionAction}
      >
        <input
          required
          className="file-input w-full"
          name="video"
          type="file"
        />
        <input
          className="input w-full"
          placeholder="Title of the Question"
          type="text"
          name="title"
        />
        <textarea
          className="textarea w-full"
          placeholder="Upload the transcription of video"
          name="answer"
          rows={10}
        />

        <div>
          Stay anonymous
          <input
            type="checkbox"
            onChange={(e) => setIsAnonymous(e.target.checked)}
            checked={isAnonymous}
            className="toggle ml-2"
          />
        </div>
        <div className="space-y-2">
          {!isAnonymous && (
            <>
              <input
                name="email"
                required
                className="input w-full"
                placeholder="Your email"
                type="text"
              />
              <input
                name="name"
                required
                className="input w-full"
                placeholder="Your name"
                type="text"
              />
            </>
          )}
        </div>
        <button className="btn mt-5 w-fit btn-secondary" type="submit">
          Submit
          {areQuestionsPending && <span className="loading loading-spinner" />}
        </button>
      </Form>
    </>
  );
}
