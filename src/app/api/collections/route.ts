import { NextRequest, NextResponse } from "next/server";
import { listCollections, createCollection, getCollection } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";

export async function GET(req: NextRequest) {
  ensureSeed();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || undefined;
  const visibility = (searchParams.get("visibility") as any) || undefined;
  if (searchParams.get("id")) {
    const c = getCollection(searchParams.get("id")!);
    return NextResponse.json({ collection: c });
  }
  return NextResponse.json({ collections: listCollections({ ownerId: userId, visibility }) });
}

export async function POST(req: NextRequest) {
  ensureSeed();
  const body = await req.json();
  const userId = req.headers.get("x-user-id") || req.cookies.get("qwizo_uid")?.value || "u-demo";
  const c = createCollection({ ownerId: userId, title: body.title, description: body.description, visibility: body.visibility || "private", items: body.items });
  return NextResponse.json({ collection: c });
}

