import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/data/store";
import { ensureSeed } from "@/lib/data/store";
export async function GET() { ensureSeed(); return NextResponse.json({ leaderboard: getLeaderboard() }); }

