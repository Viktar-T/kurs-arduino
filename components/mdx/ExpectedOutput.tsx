/**
 * Jak używać w lekcji MDX:
 *
 *   <ExpectedOutput title="Po wgraniu programu">
 *   Dioda LED miga raz na sekundę.
 *   </ExpectedOutput>
 */
import type { ReactNode } from "react";

interface ExpectedOutputProps {
  title?: string;
  children: ReactNode;
}

export function ExpectedOutput({
  title = "Oczekiwany wynik",
  children,
}: ExpectedOutputProps) {
  return (
    <section className="forbot-expected my-6 rounded-md border border-[var(--forbot-line)] bg-[var(--forbot-panel)] px-4 py-3">
      <p className="forbot-label mb-2 text-sm font-semibold uppercase">
        {title}
      </p>
      <div className="text-sm leading-6">{children}</div>
    </section>
  );
}
