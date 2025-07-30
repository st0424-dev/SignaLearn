"use server"

import z from "zod"

const SendEmailSchema = z.object({ success: z.boolean() })
type SendEmailSchema = z.infer<typeof SendEmailSchema>

export async function sendEmail(
  prevState: null | { success: boolean; error?: string },
  formData: FormData
) {
  const data = z
    .object({
      to: z.email(),
      subject: z.string(),
      text: z.string()
    })
    .parse({ to: formData.get("to"), subject: formData.get("subject"), text: formData.get("text") })

  const response = await fetch(process.env.BACKEND_API + "/email", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    method: "POST"
  })

  if (!response.ok) {
    return {
      success: false,
      error: "Failed to send the email"
    }
  }

  const parsedOutput = SendEmailSchema.safeParse(await response.json())

  if (parsedOutput.success) {
    return { success: parsedOutput.data.success }
  }

  return null
}
