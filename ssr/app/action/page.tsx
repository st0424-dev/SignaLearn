"use client"

import { uploadAction } from "@/lib/actions/upload"
import Form from "next/form"
import { useActionState } from "react"

export default function Page() {
  const [data, action, isPending] = useActionState(uploadAction, null)
  return (
    <Form className="p-10 space-x-5" formEncType="multipart/form-data" action={action}>
      <input className="input" type="text" name="title" defaultValue="Title" />
      <input className="input" type="text" name="answer" defaultValue="Answer" />
      <input className="file-input" type="file" name="video" />
      <button className="btn btn-soft btn-success" type="submit">
        Submit {isPending && <span className="loading loading-spinner" />}
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Form>
  )
}
