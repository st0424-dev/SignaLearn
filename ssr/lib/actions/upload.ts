"use server"

type Action = { success: boolean; message?: string }

export async function uploadAction(prev: null | Action, formData: FormData) {
  for (const [pair1, pair2] of formData.entries()) {
    console.log(pair1, pair2)
  }

  const url = process.env.BACKEND_API + "/upload"
  const res = await fetch(url, { body: formData, method: "POST" })

  if (!res.ok) {
    console.error(await res.json())
    throw new Error("Failed to post: " + url)
  }

  return (await res.json()) as Action
}
