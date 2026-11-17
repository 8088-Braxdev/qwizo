import { NextRequest, NextResponse } from "next/server";
import { getDailyChallenge, completeDailyChallenge, isDailyCompleted } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

export async function GET(req: NextRequest) {
  ensureSeed();
  const c = getDailyChallenge();
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const completed = c ? isDailyCompleted(c.id, userId) : false;
  return NextResponse.json({ challenge: c, completed });
}

export async function POST(req: NextRequest) {
  ensureSeed();
  const body = await req.json();
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const res = completeDailyChallenge(body.challengeId, userId);
  return NextResponse.json(res);
}

