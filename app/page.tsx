/**
 * Course landing page. Static, Polish.
 */
import Link from "next/link";

import { getAllLessons } from "@/lib/content";

export default function Home() {
  const total = getAllLessons().length;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wider opacity-60">
          Technikum Technologii Cyfrowych · Szczecin · 2026
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Podstawy programowania i budowy robotów z Arduino
        </h1>
        <p className="text-lg opacity-80">
          80 godzin dydaktycznych · 10 dni szkoleniowych · 5 zjazdów weekendowych
          (maj–czerwiec 2026). Materiały kursu w formie lekcji online.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/harmonogram"
          className="rounded-lg border border-slate-200 p-5 transition-colors hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"
        >
          <h2 className="text-lg font-semibold">Harmonogram</h2>
          <p className="mt-1 text-sm opacity-70">
            10 dni szkoleniowych w 5 zjazdach. Lekcje uporządkowane chronologicznie.
          </p>
        </Link>
        <Link
          href="/program"
          className="rounded-lg border border-slate-200 p-5 transition-colors hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"
        >
          <h2 className="text-lg font-semibold">Program kursu</h2>
          <p className="mt-1 text-sm opacity-70">
            13 bloków tematycznych wg programu zamawiającego.
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
