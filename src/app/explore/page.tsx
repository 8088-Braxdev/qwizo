"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Explore() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState<any[]>([]);
  const [sets, setSets] = useState<any[]>([]);

  function load() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (topic) params.set("topicId", topic);
    fetch("/api/explore?" + params.toString()).then((r) => r.json()).then((d) => {
      setSets(d.studySets || []);
      setTopics(d.topics || []);
    });
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container section">
      <h1 className="h1">Explore</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>Discover learning materials created by the community.</p>
      <div className="row" style={{ marginTop: "1.5rem" }}>
        <input className="input" placeholder="Search topics, titles..." value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <select className="select" value={topic} onChange={(e) => setTopic(e.target.value)} style={{ minWidth: 160 }}>
          <option value="">All topics</option>
          {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <Button onClick={load}>Search</Button>
      </div>
      <div className="grid-3" style={{ marginTop: "2rem" }}>
        {sets.map((s: any) => (
          <Card key={s.id} className="card-hover">
            <h3 className="h3">{s.title}</h3>
            <p className="muted line-clamp-3" style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{s.description}</p>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <Link href={`/study-set/${s.id}`}><Button variant="ghost" className="small">Details</Button></Link>
              <Link href={`/quiz/${s.quizzes?.[0]?.id || s.id}/play`}><Button variant="primary" className="small">Start</Button></Link>
            </div>
          </Card>
        ))}
        {sets.length === 0 && <p className="empty">No content found.</p>}
      </div>
    </div>
  );
}
