/**
 * Sidebar — Weekend → Day → Lesson, with block badges; after the weekends,
 * Projekty → Project → Page, then Narzędzia (course tools).
 *
 * Server Component: fetches nav data and passes it to DayAccordion,
 * ProjectAccordion and ToolLinks (Client Components) for interactivity.
 */
import { buildNav } from "@/lib/content";
import { buildProjectNav } from "@/lib/projects";
import { DayAccordion } from "@/components/nav/DayAccordion";
import { ProjectAccordion } from "@/components/nav/ProjectAccordion";
import { ToolLinks, type ToolLink } from "@/components/nav/ToolLinks";

const TOOLS: ToolLink[] = [
  { title: "Rejestrator CSV", href: "/narzedzia/rejestrator-csv" },
];

export function Sidebar() {
  const weekends = buildNav();
  const projects = buildProjectNav();

  return (
    <nav aria-label="Spis treści kursu" className="space-y-6 text-sm">
      {weekends.map((w) => (
        <section key={w.weekend}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-70">
            Weekend {w.weekend}
          </h2>
          <ul className="space-y-1">
            {w.days.map((d) => (
              <DayAccordion key={d.day} day={d} defaultOpen />
            ))}
          </ul>
        </section>
      ))}

      {projects.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-70">
            Projekty
          </h2>
          <ul className="space-y-1">
            {projects.map((p) => (
              <ProjectAccordion key={p.href} project={p} defaultOpen />
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-70">
          Narzędzia
        </h2>
        <ToolLinks tools={TOOLS} />
      </section>
    </nav>
  );
}
