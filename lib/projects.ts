/**
 * Project loader — reads every `content/projekty/<project>/*.mdx` file at
 * build time, validates frontmatter via Zod, and exposes typed lookups + the
 * sidebar tree.
 *
 * A project is a series of pages outside the 10-day timetable (e.g.
 * "Monitorowanie"). Each sibling folder of `content/projekty/` is one
 * project; its folder name is the first URL segment:
 *
 *   monitorowanie/00-wprowadzenie.mdx      → /projekty/monitorowanie
 *   monitorowanie/01-szkielet-systemu.mdx  → /projekty/monitorowanie/01-szkielet-systemu
 *
 * The overview (`part: 0`) lives at the project URL, every other page at its
 * file name. External sites link these URLs, so don't rename published files.
 *
 * IMPORTANT: this module touches `node:fs` and must only be imported from
 * Server Components, `generateStaticParams`, or other build-time contexts.
 *
 * See PROJECT_BRIEF.md §4.5 for the data contract.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import {
  parseProjectPageFrontmatter,
  type ProjectPageFrontmatter,
} from "@/lib/frontmatter";

/** Absolute path to the projects root. */
const PROJECTS_ROOT = path.join(process.cwd(), "content", "projekty");

/** Project folder name: lowercase ASCII slug, e.g. `monitorowanie`. */
const PROJECT_FOLDER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Page file name: two-digit `order` prefix + ASCII slug, e.g. `01-szkielet-systemu.mdx`. */
const PAGE_FILE = /^(\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/;

/** A single project page, ready to be rendered. */
export interface ProjectPage {
  /** Project folder, e.g. "monitorowanie". First URL segment. */
  project: string;
  /** File slug without `.mdx`, e.g. "01-szkielet-systemu". */
  fileSlug: string;
  /** Catch-all route segments: [project] for the overview, [project, fileSlug] otherwise. */
  segments: string[];
  /** Stable URL: `/projekty/<project>` or `/projekty/<project>/<fileSlug>`. */
  href: string;
  /** Absolute filesystem path (build-time only). */
  filePath: string;
  /** Validated frontmatter. */
  frontmatter: ProjectPageFrontmatter;
  /** Raw MDX body (without frontmatter). Compile with `lib/mdx.ts`. */
  body: string;
}

/** A project with all its pages (drafts included), in `order`. */
export interface Project {
  /** Folder name, e.g. "monitorowanie". */
  slug: string;
  /** Short name from the overview's `projectTitle`, e.g. "Monitorowanie". */
  title: string;
  /** URL of the overview page. */
  href: string;
  pages: ProjectPage[];
}

let _cache: Project[] | null = null;
const SHOULD_CACHE_CONTENT = process.env.NODE_ENV !== "development";

function invalidPage(filePath: string, message: string): Error {
  return new Error(`Invalid project page at ${filePath}: ${message}`);
}

/** Fail the build when two pages of a project share a `part` or an `order`. */
function assertUnique(pages: ProjectPage[], field: "part" | "order") {
  const seen = new Map<number, string>();
  for (const page of pages) {
    const value = page.frontmatter[field];
    const other = seen.get(value);
    if (other) {
      throw invalidPage(page.filePath, `${field} ${value} is already used by ${other}`);
    }
    seen.set(value, page.filePath);
  }
}

function loadProject(slug: string): Project | undefined {
  const projectPath = path.join(PROJECTS_ROOT, slug);
  const pages: ProjectPage[] = [];

  for (const file of fs.readdirSync(projectPath)) {
    if (!file.endsWith(".mdx")) continue;
    const filePath = path.join(projectPath, file);
    const match = PAGE_FILE.exec(file);
    if (!match) {
      throw invalidPage(
        filePath,
        'file name must be a two-digit prefix and a lowercase ASCII slug, e.g. "01-szkielet-systemu.mdx"',
      );
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = parseProjectPageFrontmatter(data, filePath);
    if (frontmatter.project !== slug) {
      throw invalidPage(
        filePath,
        `project "${frontmatter.project}" does not match its folder "${slug}"`,
      );
    }
    if (frontmatter.order !== Number(match[1])) {
      throw invalidPage(
        filePath,
        `order ${frontmatter.order} does not match the file prefix "${match[1]}"`,
      );
    }

    const fileSlug = file.replace(/\.mdx$/, "");
    const isOverview = frontmatter.part === 0;
    pages.push({
      project: slug,
      fileSlug,
      segments: isOverview ? [slug] : [slug, fileSlug],
      href: isOverview ? `/projekty/${slug}` : `/projekty/${slug}/${fileSlug}`,
      filePath,
      frontmatter,
      body: content,
    });
  }

  if (pages.length === 0) return undefined;

  assertUnique(pages, "part");
  assertUnique(pages, "order");
  const overview = pages.find((page) => page.frontmatter.part === 0);
  if (!overview) {
    throw new Error(
      `Project "${slug}" has no overview page (part: 0) in ${projectPath}`,
    );
  }

  pages.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  return {
    slug,
    title: overview.frontmatter.projectTitle ?? slug,
    href: overview.href,
    pages,
  };
}

function loadProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_ROOT)) return [];

  const projects: Project[] = [];
  for (const entry of fs.readdirSync(PROJECTS_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!PROJECT_FOLDER.test(entry.name)) {
      throw new Error(
        `Invalid project folder "${entry.name}" in ${PROJECTS_ROOT}: use a lowercase ASCII slug`,
      );
    }
    const project = loadProject(entry.name);
    if (project) projects.push(project);
  }

  return projects.sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Every project with all its pages, drafts included — used for nav/sidebar. */
export function getAllProjects(): Project[] {
  if (SHOULD_CACHE_CONTENT && _cache) return _cache;
  const projects = loadProjects();
  if (SHOULD_CACHE_CONTENT) _cache = projects;
  return projects;
}

/** Published project pages, project by project, each in reading order. */
export function getAllProjectPages(): ProjectPage[] {
  return getAllProjects().flatMap((project) =>
    project.pages.filter((page) => page.frontmatter.publish),
  );
}

export function getProject(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

/** The published page at these route segments, if any. */
export function getProjectPageBySegments(
  segments: string[],
): ProjectPage | undefined {
  const key = segments.join("/");
  return getAllProjectPages().find((page) => page.segments.join("/") === key);
}

/** Sidebar / nav tree: Project → Page. */
export interface NavProject {
  title: string;
  href: string;
  pages: NavProjectPage[];
}

export interface NavProjectPage {
  title: string;
  href: string;
  /** 0 = overview. */
  part: number;
  publish: boolean;
}

export function buildProjectNav(): NavProject[] {
  return getAllProjects().map((project) => ({
    title: project.title,
    href: project.href,
    pages: project.pages.map((page) => ({
      title: page.frontmatter.title,
      href: page.href,
      part: page.frontmatter.part,
      publish: page.frontmatter.publish,
    })),
  }));
}
