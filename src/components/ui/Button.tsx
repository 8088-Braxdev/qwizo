import React from "react";

type Variant = "primary" | "secondary" | "ghost";
export function Button({ variant = "primary", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-medium transition disabled:opacity-50";
  const v = variant === "primary" ? "bg-blue-500 text-white hover:bg-blue-700"
    : variant === "secondary" ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
    : "bg-transparent text-slate-700 hover:bg-slate-100";
  return <button className={[base, v, className].filter(Boolean).join(" ")} {...props} />;
}
export default Button;

