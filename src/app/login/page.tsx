"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");

  async function handleGoogle() {
    await signIn("u-demo");
    router.push("/onboarding");
  }
  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    await signIn("u-" + (email.split("@")[0] || "user"));
    router.push("/onboarding");
  }

  return (
    <div className="container-narrow section">
      <Card>
        <h1 className="h2" style={{ textAlign: "center" }}>Sign in to Qwizo</h1>
        <p className="muted" style={{ textAlign: "center", marginTop: "0.5rem" }}>Learn. Play. Connect.</p>
        <div className="stack" style={{ marginTop: "1.5rem" }}>
          <Button className="btn-block" onClick={handleGoogle}>Continue with Google</Button>
          <div className="muted small" style={{ textAlign: "center" }}>or</div>
          <form onSubmit={handleEmail} className="stack">
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button variant="outline" className="btn-block" type="submit">Send magic link</Button>
          </form>
        </div>
        <p className="muted small" style={{ marginTop: "1.5rem", textAlign: "center" }}>
          By continuing you agree to our terms. No password required.
        </p>
      </Card>
    </div>
  );
}
