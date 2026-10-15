/**
 * 404 page (Polish). Used for unknown URLs and for `notFound()` calls.
 */
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nie znaleziono strony — Kurs Arduino",
};

export default function NotFound() {
  return (
    <main className="site-shell mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <p className="article-meta text-xs uppercase tracking-wider">Błąd 404</p>
      <h1 className="text-4xl font-semibold tracking-tight">
        Nie znaleziono strony
      </h1>
      <p className="article-summary text-lg">
        Ta strona nie istnieje albo lekcja została przeniesiona. Wybierz lekcję
        z harmonogramu.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/harmonogram" className="landing-card p-5 transition-colors">
          <h2 className="text-lg font-semibold">Harmonogram</h2>
          <p className="mt-1 text-sm opacity-70">Wszystkie lekcje dzień po dniu.</p>
        </Link>
        <Link href="/" className="landing-card p-5 transition-colors">
          <h2 className="text-lg font-semibold">Strona główna</h2>
          <p className="mt-1 text-sm opacity-70">Powrót na stronę kursu.</p>
        </Link>
      </div>
    </main>
  );
}
