import { NextRequest, NextResponse } from "next/server";
import { ensureSeed } from "@/lib/data/store";

// A lightweight generator that turns pasted text into structured draft questions.
// In production this calls a real AI provider; here we provide a deterministic fallback
// so the product works even when AI services are unavailable.
export async function POST(req: NextRequest) {
  ensureSeed();
  const body = await req.json();
  const text: string = (body.text || "").trim();
  const count = Math.min(Math.max(body.count || 5, 1), 20);
  if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 20);
  const pool = sentences.length ? sentences : [text];
  const questions = [];
  for (let i = 0; i < count; i++) {
    const src = pool[i % pool.length];
    const short = src.length > 120 ? src.slice(0, 117) + "..." : src;
    // Build a multiple-choice question by masking a keyword
    const words = src.split(/\s+/).filter((w) => w.length > 5);
    const keyword = words.length ? words[Math.floor(Math.random() * words.length)].replace(/[^a-zA-Z]/g, "") : "concept";
    const qText = `According to the material, which statement is most accurate?\n\n"${short}"`;
    questions.push({
      id: "qn-" + Math.random().toString(36).slice(2, 9),
      text: qText,
      type: "multiple_choice",
      options: [
        { id: "o-" + i + "-a", text: `It discusses ${keyword} in context.`, isCorrect: true },
        { id: "o-" + i + "-b", text: "It is unrelated to the topic.", isCorrect: false },
        { id: "o-" + i + "-c", text: "It contradicts the material.", isCorrect: false },
        { id: "o-" + i + "-d", text: "It provides no useful information.", isCorrect: false },
      ],
      explanation: "Generated from the provided material. Review and edit before publishing.",
      position: i,
    });
  }
  // flashcards
  const flashcards = pool.slice(0, Math.min(5, pool.length)).map((s, i) => ({
    id: "fc-" + Math.random().toString(36).slice(2, 9),
    front: s.length > 80 ? s.slice(0, 77) + "..." : s,
    back: "Key idea from the material.",
    position: i,
  }));

  const summary = pool.slice(0, 3).join(" ").slice(0, 400);

  return NextResponse.json({ questions, flashcards, summary });
}

