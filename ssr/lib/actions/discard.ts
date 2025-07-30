"use server"

import { revalidatePath } from "next/cache"
import z from "zod"

const BACKEND_API = z.string("BACKEND_URL is empty").parse(process.env.BACKEND_API)

export async function discardPendingQuestion(formData: FormData) {
  const id = z.string().parse(formData.get("id"))

  z.object({ success: z.boolean() }).parse(
    await fetch(BACKEND_API + `/ques/discard`, {
      body: JSON.stringify({ id }),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res) => res.json())
  )

  revalidatePath("/admin")
}
