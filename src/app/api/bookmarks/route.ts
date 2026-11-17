import { NextRequest, NextResponse } from "next/server";
import { toggleBookmark, isBookmarked, listBookmarks, getStudySet } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

export async function GET(req: NextRequest) {
  ensureSeed();
  const { searchParams } = new URL(req.url);
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const id = searchParams.get("id");
  if (id) return NextResponse.json({ bookmarked: isBookmarked(userId, id) });
  const ids = listBookmarks(userId);
  const sets = ids.map((i) => getStudySet(i)).filter(Boolean);
  return NextResponse.json({ bookmarks: sets });
}

export async function POST(req: NextRequest) {
  ensureSeed();
  const body = await req.json();
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const bookmarked = toggleBookmark(userId, body.studySetId);
  return NextResponse.json({ bookmarked });
}

