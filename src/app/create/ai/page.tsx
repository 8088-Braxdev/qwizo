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
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Create with AI</h1>
      <p className="text-muted mt-1">Paste notes or text. AI will generate a draft you can review and edit.</p>
      <Card className="p-6 mt-6 space-y-4">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea rows={8} placeholder="Paste your text or notes here..." value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">Questions:</label>
          <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-20 rounded-xl border border-slate-300 px-3 py-2" />
          <Button onClick={generate} disabled={!text.trim() || loading}>{loading ? "Generating..." : "Generate"}</Button>
        </div>
      </Card>

      {result && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Generated draft (review before publishing)</h2>
          {result.summary && <Card className="p-4 text-sm text-muted">{result.summary}</Card>}
          {(result.questions || []).map((q: any, i: number) => (
            <Card key={i} className="p-5">
              <div className="font-medium">{i + 1}. {q.text}</div>
              <ul className="mt-2 text-sm space-y-1">
                {q.options.map((o: any, j: number) => (
                  <li key={j} className={o.isCorrect ? "text-green-600 font-medium" : "text-slate-600"}>{o.text}{o.isCorrect ? " ✓" : ""}</li>
                ))}
              </ul>
              {q.explanation && <div className="mt-2 text-xs text-muted">{q.explanation}</div>}
            </Card>
          ))}
          {(result.flashcards || []).length > 0 && (
            <div>
              <h3 className="font-semibold mt-4">Flashcards</h3>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                {result.flashcards.map((f: any, i: number) => (
                  <Card key={i} className="p-4"><div className="font-medium">{f.front}</div><div className="text-sm text-muted mt-1">{f.back}</div></Card>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={() => save(false)}>Save draft</Button>
            <Button onClick={() => save(true)}>Publish</Button>
          </div>
        </div>
      )}
    </div>
  );
}

