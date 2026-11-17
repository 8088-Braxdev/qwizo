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
  const [mode, setMode] = useState<"google" | "email">("google");

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
    <div className="container py-20 max-w-md">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-center">Sign in to Qwizo</h1>
        <p className="text-center text-muted mt-2">Learn. Play. Connect.</p>
        <div className="mt-6 space-y-3">
          <Button className="w-full" onClick={handleGoogle}>Continue with Google</Button>
          <div className="text-center text-sm text-muted">or</div>
          <form onSubmit={handleEmail} className="space-y-3">
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button variant="secondary" className="w-full" type="submit">Send magic link</Button>
          </form>
        </div>
        <p className="text-xs text-muted mt-6 text-center">
          By continuing you agree to our terms. No password required.
        </p>
      </Card>
    </div>
  );
}

