"use server";

type ActionResponse = {
  success: boolean;
  message?: string;
};

export async function createQuestion(
  prevState: null | ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const url = process.env.BACKEND_API + "/upload";

  const response = await fetch(url, {
    body: formData,
    method: "POST",
  });

  if (!response.ok) {
    return {
      ...(await response.json()),
      success: false,
    };
  }

  return (await response.json()) as ActionResponse;
}
