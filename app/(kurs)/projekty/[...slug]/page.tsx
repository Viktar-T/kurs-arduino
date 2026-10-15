/**
 * Project page route — /projekty/<project> (overview, `part: 0`) and
 * /projekty/<project>/<fileSlug> (parts).
 *
 * Walks `content/projekty/<project>/*.mdx` (see `lib/projects.ts`) and
 * statically pre-renders one page per file where `publish: true`. The layout
 * mirrors the lesson page (`app/(kurs)/lekcje/[...slug]/page.tsx`): keep the
 * two in sync.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "katex/dist/katex.min.css";

import { resolveLessonRef } from "@/lib/content";
import {
  getAllProjectPages,
  getProject,
  getProjectPageBySegments,
} from "@/lib/projects";
import { renderLesson } from "@/lib/mdx";
import { Hardware, Objectives, Prerequisites } from "@/components/mdx";
import { Breadcrumb, Pagination, type BreadcrumbItem } from "@/components/ui";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * The build pre-renders exactly these pages; any other slug ends in
 * `notFound()` below. Deliberately no `dynamicParams = false`: `next dev`
 * caches these params and refreshes them in the background, so with it a
 * page added while the dev server runs 404s until that refresh lands (and
 * the option must be a literal, so it can't be turned off for dev only).
 */
export function generateStaticParams() {
  return getAllProjectPages().map((page) => ({ slug: page.segments }));
}

/** `/projekty/<project>` or `/projekty/<project>/<fileSlug>` → that published page. */
function resolveProjectRef(ref: string) {
  const match = /^\/projekty\/([^?#]+?)\/?$/.exec(ref.trim());
  return match ? getProjectPageBySegments(match[1].split("/")) : undefined;
}

/** Entries are lesson hrefs or project page hrefs; anything else stays plain text. */
function resolvePrerequisites(prerequisites: string[]) {
  return prerequisites.map((item) => {
    const match = item.trim().startsWith("/projekty/")
      ? resolveProjectRef(item)
      : resolveLessonRef(item);
    return match
      ? { label: match.frontmatter.title, href: match.href }
      : { label: item };
  });
}

/**
 * True when the page body places `<Component …>` itself (outside code
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

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const page = getProjectPageBySegments(slug);
  if (!page) return {};
  return {
    title: `${page.frontmatter.title} — Kurs Arduino`,
    description: page.frontmatter.summary,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getProjectPageBySegments(slug);
  const project = page && getProject(page.project);
  if (!page || !project) notFound();

  const fm = page.frontmatter;
  const isOverview = fm.part === 0;
  const pages = getAllProjectPages().filter(
    (item) => item.project === page.project,
  );
  const pageIndex = pages.findIndex((item) => item.href === page.href);
  const previous = pageIndex > 0 ? pages[pageIndex - 1] : undefined;
  const next =
    pageIndex >= 0 && pageIndex < pages.length - 1
      ? pages[pageIndex + 1]
      : undefined;
  const { content } = await renderLesson(page.body);

  const breadcrumbs: BreadcrumbItem[] = isOverview
    ? [
        { label: "Kurs", href: "/" },
        { label: "Projekty" },
        { label: project.title },
      ]
    : [
        { label: "Kurs", href: "/" },
        { label: "Projekty" },
        { label: project.title, href: project.href },
        { label: fm.title },
      ];

  return (
    <>
      <Breadcrumb items={breadcrumbs} />

      <article className="article-content max-w-none">
        <header className="mb-6">
          <p className="article-meta text-xs uppercase tracking-wider">
            Projekt {project.title} ·{" "}
            {isOverview ? "Wprowadzenie" : `Część ${fm.part}`}
            {fm.duration && ` · ${fm.duration} min`}
          </p>
          <h1 className="mt-1 text-3xl font-semibold">{fm.title}</h1>
          <p className="article-summary mt-2 text-base">{fm.summary}</p>
        </header>

        {!bodyRenders(page.body, "Objectives") && (
          <Objectives
            items={fm.objectives}
            title={isOverview ? "Cele projektu" : "Cele tej części"}
          />
        )}

        {fm.prerequisites.length > 0 &&
          !bodyRenders(page.body, "Prerequisites") && (
            <Prerequisites items={resolvePrerequisites(fm.prerequisites)} />
          )}

        {fm.hardware.length > 0 && !bodyRenders(page.body, "Hardware") && (
          <Hardware items={fm.hardware} />
        )}

        {content}

        <Pagination
          labels={{
            nav: `Nawigacja po projekcie ${project.title}`,
            previous: "Wstecz",
            next: "Dalej",
          }}
          previous={
            previous
              ? { title: previous.frontmatter.title, href: previous.href }
              : undefined
          }
          next={
            next ? { title: next.frontmatter.title, href: next.href } : undefined
          }
        />
      </article>
    </>
  );
}
