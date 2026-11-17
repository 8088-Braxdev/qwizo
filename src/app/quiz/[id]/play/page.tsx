"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function QuizPlay() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState<any>(null);
  const [review, setReview] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/quizzes/${id}`).then((r) => r.json()).then((d) => setQuiz(d.quiz || d.studySet?.quizzes?.[0]));
  }, [id]);

  function select(qid: string, oid: string) {
    setAnswers((a) => ({ ...a, [qid]: oid }));
  }

  async function submit() {
    const uid = user?.id || "u-demo";
    const payload = {
      quizId: id,
      answers: (quiz?.questions || []).map((q: any) => ({ questionId: q.id, selectedOptionId: answers[q.id] || null })),
    };
    const res = await fetch("/api/attempts", { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": uid }, body: JSON.stringify(payload) });
    const d = await res.json();
    setAttempt(d.attempt);
    setSubmitted(true);
    const r = await fetch(`/api/quizzes/${id}?review=1`);
    const rd = await r.json();
    setReview(rd.quiz || rd.studySet?.quizzes?.[0]);
  }

  if (!quiz) return <div className="container section"><p className="muted">Loading quiz...</p></div>;

  const questions = quiz.questions || [];

  return (
    <div className="container-narrow section">
      <h1 className="h1">{quiz.title}</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>{quiz.description}</p>

      {!submitted ? (
        <>
          <div className="stack" style={{ marginTop: "2rem" }}>
            {questions.map((q: any, idx: number) => (
              <Card key={q.id}>
                <div className="h3">{idx + 1}. {q.text}</div>
                <div className="stack" style={{ marginTop: "1rem" }}>
                  {q.options.map((o: any) => (
                    <label key={o.id} className={`option ${answers[q.id] === o.id ? "selected" : ""}`} onClick={() => select(q.id, o.id)}>
                      <input type="radio" checked={answers[q.id] === o.id} onChange={() => select(q.id, o.id)} />
                      <span>{o.text}</span>
                    </label>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <Button onClick={submit} disabled={Object.keys(answers).length < questions.length}>Submit answers</Button>
          </div>
        </>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <Card style={{ textAlign: "center" }}>
            <div className="stat-value" style={{ color: "var(--primary)" }}>{attempt?.score}/{attempt?.total}</div>
            <div className="muted">Score</div>
          </Card>
          <div className="stack" style={{ marginTop: "1.5rem" }}>
            {(review?.questions || questions).map((q: any, idx: number) => {
              const ans = attempt?.answers?.find((a: any) => a.questionId === q.id);
              const correctOpt = q.options?.find((o: any) => o.isCorrect);
              const selectedOpt = q.options?.find((o: any) => o.id === ans?.selectedOptionId);
              return (
                <Card key={q.id} className={ans?.isCorrect ? "correct" : "wrong"} style={{ borderLeft: `4px solid ${ans?.isCorrect ? "var(--success)" : "var(--danger)"}` }}>
                  <div className="h3">{idx + 1}. {q.text}</div>
                  <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                    Your answer: <span style={{ color: ans?.isCorrect ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>{selectedOpt?.text || "—"}</span>
                  </div>
                  {!ans?.isCorrect && <div style={{ fontSize: "0.9rem", color: "var(--success)", marginTop: "0.25rem" }}>Correct: {correctOpt?.text}</div>}
                  {q.explanation && <div className="muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>{q.explanation}</div>}
                </Card>
              );
            })}
          </div>
          <div className="row" style={{ marginTop: "1.5rem" }}>
            <Link href="/explore"><Button variant="ghost">Back to explore</Button></Link>
            <Link href="/home"><Button>Home</Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
