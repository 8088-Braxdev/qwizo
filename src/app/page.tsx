import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div>
      <section className="container py-20 text-center">
        <span className="badge">Social Learning Network</span>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-ink">
          Turn knowledge into <span className="text-blue-500">interactive experiences</span>
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Qwizo helps you create, discover, share, and play with learning content. Upload notes, generate quizzes with AI, challenge friends, and track your progress.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/login"><Button>Get started</Button></Link>
          <Link href="/explore"><Button variant="secondary">Explore content</Button></Link>
        </div>
      </section>

      <section className="container py-12 grid md:grid-cols-3 gap-6">
        {[
          { title: "Learn", desc: "Quizzes, flashcards, and explanations from your own materials." },
          { title: "Play", desc: "Daily challenges, XP, streaks, and leaderboards." },
          { title: "Create", desc: "AI-powered or manual creation. You stay in control." },
        ].map((f) => (
          <Card key={f.title} className="p-6">
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-muted">{f.desc}</p>
          </Card>
        ))}
      </section>

      <section className="container py-12">
        <Card className="p-8 text-center bg-blue-50 border-blue-100">
          <h2 className="text-2xl font-semibold">Ready to learn?</h2>
          <p className="mt-2 text-muted">Create your first quiz in minutes.</p>
          <div className="mt-4">
            <Link href="/create"><Button>Create now</Button></Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

