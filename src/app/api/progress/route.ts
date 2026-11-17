import { NextRequest, NextResponse } from "next/server";
import { getUserProgress, listAttemptsByUser, getUser, getUserAchievements, checkAchievements } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

export async function GET(req: NextRequest) {
  ensureSeed();
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const progress = getUserProgress(userId);
  const attempts = listAttemptsByUser(userId);
  const user = getUser(userId);
  const ach = checkAchievements(userId);
  const achievements = getUserAchievements(userId);
  return NextResponse.json({ progress, attempts, user, achievements, newAchievements: ach });
}

