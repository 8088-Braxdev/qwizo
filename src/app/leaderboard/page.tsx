"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { fetch("/api/leaderboard").then((r) => r.json()).then((d) => setRows(d.leaderboard || [])); }, []);
  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <div className="mt-6 space-y-2">
        {rows.map((u, i) => (
          <Card key={u.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-muted w-6">{i + 1}</span>
              <span>{u.displayName}</span>
            </div>
            <span className="font-medium">{u.xp} XP</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

