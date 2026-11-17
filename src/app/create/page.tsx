import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CreateIndex() {
  return (
    <div className="container section">
      <h1 className="h1">Create learning content</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>Choose how you want to create.</p>
      <div className="grid-2" style={{ marginTop: "2rem" }}>
        <Card className="card-hover">
          <h2 className="h2">Manual creation</h2>
          <p className="muted" style={{ marginTop: "0.5rem" }}>Build quizzes and flashcards by hand.</p>
          <div style={{ marginTop: "1.25rem" }}><Link href="/create/quiz"><Button>Create quiz</Button></Link></div>
        </Card>
        <Card className="card-hover">
          <h2 className="h2">AI creation</h2>
          <p className="muted" style={{ marginTop: "0.5rem" }}>Upload a document or paste text and generate questions.</p>
          <div style={{ marginTop: "1.25rem" }}><Link href="/create/ai"><Button variant="accent">Create with AI</Button></Link></div>
        </Card>
      </div>
    </div>
  );
}
