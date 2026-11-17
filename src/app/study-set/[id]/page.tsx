"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function StudySetDetail() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [ss, setSs] = useState<any>(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetch(`/api/quizzes/${id}`).then((r) => r.json()).then((d) => setSs(d.studySet || d));
  }, [id]);

  async function toggleBm() {
    const uid = user?.id || "u-demo";
    const res = await fetch("/api/bookmarks", { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": uid }, body: JSON.stringify({ studySetId: id }) });
    const d = await res.json();
    setBookmarked(d.bookmarked);
  }

  if (!ss) return <div className="container py-8">Loading...</div>;

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold">{ss.title}</h1>
      <p className="text-muted mt-2">{ss.description}</p>
      <div className="mt-4 flex gap-2">
        <Button onClick={toggleBm} variant="secondary">{bookmarked ? "Bookmarked" : "Bookmark"}</Button>
        {ss.quizzes?.[0] && <Link href={`/quiz/${ss.quizzes[0].id}/play`}><Button>Start quiz</Button></Link>}
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Quizzes</h2>
        {(ss.quizzes || []).map((q: any) => (
          <Card key={q.id} className="p-4">
            <div className="font-medium">{q.title}</div>
            <div className="text-sm text-muted">{q.questions?.length || 0} questions · {q.difficulty}</div>
            <div className="mt-2">
              <Link href={`/quiz/${q.id}/play`}><Button variant="secondary" className="text-sm">Play</Button></Link>
            </div>
          </Card>
        ))}
      </div>

      {(ss.flashcards || []).length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Flashcards</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            {ss.flashcards.map((f: any) => (
              <Card key={f.id} className="p-4">
                <div className="font-medium">{f.front}</div>
                <div className="text-sm text-muted mt-2">{f.back}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
