/**
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
    <section className="my-8 rounded-lg border-2 border-emerald-300 bg-emerald-50 px-5 py-4 dark:border-emerald-800 dark:bg-emerald-950/30">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
        Mini-projekt
      </p>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {goal && (
        <p className="mb-3 text-sm opacity-80">
          <span className="font-semibold">Cel:</span> {goal}
        </p>
      )}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}
