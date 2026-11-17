"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { fetch("/api/leaderboard").then((r) => r.json()).then((d) => setRows(d.leaderboard || [])); }, []);
  return (
    <div className="container-narrow section">
      <h1 className="h1">Leaderboard</h1>
      <div className="stack" style={{ marginTop: "1.5rem" }}>
        {rows.map((u, i) => (
          <Card key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="row">
              <span className="muted" style={{ fontWeight: 700, width: 24 }}>{i + 1}</span>
              <span style={{ fontWeight: 600 }}>{u.displayName}</span>
            </div>
            <span style={{ fontWeight: 700, color: "var(--primary)" }}>{u.xp} XP</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
