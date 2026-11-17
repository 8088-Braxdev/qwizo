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
    <div className="container section">
      <h1 className="h1">Collections</h1>
      <div className="row" style={{ marginTop: "1.5rem" }}>
        <Input placeholder="New collection title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <Button onClick={create} disabled={!title.trim()}>Create</Button>
      </div>
      <div className="grid-3" style={{ marginTop: "2rem" }}>
        {cols.map((c) => (
          <Card key={c.id} className="card-hover">
            <h3 className="h3" style={{ fontSize: "1.1rem" }}>{c.title}</h3>
            <p className="muted small" style={{ marginTop: "0.25rem" }}>{c.items?.length || 0} items · {c.visibility}</p>
          </Card>
        ))}
        {cols.length === 0 && <p className="muted">No collections yet.</p>}
      </div>
    </div>
  );
}
