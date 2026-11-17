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
    // fetch review (full quiz with explanations)
    const r = await fetch(`/api/quizzes/${id}?review=1`);
    const rd = await r.json();
    setReview(rd.quiz || rd.studySet?.quizzes?.[0]);
  }

  if (!quiz) return <div className="container py-8">Loading quiz...</div>;

  const questions = quiz.questions || [];

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold">{quiz.title}</h1>
      <p className="text-muted mt-1">{quiz.description}</p>

      {!submitted ? (
        <>
          <div className="mt-6 space-y-6">
            {questions.map((q: any, idx: number) => (
              <Card key={q.id} className="p-5">
                <div className="font-medium">{idx + 1}. {q.text}</div>
                <div className="mt-3 space-y-2">
                  {q.options.map((o: any) => (
                    <label key={o.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border ${answers[q.id] === o.id ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                      <input type="radio" name={q.id} checked={answers[q.id] === o.id} onChange={() => select(q.id, o.id)} />
                      <span>{o.text}</span>
                    </label>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={submit} disabled={Object.keys(answers).length < questions.length}>Submit answers</Button>
          </div>
        </>
      ) : (
        <div className="mt-6">
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-blue-600">{attempt?.score}/{attempt?.total}</div>
            <div className="text-muted mt-1">Score</div>
          </Card>
          <div className="mt-6 space-y-4">
            {(review?.questions || questions).map((q: any, idx: number) => {
              const ans = attempt?.answers?.find((a: any) => a.questionId === q.id);
              const correctOpt = q.options?.find((o: any) => o.isCorrect);
              const selectedOpt = q.options?.find((o: any) => o.id === ans?.selectedOptionId);
              return (
                <Card key={q.id} className={`p-5 border-l-4 ${ans?.isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
                  <div className="font-medium">{idx + 1}. {q.text}</div>
                  <div className="mt-2 text-sm">
                    Your answer: <span className={ans?.isCorrect ? "text-green-600" : "text-red-600"}>{selectedOpt?.text || "—"}</span>
                  </div>
                  {!ans?.isCorrect && <div className="text-sm text-green-600">Correct: {correctOpt?.text}</div>}
                  {q.explanation && <div className="mt-2 text-sm text-muted">{q.explanation}</div>}
                </Card>
              );
            })}
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/explore"><Button variant="secondary">Back to explore</Button></Link>
            <Link href="/home"><Button>Home</Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
