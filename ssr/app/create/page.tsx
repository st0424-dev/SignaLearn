import { CreateQuestion } from "@/lib/components/create";

export default function Page() {
  return (
    <div className="w-140 mx-auto">
      <h1 className="text-4xl mt-5 mb-10">Contribute to the community</h1>
      <CreateQuestion />
    </div>
  );
}
