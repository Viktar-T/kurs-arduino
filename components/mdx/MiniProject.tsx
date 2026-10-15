/**
 * Jak używać w lekcji MDX:
 *
 *   <MiniProject title="Sygnalizator LED" goal="Połącz kod, rezystor i diodę LED" estimate="20 min">
 *   Zbuduj układ i zmień tempo migania diody.
 *   </MiniProject>
 *
 * <MiniProject title="…" goal="…" estimate="20 min">…</MiniProject>
 *
 * End-of-day or end-of-block integrative project. Server Component.
 */
import type { ReactNode } from "react";

interface MiniProjectProps {
  title: string;
  goal?: string;
  /** Expected time, shown like in `<Task estimate>`, e.g. "20 min". */
  estimate?: string;
  children: ReactNode;
}

export function MiniProject({ title, goal, estimate, children }: MiniProjectProps) {
  return (
    <section className="forbot-miniproject border-l-4 px-5 py-4">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <p className="forbot-label text-xs font-semibold uppercase">
          Mini-projekt
        </p>
        {estimate && (
          <span className="text-xs opacity-70">~{estimate}</span>
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {goal && (
        <p className="mb-3 text-sm opacity-80">
          <span className="font-semibold">Cel:</span> {goal}
        </p>
      )}
      <div className="max-w-none text-sm">{children}</div>
    </section>
  );
}
