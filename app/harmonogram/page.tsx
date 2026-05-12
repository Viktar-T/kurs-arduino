/**
 * /harmonogram — by-day timeline (primary delivery view).
 */
import Link from "next/link";
import type { Metadata } from "next";

import { buildNav } from "@/lib/content";
import { Shell } from "@/components/layout/Shell";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Harmonogram — 10 dni · Kurs Arduino",
  description:
    "Plan 10 dni szkoleniowych kursu Arduino dla TTC Szczecin (5 zjazdów, maj–czerwiec 2026).",
};

const WEEKEND_DATES: Record<number, string> = {
  1: "16–17.05.2026",
  2: "23–24.05.2026",
  3: "30–31.05.2026",
  4: "13–14.06.2026",
  5: "20–21.06.2026",
};

export default function HarmonogramPage() {
  const weekends = buildNav();

  return (
    <Shell>
      <h1>Harmonogram — 10 dni szkoleniowych</h1>
      <p className="article-summary">
        Plan kursu rozłożony na 5 zjazdów weekendowych, 10 dni po 8 godzin
        dydaktycznych (łącznie 80 h).
      </p>

      {weekends.length === 0 ? (
        <p className="opacity-60">
          Brak opublikowanych lekcji. Dodaj pliki MDX do{" "}
          <code>content/lekcje/dzien-NN/</code>.
        </p>
      ) : (
        <div className="space-y-8">
          {weekends.map((w) => (
            <section key={w.weekend}>
              <h2 className="text-lg font-semibold">
                Zjazd {w.weekend}
                <span className="ml-2 text-sm font-normal opacity-60">
                  {WEEKEND_DATES[w.weekend]}
                </span>
              </h2>
              <div className="mt-2 space-y-3">
                {w.days.map((d) => (
                  <article key={d.day} className="forbot-card p-3">
                    <h3 className="text-base font-medium">Dzień {d.day}</h3>
                    <ul className="mt-1 space-y-1 text-sm">
                      {d.lessons.map((l) => (
                        <li key={l.href} className="flex items-baseline gap-2">
                          <Badge variant="block">B{l.block}</Badge>
                          <Link href={l.href} className="hover:underline">
                            {l.title}
                          </Link>
                          <span className="ml-auto text-xs opacity-60">
                            {l.duration} min
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Shell>
  );
}
