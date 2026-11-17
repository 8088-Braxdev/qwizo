"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";

interface Q { text: string; options: string[]; correct: number; explanation: string; }
export default function ManualQuizCreator() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topicId, setTopicId] = useState("t-js");
  const [visibility, setVisibility] = useState("private");
  const [questions, setQuestions] = useState<Q[]>([{ text: "", options: ["", "", "", ""], correct: 0, explanation: "" }]);

  function updateQ(i: number, patch: Partial<Q>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }
  function updateOpt(i: number, j: number, val: string) {
    setQuestions((qs) => qs.map((q, idx) => idx === i ? { ...q, options: q.options.map((o, k) => (k === j ? val : o)) } : q));
  }
  function addQ() { setQuestions((qs) => [...qs, { text: "", options: ["", "", "", ""], correct: 0, explanation: "" }]); }
  function removeQ(i: number) { setQuestions((qs) => qs.filter((_, idx) => idx !== i)); }

  async function save(publish: boolean) {
    const uid = user?.id || "u-demo";
    const payload = {
      title, description, topicId, visibility: publish ? "public" : visibility, status: publish ? "published" : "draft",
      quizzes: [{
        title, description, difficulty: "medium",
        questions: questions.map((q, i) => ({
          text: q.text, type: "multiple_choice",
          options: q.options.map((o, j) => ({ text: o, isCorrect: j === q.correct })),
          explanation: q.explanation, position: i,
        })),
      }],
    };
    const res = await fetch("/api/quizzes", { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": uid }, body: JSON.stringify(payload) });
    const d = await res.json();
    const ss = d.studySet;
    // publish the quiz inside by updating? study set already has status. Good.
    router.push(`/study-set/${ss.id}`);
  }

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Create a quiz</h1>
      <Card className="p-6 mt-6 space-y-4">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex gap-3">
          <select className="rounded-xl border border-slate-300 px-3 py-2.5" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            <option value="t-js">JavaScript</option>
            <option value="t-react">React</option>
            <option value="t-html">HTML & CSS</option>
            <option value="t-science">Science</option>
            <option value="t-history">History</option>
            <option value="t-lang">Languages</option>
          </select>
          <select className="rounded-xl border border-slate-300 px-3 py-2.5" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>
      </Card>

      <div className="mt-6 space-y-4">
        {questions.map((q, i) => (
          <Card key={i} className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Question {i + 1}</div>
              {questions.length > 1 && <button onClick={() => removeQ(i)} className="text-sm text-red-500">Remove</button>}
            </div>
            <Textarea placeholder="Question text" value={q.text} onChange={(e) => updateQ(i, { text: e.target.value })} />
            {q.options.map((o, j) => (
              <div key={j} className="flex items-center gap-2">
                <input type="radio" checked={q.correct === j} onChange={() => updateQ(i, { correct: j })} />
                <Input placeholder={`Option ${j + 1}`} value={o} onChange={(e) => updateOpt(i, j, e.target.value)} />
              </div>
            ))}
            <Textarea placeholder="Explanation (optional)" value={q.explanation} onChange={(e) => updateQ(i, { explanation: e.target.value })} />
          </Card>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" onClick={addQ}>Add question</Button>
        <Button onClick={() => save(false)}>Save draft</Button>
        <Button onClick={() => save(true)}>Publish</Button>
      </div>
    </div>
  );
}

