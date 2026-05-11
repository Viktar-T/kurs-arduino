/**
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
    <section className="my-6 rounded-md border border-indigo-300 bg-indigo-50 px-4 py-3 dark:border-indigo-800 dark:bg-indigo-950/30">
      <header className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80">
          {title}
        </h3>
        {estimate && (
          <span className="text-xs opacity-70">~{estimate}</span>
        )}
      </header>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}
