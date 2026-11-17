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
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Documents</h1>
      <p className="text-muted mt-1">Upload or paste learning material for AI generation.</p>
      <Card className="p-6 mt-6 space-y-3">
        <Input placeholder="Document title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea rows={6} placeholder="Paste text..." value={text} onChange={(e) => setText(e.target.value)} />
        <Button onClick={upload} disabled={!text.trim()}>Upload</Button>
      </Card>
      <div className="mt-6 space-y-3">
        {docs.map((d) => (
          <Card key={d.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.title}</div>
              <div className="text-xs text-muted">{d.processingStatus}</div>
            </div>
            <Link href={`/create/ai`}><Button variant="secondary" className="text-sm">Generate</Button></Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

