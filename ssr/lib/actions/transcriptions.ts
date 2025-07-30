"use server"

type Action = { transcription?: string; error?: string }

export async function getTranscriptions(_: null | Action, formData: FormData): Promise<Action> {
  for (const [pair1, pair2] of formData.entries()) {
    console.log(pair1, pair2)
  }

  const url = process.env.BACKEND_API + "/transcription"
  const response = await fetch(url, { body: formData, method: "POST" })

  if (!response.ok) {
    console.error(await response.json())
    return { error: "Failed to generate the transcription" }
  }

  return (await response.json()) as { transcription: string }
}
