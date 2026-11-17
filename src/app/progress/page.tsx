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
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Your progress</h1>
      <div className="mt-6 grid md:grid-cols-4 gap-4">
        <Card className="p-5"><div className="text-sm text-muted">XP</div><div className="text-2xl font-bold">{p?.xp ?? 0}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted">Streak</div><div className="text-2xl font-bold">{p?.streak ?? 0}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted">Quizzes</div><div className="text-2xl font-bold">{p?.attempts ?? 0}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted">Accuracy</div><div className="text-2xl font-bold">{p?.accuracy ?? 0}%</div></Card>
      </div>

      <h2 className="text-xl font-semibold mt-8">Achievements</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-3">
        {(data?.achievements || []).map((a: any) => (
          <Card key={a.id} className="p-4"><div className="font-medium">{a.name}</div><div className="text-sm text-muted">{a.description}</div></Card>
        ))}
        {(data?.achievements || []).length === 0 && <p className="text-muted">No achievements yet.</p>}
      </div>

      <h2 className="text-xl font-semibold mt-8">Recent attempts</h2>
      <div className="mt-4 space-y-2">
        {(data?.attempts || []).slice(0, 10).map((a: any) => (
          <Card key={a.id} className="p-3 flex items-center justify-between">
            <div>Quiz {a.quizId}</div>
            <div className="text-sm text-muted">{a.score}/{a.total}</div>
          </Card>
        ))}
        {(data?.attempts || []).length === 0 && <p className="text-muted">No attempts yet.</p>}
      </div>
      <div className="mt-6"><Link href="/leaderboard"><button className="text-blue-700">View leaderboard →</button></Link></div>
    </div>
  );
}

