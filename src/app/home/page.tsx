"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [sets, setSets] = useState<any[]>([]);

  useEffect(() => {
    const uid = user?.id || "u-demo";
    fetch("/api/progress", { headers: { "x-user-id": uid } }).then((r) => r.json()).then(setProgress);
    fetch("/api/daily-challenge", { headers: { "x-user-id": uid } }).then((r) => r.json()).then(setChallenge);
    fetch("/api/explore").then((r) => r.json()).then((d) => setSets((d.studySets || []).slice(0, 6)));
  }, [user]);

  return (
    <div className="container section">
      <h1 className="h1">Welcome back{user ? `, ${user.displayName}` : ""}</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>Keep your streak going.</p>

      <div className="grid-2" style={{ marginTop: "2rem" }}>
        <div className="stat"><div className="stat-label">XP</div><div className="stat-value">{progress?.progress?.xp ?? 0}</div></div>
        <div className="stat"><div className="stat-label">Streak</div><div className="stat-value">{progress?.progress?.streak ?? 0} days</div></div>
        <div className="stat"><div className="stat-label">Quizzes</div><div className="stat-value">{progress?.progress?.attempts ?? 0}</div></div>
        <div className="stat"><div className="stat-label">Accuracy</div><div className="stat-value">{progress?.progress?.accuracy ?? 0}%</div></div>
      </div>

      {challenge?.challenge && (
        <Card style={{ marginTop: "2rem" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <h2 className="h3">{challenge.challenge.title}</h2>
              <p className="muted" style={{ marginTop: "0.25rem" }}>{challenge.challenge.description}</p>
            </div>
            <Link href={challenge.challenge.quizId ? `/quiz/${challenge.challenge.quizId}/play` : "/explore"}>
              <Button variant={challenge.completed ? "ghost" : "accent"}>{challenge.completed ? "Completed" : "Start"}</Button>
            </Link>
          </div>
        </Card>
      )}

      <div style={{ marginTop: "3rem" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 className="h2">Discover</h2>
          <Link href="/explore" className="navbar-link">View all →</Link>
        </div>
        <div className="grid-3" style={{ marginTop: "1.25rem" }}>
          {sets.map((s: any) => (
            <Card key={s.id} className="card-hover">
              <h3 className="h3">{s.title}</h3>
              <p className="muted line-clamp-2" style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{s.description}</p>
              <div style={{ marginTop: "1rem" }}>
                <Link href={`/quiz/${s.quizzes?.[0]?.id || s.id}/play`}><Button variant="outline" className="small">Start</Button></Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
