/**
 * Course landing page. Static, Polish.
 */
import Link from "next/link";

import { getAllLessons } from "@/lib/content";

export default function Home() {
  const total = getAllLessons().length;

  return (
    <main className="site-shell mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="article-meta text-xs uppercase tracking-wider">
          Technikum Technologii Cyfrowych · Szczecin · 2026
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Podstawy programowania i budowy robotów z Arduino
        </h1>
        <p className="article-summary text-lg">
          80 godzin dydaktycznych · 10 dni szkoleniowych · 5 weekendów szkoleniowych
          (maj–czerwiec 2026). Materiały kursu w formie lekcji online.
        </p>
      </header>

      <section className="grid gap-4">
        <Link
          href="/harmonogram"
          className="landing-card p-5 transition-colors"
        >
          <h2 className="text-lg font-semibold">Harmonogram</h2>
          <p className="mt-1 text-sm opacity-70">
            10 dni szkoleniowych w 5 weekendach. Lekcje uporządkowane chronologicznie.
          </p>
        </Link>
      </section>

      <footer className="mt-auto text-xs opacity-60">
        Trener: Viktar Taustyka · zleceniodawca: West Pomeranian ·{" "}
        {total === 0
          ? "Materiały w przygotowaniu."
          : `${total} opublikowanych lekcji.`}
      </footer>
    </main>
  );
}
