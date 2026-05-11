/**
 * <Callout type="note|warning|hardware|hazard|tip" title="…">…</Callout>
 *
 * Used in lessons for emphasized blocks. Server Component.
 */
import type { ReactNode } from "react";

export type CalloutType = "note" | "warning" | "hardware" | "hazard" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const STYLES: Record<CalloutType, { box: string; label: string }> = {
  note: {
    box: "border-blue-300 bg-blue-50 dark:bg-blue-950/30",
    label: "Notatka",
  },
  tip: {
    box: "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30",
    label: "Wskazówka",
  },
  warning: {
    box: "border-amber-400 bg-amber-50 dark:bg-amber-950/30",
    label: "Uwaga",
  },
  hazard: {
    box: "border-red-400 bg-red-50 dark:bg-red-950/30",
    label: "Ostrzeżenie",
  },
  hardware: {
    box: "border-slate-300 bg-slate-50 dark:bg-slate-900/40",
    label: "Sprzęt",
  },
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  const style = STYLES[type];
  return (
    <aside
      role="note"
      className={`my-4 rounded-md border-l-4 px-4 py-3 ${style.box}`}
    >
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide opacity-80">
        {title ?? style.label}
      </p>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </aside>
  );
}
