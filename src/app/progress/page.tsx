"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ProgressPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const uid = user?.id || "u-demo";
    fetch("/api/progress", { headers: { "x-user-id": uid } }).then((r) => r.json()).then(setData);
  }, [user]);

  const p = data?.progress;
  return (
    <div className="container section">
      <h1 className="h1">Your progress</h1>
      <div className="grid-2" style={{ marginTop: "1.5rem" }}>
        <div className="stat"><div className="stat-label">XP</div><div className="stat-value">{p?.xp ?? 0}</div></div>
        <div className="stat"><div className="stat-label">Streak</div><div className="stat-value">{p?.streak ?? 0}</div></div>
        <div className="stat"><div className="stat-label">Quizzes</div><div className="stat-value">{p?.attempts ?? 0}</div></div>
        <div className="stat"><div className="stat-label">Accuracy</div><div className="stat-value">{p?.accuracy ?? 0}%</div></div>
      </div>

      <h2 className="h2" style={{ marginTop: "2.5rem" }}>Achievements</h2>
      <div className="grid-3" style={{ marginTop: "1rem" }}>
        {(data?.achievements || []).map((a: any) => (
          <Card key={a.id}><div className="h3" style={{ fontSize: "1rem" }}>{a.name}</div><p className="muted small" style={{ marginTop: "0.25rem" }}>{a.description}</p></Card>
        ))}
        {(data?.achievements || []).length === 0 && <p className="muted">No achievements yet.</p>}
      </div>

      <h2 className="h2" style={{ marginTop: "2.5rem" }}>Recent attempts</h2>
      <div className="stack" style={{ marginTop: "1rem" }}>
        {(data?.attempts || []).slice(0, 10).map((a: any) => (
          <Card key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>Quiz {a.quizId}</div>
            <div className="muted small">{a.score}/{a.total}</div>
          </Card>
        ))}
        {(data?.attempts || []).length === 0 && <p className="muted">No attempts yet.</p>}
      </div>
      <div style={{ marginTop: "1.5rem" }}><Link href="/leaderboard" className="navbar-link">View leaderboard →</Link></div>
    </div>
  );
}
