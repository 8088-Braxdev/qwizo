"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";

export default function AICreator() {
  const { user } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("AI Generated Study Set");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [count, setCount] = useState(5);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, count }) });
    const d = await res.json();
    setResult(d);
    setLoading(false);
  }

  async function save(publish: boolean) {
    const uid = user?.id || "u-demo";
    const payload = {
      title, description: "Generated from uploaded material", topicId: "t-js",
      visibility: publish ? "public" : "private", status: publish ? "published" : "draft",
      quizzes: [{
        title, description: "AI-generated quiz", difficulty: "medium",
        questions: (result.questions || []).map((q: any, i: number) => ({
          text: q.text, type: q.type,
          options: q.options.map((o: any) => ({ text: o.text, isCorrect: o.isCorrect })),
          explanation: q.explanation, position: i,
        })),
      }],
    };
    const res = await fetch("/api/quizzes", { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": uid }, body: JSON.stringify(payload) });
    const d = await res.json();
    router.push(`/study-set/${d.studySet.id}`);
  }

  return (
    <div className="container-narrow section">
      <h1 className="h1">Create with AI</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>Paste notes or text. AI will generate a draft you can review and edit.</p>
      <Card style={{ marginTop: "1.5rem" }}>
        <div className="stack">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={8} placeholder="Paste your text or notes here..." value={text} onChange={(e) => setText(e.target.value)} />
          <div className="row">
            <label className="muted small">Questions:</label>
            <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="input" style={{ width: 80 }} />
            <Button onClick={generate} disabled={!text.trim() || loading}>{loading ? "Generating..." : "Generate"}</Button>
          </div>
        </div>
      </Card>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2 className="h2">Generated draft (review before publishing)</h2>
          {result.summary && <Card style={{ marginTop: "1rem" }}><p className="muted small">{result.summary}</p></Card>}
          <div className="stack" style={{ marginTop: "1rem" }}>
            {(result.questions || []).map((q: any, i: number) => (
              <Card key={i}>
                <div className="h3">{i + 1}. {q.text}</div>
                <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem", fontSize: "0.9rem" }}>
                  {q.options.map((o: any, j: number) => (
                    <li key={j} style={{ color: o.isCorrect ? "var(--success)" : "var(--ink-soft)", fontWeight: o.isCorrect ? 600 : 400 }}>
                      {o.text}{o.isCorrect ? " ✓" : ""}
                    </li>
                  ))}
                </ul>
                {q.explanation && <div className="muted small" style={{ marginTop: "0.5rem" }}>{q.explanation}</div>}
              </Card>
            ))}
          </div>
          {(result.flashcards || []).length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 className="h3">Flashcards</h3>
              <div className="grid-2" style={{ marginTop: "0.75rem" }}>
                {result.flashcards.map((f: any, i: number) => (
                  <Card key={i}><div className="h3" style={{ fontSize: "1rem" }}>{f.front}</div><div className="muted small" style={{ marginTop: "0.5rem" }}>{f.back}</div></Card>
                ))}
              </div>
            </div>
          )}
          <div className="row" style={{ marginTop: "1.5rem" }}>
            <Button variant="outline" onClick={() => save(false)}>Save draft</Button>
            <Button variant="accent" onClick={() => save(true)}>Publish</Button>
          </div>
        </div>
      )}
    </div>
  );
}
