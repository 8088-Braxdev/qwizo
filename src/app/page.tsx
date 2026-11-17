import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div>
      <section className="hero container">
        <span className="badge">Social Learning Network</span>
        <h1 className="hero-title" style={{ marginTop: "1.25rem" }}>
          Turn knowledge into <span className="accent">interactive experiences</span>
        </h1>
        <p className="hero-sub">
          Qwizo helps you create, discover, share, and play with learning content. Upload notes, generate quizzes with AI, challenge friends, and track your progress.
        </p>
        <div className="hero-actions">
          <Link href="/login"><Button>Get started</Button></Link>
          <Link href="/explore"><Button variant="outline">Explore content</Button></Link>
        </div>
      </section>

      <section className="section container">
        <div className="grid-3">
          {[
            { title: "Learn", desc: "Quizzes, flashcards, and explanations from your own materials." },
            { title: "Play", desc: "Daily challenges, XP, streaks, and leaderboards." },
            { title: "Create", desc: "AI-powered or manual creation. You stay in control." },
          ].map((f) => (
            <Card key={f.title} className="card-hover">
              <h3 className="h3">{f.title}</h3>
              <p className="muted" style={{ marginTop: "0.5rem" }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section container">
        <Card className="card-accent" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <h2 className="h2">Ready to learn?</h2>
          <p className="muted" style={{ marginTop: "0.5rem" }}>Create your first quiz in minutes.</p>
          <div style={{ marginTop: "1.5rem" }}>
            <Link href="/create"><Button variant="accent">Create now</Button></Link>
          </div>
        </Card>
      </section>

      <footer className="footer">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <span>© Qwizo — A BraxCode Digitals Foundation product</span>
          <span>Learn. Play. Connect.</span>
        </div>
      </footer>
    </div>
  );
}
