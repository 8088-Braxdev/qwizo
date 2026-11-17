import { NextRequest, NextResponse } from "next/server";
import { createAttempt, getAttempt } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

export async function POST(req: NextRequest) {
  ensureSeed();
  const body = await req.json();
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  try {
    const attempt = createAttempt(userId, body.quizId, body.answers || []);
    return NextResponse.json({ attempt });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  ensureSeed();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const a = getAttempt(id);
    return NextResponse.json({ attempt: a });
  }
  return NextResponse.json({ attempts: [] });
}

