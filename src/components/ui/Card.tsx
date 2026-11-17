import React from "react";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["bg-white border border-slate-200 rounded-2xl shadow-sm", className].filter(Boolean).join(" ")} {...props} />;
}
export default Card;

