/**
 * Dynamic lesson route — /lekcje/<dayFolder>/<fileSlug>
 *
 * Walks `content/lekcje/**\/*.mdx`, statically pre-renders one page per
 * lesson where `publish: true`. Compiles MDX server-side via `lib/mdx.ts`.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getAllLessons, getLessonBySegments } from "@/lib/content";
import { renderLesson } from "@/lib/mdx";
import { Shell } from "@/components/layout/Shell";
import { Hardware } from "@/components/mdx/Hardware";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ slug: l.segments }));
}

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySegments(slug);
  if (!lesson) return {};
  return {
    title: `${lesson.frontmatter.title} — Kurs Arduino`,
    description: lesson.frontmatter.summary,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySegments(slug);
  if (!lesson) notFound();

  const { content } = await renderLesson(lesson.body);
  const fm = lesson.frontmatter;

  return (
    <Shell>
      <header className="not-prose mb-6">
        <p className="text-xs uppercase tracking-wider opacity-60">
          Dzień {fm.day} · Zjazd {fm.weekend} · Blok B{fm.block} ·{" "}
          {fm.duration} min
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{fm.title}</h1>
        <p className="mt-2 text-base opacity-80">{fm.summary}</p>
      </header>

      {fm.objectives.length > 0 && (
        <section className="not-prose mb-6 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-80">
            Cele lekcji
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {fm.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      )}

      {fm.hardware.length > 0 && <Hardware items={fm.hardware} />}

      {content}
    </Shell>
  );
}
