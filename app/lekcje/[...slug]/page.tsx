/**
 * Dynamic lesson route — /lekcje/<dayFolder>/<fileSlug>
 *
 * Walks `content/lekcje/**\/*.mdx`, statically pre-renders one page per
 * lesson where `publish: true`. Compiles MDX server-side via `lib/mdx.ts`.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getAllLessons,
  getLessonBySegments,
  type Lesson,
} from "@/lib/content";
import { renderLesson } from "@/lib/mdx";
import { Shell } from "@/components/layout/Shell";
import { Hardware, Objectives, Prerequisites } from "@/components/mdx";
import { Badge, Pagination } from "@/components/ui";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ slug: l.segments }));
}

function resolvePrerequisites(
  prerequisites: string[],
  lessons: Lesson[],
) {
  return prerequisites.map((item) => {
    const normalized = item.replace(/^\/?lekcje\//, "");
    const match = lessons.find((lesson) => {
      const frontmatterSlug = `${lesson.dayFolder}/${lesson.frontmatter.slug}`;
      const fileSlug = `${lesson.dayFolder}/${lesson.fileSlug}`;
      return (
        normalized === frontmatterSlug ||
        normalized === fileSlug ||
        item === lesson.href
      );
    });

    return match
      ? { label: match.frontmatter.title, href: match.href }
      : { label: item };
  });
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

  const lessons = getAllLessons();
  const lessonIndex = lessons.findIndex((item) => item.href === lesson.href);
  const previous = lessonIndex > 0 ? lessons[lessonIndex - 1] : undefined;
  const next =
    lessonIndex >= 0 && lessonIndex < lessons.length - 1
      ? lessons[lessonIndex + 1]
      : undefined;
  const { content } = await renderLesson(lesson.body);
  const fm = lesson.frontmatter;

  return (
    <Shell
      breadcrumbs={[
        { label: "Kurs", href: "/" },
        { label: `Zjazd ${fm.weekend}`, href: "/harmonogram" },
        { label: `Dzień ${fm.day}`, href: "/harmonogram" },
        { label: fm.title },
      ]}
      progress={{
        current: lessonIndex + 1,
        total: lessons.length,
        title: "Postęp w opublikowanych lekcjach",
      }}
    >
      <header className="not-prose mb-6">
        <p className="article-meta text-xs uppercase tracking-wider">
          Dzień {fm.day} · Zjazd {fm.weekend} ·{" "}
          <Badge variant="block">B{fm.block}</Badge> · {fm.duration} min
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{fm.title}</h1>
        <p className="article-summary mt-2 text-base">{fm.summary}</p>
      </header>

      <Objectives items={fm.objectives} />

      {fm.prerequisites.length > 0 && (
        <Prerequisites items={resolvePrerequisites(fm.prerequisites, lessons)} />
      )}

      {fm.hardware.length > 0 && <Hardware items={fm.hardware} />}

      {content}

      <Pagination
        previous={
          previous
            ? {
                title: previous.frontmatter.title,
                href: previous.href,
              }
            : undefined
        }
        next={
          next
            ? {
                title: next.frontmatter.title,
                href: next.href,
              }
            : undefined
        }
      />
    </Shell>
  );
}
