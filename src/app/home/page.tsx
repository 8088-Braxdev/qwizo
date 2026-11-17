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
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Welcome back{user ? `, ${user.displayName}` : ""}</h1>
      <p className="text-muted mt-1">Keep your streak going.</p>

      <div className="mt-6 grid md:grid-cols-4 gap-4">
        <Card className="p-5"><div className="text-sm text-muted">XP</div><div className="text-2xl font-bold">{progress?.progress?.xp ?? 0}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted">Streak</div><div className="text-2xl font-bold">{progress?.progress?.streak ?? 0} days</div></Card>
        <Card className="p-5"><div className="text-sm text-muted">Quizzes</div><div className="text-2xl font-bold">{progress?.progress?.attempts ?? 0}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted">Accuracy</div><div className="text-2xl font-bold">{progress?.progress?.accuracy ?? 0}%</div></Card>
      </div>

      {challenge?.challenge && (
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{challenge.challenge.title}</h2>
              <p className="text-muted">{challenge.challenge.description}</p>
            </div>
            <Link href={challenge.challenge.quizId ? `/quiz/${challenge.challenge.quizId}/play` : "/explore"}>
              <Button>{challenge.completed ? "Completed" : "Start"}</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Discover</h2>
          <Link href="/explore" className="text-blue-700 text-sm">View all</Link>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {sets.map((s: any) => (
            <Card key={s.id} className="p-5">
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted mt-1 line-clamp-2">{s.description}</p>
              <div className="mt-3">
                <Link href={`/quiz/${s.quizzes?.[0]?.id || s.id}/play`}><Button variant="secondary" className="text-sm">Start</Button></Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

