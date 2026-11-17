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

  if (!ss) return <div className="container section"><p className="muted">Loading...</p></div>;

  return (
    <div className="container-narrow section">
      <h1 className="h1">{ss.title}</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>{ss.description}</p>
      <div className="row" style={{ marginTop: "1.25rem" }}>
        <Button variant="outline" onClick={toggleBm}>{bookmarked ? "Bookmarked" : "Bookmark"}</Button>
        {ss.quizzes?.[0] && <Link href={`/quiz/${ss.quizzes[0].id}/play`}><Button>Start quiz</Button></Link>}
      </div>

      <h2 className="h2" style={{ marginTop: "2.5rem" }}>Quizzes</h2>
      <div className="stack" style={{ marginTop: "1rem" }}>
        {(ss.quizzes || []).map((q: any) => (
          <Card key={q.id}>
            <div className="h3" style={{ fontSize: "1.1rem" }}>{q.title}</div>
            <div className="muted small" style={{ marginTop: "0.25rem" }}>{q.questions?.length || 0} questions · {q.difficulty}</div>
            <div style={{ marginTop: "0.75rem" }}>
              <Link href={`/quiz/${q.id}/play`}><Button variant="ghost" className="small">Play</Button></Link>
            </div>
          </Card>
        ))}
      </div>

      {(ss.flashcards || []).length > 0 && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 className="h2">Flashcards</h2>
          <div className="grid-2" style={{ marginTop: "1rem" }}>
            {ss.flashcards.map((f: any) => (
              <Card key={f.id}><div className="h3" style={{ fontSize: "1rem" }}>{f.front}</div><div className="muted small" style={{ marginTop: "0.5rem" }}>{f.back}</div></Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
