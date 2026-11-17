import React from "react";

type Variant = "primary" | "accent" | "ghost" | "outline";
export function Button({ variant = "primary", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const v = variant === "primary" ? "btn-primary" : variant === "accent" ? "btn-accent" : variant === "ghost" ? "btn-ghost" : "btn-outline";
  return <button className={["btn", v, className].filter(Boolean).join(" ")} {...props} />;
}
export default Button;
