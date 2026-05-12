/**
 * Jak używać w lekcji MDX:
 *
 *   <Task title="Sprawdź działanie LED" estimate="10 min">
 *   Wgraj program, a potem zmień czas świecenia diody.
 *   </Task>
 *
 * <Task title="…" estimate="15 min">…</Task>
 *
 * Student task box. Polish-labeled. Server Component.
 */
import type { ReactNode } from "react";

interface TaskProps {
  title?: string;
  estimate?: string;
  children: ReactNode;
}

export function Task({ title = "Zadanie", estimate, children }: TaskProps) {
  return (
    <section className="forbot-task border-l-4 px-4 py-3">
      <header className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="forbot-label text-sm font-semibold uppercase">
          {title}
        </h3>
        {estimate && (
          <span className="text-xs opacity-70">~{estimate}</span>
        )}
      </header>
      <div className="max-w-none text-sm">{children}</div>
    </section>
  );
}
