"use server"

import z from "zod"

const BACKEND_API = z.string("BACKEND_URL is empty").parse(process.env.BACKEND_API)

export interface ApprovePendingQuestion {
  success: boolean
}
export async function approvePendingQuestion(
  prevState: null | ApprovePendingQuestion,
  formData: FormData
) {
  const id = z.string().parse(formData.get("id"))

  const res = (await fetch(BACKEND_API + `/ques/approve`, {
    body: JSON.stringify({ id }),
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }).then((res) => res.json())) as ApprovePendingQuestion

  return res
}
