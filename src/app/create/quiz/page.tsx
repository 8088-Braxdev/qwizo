"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea, Select } from "@/components/ui/Input";

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
    router.push(`/study-set/${d.studySet.id}`);
  }

  return (
    <div className="container-narrow section">
      <h1 className="h1">Create a quiz</h1>
      <Card style={{ marginTop: "1.5rem" }}>
        <div className="stack">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <Select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              <option value="t-js">JavaScript</option>
              <option value="t-react">React</option>
              <option value="t-html">HTML & CSS</option>
              <option value="t-science">Science</option>
              <option value="t-history">History</option>
              <option value="t-lang">Languages</option>
            </Select>
            <Select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
            </Select>
          </div>
        </div>
      </Card>

      <div className="stack" style={{ marginTop: "1.5rem" }}>
        {questions.map((q, i) => (
          <Card key={i}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="h3">Question {i + 1}</div>
              {questions.length > 1 && <button onClick={() => removeQ(i)} style={{ color: "var(--danger)", background: "none", border: 0, cursor: "pointer" }}>Remove</button>}
            </div>
            <div className="stack" style={{ marginTop: "1rem" }}>
              <Textarea placeholder="Question text" value={q.text} onChange={(e) => updateQ(i, { text: e.target.value })} />
              {q.options.map((o, j) => (
                <div key={j} className="row">
                  <input type="radio" checked={q.correct === j} onChange={() => updateQ(i, { correct: j })} />
                  <Input placeholder={`Option ${j + 1}`} value={o} onChange={(e) => updateOpt(i, j, e.target.value)} />
                </div>
              ))}
              <Textarea placeholder="Explanation (optional)" value={q.explanation} onChange={(e) => updateQ(i, { explanation: e.target.value })} />
            </div>
          </Card>
        ))}
      </div>
      <div className="row" style={{ marginTop: "1.5rem" }}>
        <Button variant="ghost" onClick={addQ}>Add question</Button>
        <Button variant="outline" onClick={() => save(false)}>Save draft</Button>
        <Button variant="accent" onClick={() => save(true)}>Publish</Button>
      </div>
    </div>
  );
}
