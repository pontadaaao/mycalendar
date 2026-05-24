import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "solid" | "soft" | "ghost";
};

export function PrimaryButton({
  children,
  className = "",
  variant = "solid",
  type = "button",
  ...rest
}: PrimaryButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50";
  const styles =
    variant === "solid"
      ? "bg-mamalog-main text-white shadow-md shadow-mamalog-main/25 hover:bg-[#ff6b80]"
      : variant === "soft"
        ? "bg-mamalog-sub text-mamalog-main hover:bg-[#ffd6dc]"
        : "bg-transparent text-mamalog-main ring-2 ring-mamalog-main/30 hover:bg-white";

  return (
    <button type={type} className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}
