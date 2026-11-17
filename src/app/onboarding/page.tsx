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
  const { user } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(user?.interests || []);

  function toggle(id: string) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  function finish() {
    router.push("/home");
  }

  return (
    <div className="container-narrow section">
      <h1 className="h1">Choose your interests</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>We'll personalize your experience.</p>
      <div className="grid-3" style={{ marginTop: "2rem" }}>
        {INTERESTS.map((i) => (
          <button
            key={i.id}
            onClick={() => toggle(i.id)}
            className="card"
            style={{
              textAlign: "left", cursor: "pointer",
              borderColor: selected.includes(i.id) ? "var(--primary)" : "var(--border)",
              background: selected.includes(i.id) ? "var(--primary-soft)" : "var(--surface)",
            }}
          >
            <div className="h3" style={{ fontSize: "1rem" }}>{i.name}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Button onClick={finish}>Continue to Qwizo</Button>
      </div>
    </div>
  );
}
