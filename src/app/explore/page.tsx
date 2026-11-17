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
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Explore</h1>
      <p className="text-muted mt-1">Discover learning materials created by the community.</p>
      <div className="mt-6 flex flex-col md:flex-row gap-3">
        <Input placeholder="Search topics, titles..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="rounded-xl border border-slate-300 px-3 py-2.5" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All topics</option>
          {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <Button onClick={load}>Search</Button>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {sets.map((s: any) => (
          <Card key={s.id} className="p-5">
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-muted mt-1 line-clamp-3">{s.description}</p>
            <div className="mt-2 text-xs text-muted">{s.visibility}</div>
            <div className="mt-3 flex gap-2">
              <Link href={`/study-set/${s.id}`}><Button variant="secondary" className="text-sm">Details</Button></Link>
              <Link href={`/quiz/${s.quizzes?.[0]?.id || s.id}/play`}><Button className="text-sm">Start</Button></Link>
            </div>
          </Card>
        ))}
        {sets.length === 0 && <p className="text-muted col-span-full">No content found.</p>}
      </div>
    </div>
  );
}

