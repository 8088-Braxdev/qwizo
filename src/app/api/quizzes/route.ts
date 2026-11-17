import { NextRequest, NextResponse } from "next/server";
import { listStudySets, getStudySet, createStudySet, createQuiz, updateStudySet } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

export async function GET(req: NextRequest) {
  ensureSeed();
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId") || undefined;
  const creatorId = searchParams.get("creatorId") || undefined;
  const visibility = (searchParams.get("visibility") as any) || "public";
  const sets = listStudySets({ visibility, creatorId, topicId, status: "published" });
  const sanitized = sets.map((s: any) => ({ ...s, quizzes: (s.quizzes || []).map((q: any) => ({ ...q, questions: (q.questions || []).map((qn: any) => ({ id: qn.id, quizId: qn.quizId, text: qn.text, type: qn.type, position: qn.position, options: (qn.options || []).map((o: any) => ({ id: o.id, text: o.text })) })) })) }));
  return NextResponse.json({ studySets: sanitized });
}

export async function POST(req: NextRequest) {
  ensureSeed();
  const body = await req.json();
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const ss = createStudySet({
    creatorId: userId,
    title: body.title,
    description: body.description,
    topicId: body.topicId,
    visibility: body.visibility || "private",
    status: body.status || "draft",
  });
  if (Array.isArray(body.quizzes)) {
    const quizzes = body.quizzes.map((q: any) => {
      const quizId = q.id || "q-" + Math.random().toString(36).slice(2, 8);
      q.id = quizId; q.studySetId = ss.id;
      (q.questions || []).forEach((qn: any, i: number) => {
        qn.id = qn.id || "qn-" + Math.random().toString(36).slice(2, 8);
        qn.quizId = quizId; qn.position = i;
        if (!qn.options) qn.options = [];
        qn.options = qn.options.map((o: any, j: number) => ({ id: o.id || "o-" + Math.random().toString(36).slice(2, 7), text: o.text, isCorrect: !!o.isCorrect, position: j }));
      });
      const created = createQuiz({ studySetId: ss.id, title: q.title || body.title, description: q.description, difficulty: q.difficulty || "medium", questions: q.questions });
      return created;
    });
    ss.quizzes = quizzes;
    updateStudySet(ss.id, { quizzes });
  }
  return NextResponse.json({ studySet: ss });
}
