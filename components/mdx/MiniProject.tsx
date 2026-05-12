/**
 * Jak używać w lekcji MDX:
 *
 *   <MiniProject title="Sygnalizator LED" goal="Połącz kod, rezystor i diodę LED">
 *   Zbuduj układ i zmień tempo migania diody.
 *   </MiniProject>
 *
 * <MiniProject title="…" goal="…">…</MiniProject>
 *
 * End-of-day or end-of-block integrative project. Server Component.
 */
import type { ReactNode } from "react";

interface MiniProjectProps {
  title: string;
  goal?: string;
  children: ReactNode;
}

export function MiniProject({ title, goal, children }: MiniProjectProps) {
  return (
    <section className="forbot-miniproject border-l-4 px-5 py-4">
      <p className="forbot-label mb-1 text-xs font-semibold uppercase">
        Mini-projekt
      </p>
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
