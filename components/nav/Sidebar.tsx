/**
 * Sidebar — Weekend → Day → Lesson, with block badges.
 *
 * Server Component: fetches nav data and passes it to DayAccordion
 * (Client Component) for interactive accordion behaviour.
 */
import { buildNav } from "@/lib/content";
import { DayAccordion } from "@/components/nav/DayAccordion";

export function Sidebar() {
  const weekends = buildNav();

  return (
    <nav aria-label="Spis treści kursu" className="space-y-6 text-sm">
      {weekends.map((w) => (
        <section key={w.weekend}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-70">
            Zjazd {w.weekend}
          </h2>
          <ul className="space-y-1">
            {w.days.map((d) => (
              <DayAccordion key={d.day} day={d} defaultOpen />
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
