import type { ReactNode } from "react";

type BadgeVariant = "default" | "block" | "difficulty" | "status" | "muted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: "forbot-badge",
  block: "forbot-badge font-mono uppercase",
  difficulty: "forbot-badge",
  status: "forbot-badge",
  muted: "border border-slate-200 bg-slate-50 text-slate-600",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[11px] font-semibold leading-none ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
