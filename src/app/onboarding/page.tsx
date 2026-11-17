"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const INTERESTS = [
  { id: "t-js", name: "JavaScript" },
  { id: "t-react", name: "React" },
  { id: "t-html", name: "HTML & CSS" },
  { id: "t-science", name: "Science" },
  { id: "t-history", name: "History" },
  { id: "t-lang", name: "Languages" },
];

export default function Onboarding() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(user?.interests || []);

  function toggle(id: string) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  async function finish() {
    if (user) {
      await fetch("/api/me", { method: "PATCH" }).catch(() => {});
    }
    router.push("/home");
  }

  return (
    <div className="container py-16 max-w-2xl">
      <h1 className="text-3xl font-bold">Choose your interests</h1>
      <p className="text-muted mt-2">We'll personalize your experience.</p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {INTERESTS.map((i) => (
          <button
            key={i.id}
            onClick={() => toggle(i.id)}
            className={`p-4 rounded-xl border text-left transition ${selected.includes(i.id) ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
          >
            <div className="font-medium">{i.name}</div>
          </button>
        ))}
      </div>
      <div className="mt-8">
        <Button onClick={finish}>Continue to Qwizo</Button>
      </div>
    </div>
  );
}

