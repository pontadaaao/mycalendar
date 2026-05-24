import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-black/[0.05] bg-white/80 px-5 py-4 shadow-[0_1px_6px_-2px_rgba(58,42,42,0.06)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
