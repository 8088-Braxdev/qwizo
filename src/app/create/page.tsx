import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CreateIndex() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Create learning content</h1>
      <p className="text-muted mt-1">Choose how you want to create.</p>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Manual creation</h2>
          <p className="text-muted mt-2">Build quizzes and flashcards by hand.</p>
          <div className="mt-4"><Link href="/create/quiz"><Button>Create quiz</Button></Link></div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">AI creation</h2>
          <p className="text-muted mt-2">Upload a document or paste text and generate questions.</p>
          <div className="mt-4"><Link href="/create/ai"><Button>Create with AI</Button></Link></div>
        </Card>
      </div>
    </div>
  );
}

