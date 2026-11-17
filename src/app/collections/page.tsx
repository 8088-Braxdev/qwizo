"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function CollectionsPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [cols, setCols] = useState<any[]>([]);

  function load() {
    const uid = user?.id || "u-demo";
    fetch(`/api/collections?userId=${uid}`, { headers: { "x-user-id": uid } }).then((r) => r.json()).then((d) => setCols(d.collections || []));
  }
  useEffect(() => { load(); }, [user]);

  async function create() {
    const uid = user?.id || "u-demo";
    await fetch("/api/collections", { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": uid }, body: JSON.stringify({ title, visibility: "private" }) });
    setTitle("");
    load();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Collections</h1>
      <div className="mt-6 flex gap-3">
        <Input placeholder="New collection title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={create} disabled={!title.trim()}>Create</Button>
      </div>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {cols.map((c) => (
          <Card key={c.id} className="p-5">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-muted mt-1">{c.items?.length || 0} items · {c.visibility}</p>
          </Card>
        ))}
        {cols.length === 0 && <p className="text-muted">No collections yet.</p>}
      </div>
    </div>
  );
}

