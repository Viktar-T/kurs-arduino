/**
 * Dynamic lesson route — /lekcje/<dayFolder>/<fileSlug>
 *
 * Walks `content/lekcje/**\/*.mdx`, statically pre-renders one page per
 * lesson where `publish: true`. Compiles MDX server-side via `lib/mdx.ts`.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "katex/dist/katex.min.css";

import {
  getAllLessons,
  getLessonBySegments,
  resolveLessonRef,
} from "@/lib/content";
import { renderLesson } from "@/lib/mdx";
import { Hardware, Objectives, Prerequisites } from "@/components/mdx";
import { Badge, Breadcrumb, Pagination, Progress } from "@/components/ui";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * The build pre-renders exactly these lessons; any other slug ends in
 * `notFound()` below. Deliberately no `dynamicParams = false`: `next dev`
 * caches these params and refreshes them in the background, so with it a
 * lesson added while the dev server runs 404s until that refresh lands (and
 * the option must be a literal, so it can't be turned off for dev only).
 */
export function generateStaticParams() {
  return getAllLessons().map((l) => ({ slug: l.segments }));
}

function resolvePrerequisites(prerequisites: string[]) {
  return prerequisites.map((item) => {
    const match = resolveLessonRef(item);
    return match
      ? { label: match.frontmatter.title, href: match.href }
      : { label: item };
  });
}

/**
 * True when the lesson body places `<Component …>` itself (outside code
 * fences). The page then skips rendering the same box from frontmatter,
 * so it does not appear twice.
 */
function bodyRenders(body: string, component: string) {
  const withoutCode = body.replace(
    /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1/gm,
    "",
  );
  return new RegExp(`<${component}[\\s/>]`).test(withoutCode);
}

function dayAnchor(day: number) {
  return `dzien-${String(day).padStart(2, "0")}`;
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
    <>
      <Breadcrumb
        items={[
          { label: "Kurs", href: "/" },
          { label: `Weekend ${fm.weekend}`, href: `/harmonogram#weekend-${fm.weekend}` },
          { label: `Dzień ${fm.day}`, href: `/harmonogram#${dayAnchor(fm.day)}` },
          { label: fm.title },
        ]}
      />
      <Progress
        current={lessonIndex + 1}
        total={lessons.length}
        title="Postęp w opublikowanych lekcjach"
      />

      <article className="article-content max-w-none">
        <header className="mb-6">
          <p className="article-meta text-xs uppercase tracking-wider">
            Dzień {fm.day} · Weekend {fm.weekend} ·{" "}
            <Badge variant="block">B{fm.block}</Badge> · {fm.duration} min
          </p>
          <h1 className="mt-1 text-3xl font-semibold">{fm.title}</h1>
          <p className="article-summary mt-2 text-base">{fm.summary}</p>
        </header>

        {!bodyRenders(lesson.body, "Objectives") && (
          <Objectives items={fm.objectives} />
        )}

        {fm.prerequisites.length > 0 &&
          !bodyRenders(lesson.body, "Prerequisites") && (
            <Prerequisites items={resolvePrerequisites(fm.prerequisites)} />
          )}

        {fm.hardware.length > 0 && !bodyRenders(lesson.body, "Hardware") && (
          <Hardware items={fm.hardware} />
        )}

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
      </article>
    </>
  );
}
