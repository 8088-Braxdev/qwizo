"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  const { user } = useAuth();
  const [sets, setSets] = useState<any[]>([]);
  useEffect(() => {
    const uid = user?.id || "u-demo";
    fetch(`/api/quizzes?creatorId=${uid}&visibility=public`, { headers: { "x-user-id": uid } }).then((r) => r.json()).then((d) => setSets(d.studySets || []));
  }, [user]);
  if (!user) return <div className="container py-8">Please sign in.</div>;
  return (
    <div className="container py-8 max-w-3xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">{user.displayName}</h1>
        <p className="text-muted">@{user.username}</p>
        {user.bio && <p className="mt-2">{user.bio}</p>}
        <div className="mt-4 text-sm text-muted">XP: {user.xp} · Streak: {user.streak}</div>
      </Card>
      <h2 className="text-xl font-semibold mt-8">Created content</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {sets.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="font-medium">{s.title}</div>
            <div className="text-sm text-muted">{s.status}</div>
          </Card>
        ))}
        {sets.length === 0 && <p className="text-muted">No published content yet.</p>}
      </div>
    </div>
  );
}

