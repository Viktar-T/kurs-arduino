/**
 * Jak używać w lekcji MDX:
 *
 *   <Callout type="tip" title="Wskazówka">
 *   Najpierw sprawdź poprawność połączeń na płytce stykowej.
 *   </Callout>
 *
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
    box: "forbot-callout-note",
    label: "Notatka",
  },
  tip: {
    box: "forbot-callout-tip",
    label: "Wskazówka",
  },
  warning: {
    box: "forbot-callout-warning",
    label: "Uwaga",
  },
  hazard: {
    box: "forbot-callout-hazard",
    label: "Ostrzeżenie",
  },
  hardware: {
    box: "forbot-callout-note",
    label: "Sprzęt",
  },
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  const style = STYLES[type];
  return (
    <aside
      role="note"
      className={`forbot-callout px-4 py-3 ${style.box}`}
    >
      <p className="forbot-label mb-1 text-sm font-semibold uppercase">
        {title ?? style.label}
      </p>
      <div className="max-w-none text-sm">{children}</div>
    </aside>
  );
}
