"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import Link from "next/link";

export default function DocumentsPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [docs, setDocs] = useState<any[]>([]);

  function load() {
    const uid = user?.id || "u-demo";
    fetch("/api/documents", { headers: { "x-user-id": uid } }).then((r) => r.json()).then((d) => setDocs(d.documents || []));
  }
  useEffect(() => { load(); }, [user]);

  async function upload() {
    const uid = user?.id || "u-demo";
    await fetch("/api/documents", { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": uid }, body: JSON.stringify({ title, text, fileType: "text" }) });
    setTitle(""); setText("");
    load();
  }

  return (
    <div className="container-narrow section">
      <h1 className="h1">Documents</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>Upload or paste learning material for AI generation.</p>
      <Card style={{ marginTop: "1.5rem" }}>
        <div className="stack">
          <Input placeholder="Document title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={6} placeholder="Paste text..." value={text} onChange={(e) => setText(e.target.value)} />
          <Button onClick={upload} disabled={!text.trim()}>Upload</Button>
        </div>
      </Card>
      <div className="stack" style={{ marginTop: "1.5rem" }}>
        {docs.map((d) => (
          <Card key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="h3" style={{ fontSize: "1rem" }}>{d.title}</div>
              <div className="muted small">{d.processingStatus}</div>
            </div>
            <Link href="/create/ai"><Button variant="ghost" className="small">Generate</Button></Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
