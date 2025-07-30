"use client";

import { post } from "@/lib/ai/utils";
import { type EmailSchema } from "@/lib/schema";
import { Sparkle } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { sendEmail } from "../actions/send-email";
import useAgent from "../ai/use-agent";

interface QuillEmailProps {
  email: string;
  name: string;
  subject: string;
  body: string;
}

function Email({ name, subject, email, body }: QuillEmailProps) {
  const [data, action, isPending] = useActionState(sendEmail, null);
  const [editorText, setEditorText] = useState<string>();

  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState<Partial<EmailSchema | null>>({
    subject,
    body: undefined,
  });

  const { messages, resetConversation, error, send } = useAgent({
    endpoint: "/email/api",
  });

  async function generateEmail() {
    const prompt = `Write a professional email to ${name} at ${email} congratulating on the approval of question submitted through the admin portal. 
    The question subject was "${subject}".  
    The email body is: "${body}".  
    Specifically, acknowledge that her question was helpful and demonstrates proactive engagement with SignaLearn platform. 
    Maintain a friendly but formal tone appropriate for a workplace setting.  
    Ensure the email expresses gratitude for her contribution to improving [what the platform helps with - e.g., team knowledge, making the learning accessible].
    `;

    try {
      setIsLoading(true);
      const stream = post<{ prompt: string }, { output: Partial<EmailSchema> }>(
        "/email/api",
        { prompt },
      );

      for await (const chunk of stream) {
        if (chunk.message) setEmailData(chunk.message.output);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-5 my-5">
        {isPending && <span className="loading loading-spinner" />}
        {data?.success && (
          <div>
            <h3>Sent the email successfully ✅</h3>
            <button className="btn btn-success">
              <Link href="/admin">Visit admin</Link>
            </button>
          </div>
        )}
      </div>

      <label className="input w-full">
        <span className="label w-20">From</span>
        <input readOnly type="text" value="acme@example.com" />
      </label>
      <label className="input w-full">
        <span className="label w-20">To</span>
        <input readOnly type="text" value={email} />
      </label>
      <label className="input w-full">
        <span className="label w-20">Subject</span>
        <input
          type="text"
          onChange={(e) =>
            setEmailData((prevState) => ({
              ...prevState,
              subject: e.target.value,
            }))
          }
          value={emailData?.subject}
        />
      </label>

      <Form className="mt-5" action={action}>
        {isLoading && (
          <div className="flex mb-2 gap-2 animate-pulse items-center text-sm">
            <Sparkle className="size-4.5" />
            Thinking about your answer &hellip;
          </div>
        )}
        <ReactQuill
          theme="snow"
          value={emailData?.body}
          onChange={(e) =>
            setEmailData((prevState) => ({ ...prevState, body: e }))
          }
        >
          <div className="h-40!" />
        </ReactQuill>

        <input type="hidden" name="to" value={email} />
        <input type="hidden" name="subject" value={emailData?.subject} />
        <input type="hidden" name="text" value={emailData?.body} />
        <button type="submit" className="btn btn-success my-5">
          Send
        </button>
      </Form>

      <div className="space-x-4">
        {!error && (
          <button className="btn btn-primary" onClick={generateEmail}>
            {isLoading ? (
              <span className="animate-pulse">Generating..</span>
            ) : (
              "Generate the email with Ai"
            )}
          </button>
        )}
        <button className="btn btn-error" onClick={resetConversation}>
          Reset
        </button>
      </div>
    </>
  );
}

export function QuillEmailDialog({
  email,
  name,
  subject,
  body,
  buttonLabel,
}: QuillEmailProps & { buttonLabel: string }) {
  return (
    <div>
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("my_modal_2") as HTMLDialogElement
          )?.showModal()
        }
      >
        {buttonLabel}
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="w-11/12 max-w-5xl modal-box">
          <Email body={body} email={email} name={name} subject={subject} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
