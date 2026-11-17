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
  if (!user) return <div className="container section"><p className="muted">Please sign in.</p></div>;
  return (
    <div className="container-narrow section">
      <Card>
        <h1 className="h2">{user.displayName}</h1>
        <p className="muted">@{user.username}</p>
        {user.bio && <p style={{ marginTop: "0.75rem" }}>{user.bio}</p>}
        <div className="muted small" style={{ marginTop: "0.75rem" }}>XP: {user.xp} · Streak: {user.streak}</div>
      </Card>
      <h2 className="h2" style={{ marginTop: "2rem" }}>Created content</h2>
      <div className="grid-2" style={{ marginTop: "1rem" }}>
        {sets.map((s) => (
          <Card key={s.id}><div className="h3" style={{ fontSize: "1rem" }}>{s.title}</div><div className="muted small">{s.status}</div></Card>
        ))}
        {sets.length === 0 && <p className="muted">No published content yet.</p>}
      </div>
    </div>
  );
}
