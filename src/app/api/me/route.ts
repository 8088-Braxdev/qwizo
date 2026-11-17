import { NextRequest, NextResponse } from "next/server";
import { getUser, createUser, ensureSeed } from "@/lib/data/store";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  ensureSeed();
  const uid = req.headers.get("x-user-id") || req.cookies.get(SESSION_COOKIE)?.value || "u-demo";
  let user = getUser(uid);
  if (!user) {
    user = createUser({ id: uid, username: uid, displayName: uid });
  }
  return NextResponse.json({ user });
}

