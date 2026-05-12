/**
 * Sidebar — Weekend → Day → Lesson, with block badges.
 *
 * Stub. Build the nav tree via `buildNav()` from `lib/content.ts`
 * (Server Component) and render. Replace shadcn primitives once
 * `npx shadcn@latest add sidebar` has been run.
 */
import Link from "next/link";

import { buildNav } from "@/lib/content";
import { Badge } from "@/components/ui";

export function Sidebar() {
  const weekends = buildNav();

  return (
    <nav aria-label="Spis treści kursu" className="space-y-6 text-sm">
      {weekends.map((w) => (
        <section key={w.weekend}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-70">
            Zjazd {w.weekend}
          </h2>
          <ul className="space-y-3">
            {w.days.map((d) => (
              <li key={d.day}>
                <p className="mb-1 font-medium">Dzień {d.day}</p>
                <ul className="space-y-1 border-l border-slate-200 pl-3">
                  {d.lessons.map((l) => (
                    <li key={l.href} className="flex items-baseline gap-2">
                      <Badge variant="block">B{l.block}</Badge>
                      <Link
                        href={l.href}
                        className="hover:underline"
                      >
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
