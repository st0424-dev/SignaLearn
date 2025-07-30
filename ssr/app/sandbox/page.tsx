"use client";

import { QuillEmailDialog } from "@/lib/components/quill";

export default function Page() {
  return (
    <QuillEmailDialog
      email={"shahil@email.com"}
      name={"tisha"}
      buttonLabel={`Inform crime`}
      body="Body"
      subject={"Reported to police on time"}
    />
  );
}
