import { NextRequest, NextResponse } from "next/server";
import { listStudySets, searchStudySets, listTopics } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

export async function GET(req: NextRequest) {
  ensureSeed();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const topicId = searchParams.get("topicId") || undefined;
  let sets = q ? searchStudySets(q) : listStudySets({ visibility: "public", topicId, status: "published" });
  if (topicId && !q) sets = sets.filter((s) => s.topicId === topicId);
  const topics = listTopics();
  const sanitized = sets.map((s: any) => ({ ...s, quizzes: (s.quizzes || []).map((q: any) => ({ ...q, questions: (q.questions || []).map((qn: any) => ({ id: qn.id, quizId: qn.quizId, text: qn.text, type: qn.type, position: qn.position, options: (qn.options || []).map((o: any) => ({ id: o.id, text: o.text })) })) })) }));
  return NextResponse.json({ studySets: sanitized, topics });
}

