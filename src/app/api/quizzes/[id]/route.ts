import { NextRequest, NextResponse } from "next/server";
import { getStudySet, getQuiz, deleteStudySet, updateStudySet } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

function sanitizeQuiz(q: any) {
  return {
    ...q,
    questions: (q.questions || []).map((qn: any) => ({
      id: qn.id,
      quizId: qn.quizId,
      text: qn.text,
      type: qn.type,
      position: qn.position,
      options: (qn.options || []).map((o: any) => ({ id: o.id, text: o.text })),
    })),
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  ensureSeed();
  const { id } = await params;
  const review = new URL(req.url).searchParams.get("review") === "1";
  const ss = getStudySet(id);
  if (ss) {
    const out = review ? ss : { ...ss, quizzes: (ss.quizzes || []).map((q: any) => sanitizeQuiz(q)) };
    return NextResponse.json({ studySet: out });
  }
  const q = getQuiz(id);
  if (q) return NextResponse.json({ quiz: review ? q : sanitizeQuiz(q) });
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  ensureSeed();
  const { id } = await params;
  const body = await req.json();
  const ss = updateStudySet(id, body);
  if (!ss) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ studySet: ss });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  ensureSeed();
  const { id } = await params;
  const ok = deleteStudySet(id);
  return NextResponse.json({ ok });
}
