import { NextRequest, NextResponse } from "next/server";
import { createDocument, listDocumentsByUser, getDocument, updateDocument } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

export async function GET(req: NextRequest) {
  ensureSeed();
  const { searchParams } = new URL(req.url);
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const id = searchParams.get("id");
  if (id) {
    const d = getDocument(id);
    return NextResponse.json({ document: d });
  }
  return NextResponse.json({ documents: listDocumentsByUser(userId) });
}

export async function POST(req: NextRequest) {
  ensureSeed();
  const body = await req.json();
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const doc = createDocument({
    userId,
    title: body.title || "Untitled document",
    fileType: body.fileType || "text",
    storagePath: "local/" + Math.random().toString(36).slice(2),
    processingStatus: "uploaded",
    extractedText: body.text || "",
  });
  // simulate processing
  setTimeout(() => updateDocument(doc.id, { processingStatus: "ready", extractedText: body.text || "" }), 10);
  return NextResponse.json({ document: doc });
}

