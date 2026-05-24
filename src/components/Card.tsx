import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[20px] bg-white px-5 py-4 shadow-[0_2px_10px_rgba(58,42,42,0.04)] ring-1 ring-black/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}
