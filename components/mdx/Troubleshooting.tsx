/**
 * Jak używać w lekcji MDX:
 *
 *   <Troubleshooting>
 *     <Issue title="Dioda nie świeci">
 *     Sprawdź polaryzację diody i wartość rezystora.
 *     </Issue>
 *   </Troubleshooting>
 */
import type { ReactNode } from "react";

interface TroubleshootingProps {
  title?: string;
  children: ReactNode;
}

interface IssueProps {
  title: string;
  children: ReactNode;
}

export function Troubleshooting({
  title = "Gdy coś nie działa",
  children,
}: TroubleshootingProps) {
  return (
    <section className="forbot-troubleshooting my-6 rounded-md border border-[var(--forbot-warning-line)] bg-[var(--forbot-warning)] px-4 py-3">
      <p className="forbot-label mb-3 text-sm font-semibold uppercase">
        {title}
      </p>
      <div className="space-y-3 text-sm">{children}</div>
    </section>
  );
}

export function Issue({ title, children }: IssueProps) {
  return (
    <section className="rounded-md border border-amber-300 bg-white/70 px-3 py-2">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-1 leading-6">{children}</div>
    </section>
  );
}
