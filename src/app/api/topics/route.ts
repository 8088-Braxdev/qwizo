import { NextResponse } from "next/server";
import { listTopics } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";
export async function GET() { ensureSeed(); return NextResponse.json({ topics: listTopics() }); }

