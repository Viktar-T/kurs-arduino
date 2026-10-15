/**
 * Content loader — reads every `content/lekcje/**\/*.mdx` file at build time,
 * validates frontmatter via Zod, and exposes typed lookups + a navigation tree.
 *
 * IMPORTANT: this module touches `node:fs` and must only be imported from
 * Server Components, `generateStaticParams`, or other build-time contexts.
 *
 * See PROJECT_BRIEF.md §4 for the data contract.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import {
  LessonFrontmatter,
  parseLessonFrontmatter,
} from "@/lib/frontmatter";

/** Absolute path to the content root. */
const CONTENT_ROOT = path.join(process.cwd(), "content", "lekcje");

/** A single lesson, ready to be rendered. */
export interface Lesson {
  /** Day folder, e.g. "dzien-01". Used as URL segment. */
  dayFolder: string;
  /** File slug without `.mdx`, e.g. "01-srodowisko-ide". Used as URL segment. */
  fileSlug: string;
  /** Catch-all route segments: [dayFolder, fileSlug]. */
  segments: [string, string];
  /** Stable URL: `/lekcje/<dayFolder>/<fileSlug>`. */
  href: string;
  /** Absolute filesystem path (build-time only). */
  filePath: string;
  /** Validated frontmatter. */
  frontmatter: LessonFrontmatter;
  /** Raw MDX body (without frontmatter). Compile with `lib/mdx.ts`. */
  body: string;
}

/**
 * Walk `content/lekcje/**\/*.mdx` recursively. Cached for the duration of a build.
 */
let _cache: Lesson[] | null = null;
let _cacheAll: Lesson[] | null = null;
const SHOULD_CACHE_CONTENT = process.env.NODE_ENV !== "development";

function loadLessons(publishedOnly: boolean): Lesson[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];

  const lessons: Lesson[] = [];
  for (const dayFolder of fs.readdirSync(CONTENT_ROOT)) {
    const dayPath = path.join(CONTENT_ROOT, dayFolder);
    if (!fs.statSync(dayPath).isDirectory()) continue;
    if (!/^dzien-\d{2}$/.test(dayFolder)) continue;

    for (const file of fs.readdirSync(dayPath)) {
      if (!file.endsWith(".mdx")) continue;
      const filePath = path.join(dayPath, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const frontmatter = parseLessonFrontmatter(data, filePath);
      if (publishedOnly && !frontmatter.publish) continue;

      const fileSlug = file.replace(/\.mdx$/, "");
      lessons.push({
        dayFolder,
        fileSlug,
        segments: [dayFolder, fileSlug],
        href: `/lekcje/${dayFolder}/${fileSlug}`,
        filePath,
        frontmatter,
        body: content,
      });
    }
  }

  lessons.sort((a, b) => {
    const fa = a.frontmatter;
    const fb = b.frontmatter;
    return (
      fa.weekend - fb.weekend ||
      fa.day - fb.day ||
      a.fileSlug.localeCompare(b.fileSlug)
    );
  });

  return lessons;
}

export function getAllLessons(): Lesson[] {
  if (SHOULD_CACHE_CONTENT && _cache) return _cache;
  const lessons = loadLessons(true);
  if (SHOULD_CACHE_CONTENT) _cache = lessons;
  return lessons;
}

/** Includes unpublished (draft) lessons — used for nav/sidebar only. */
export function getAllLessonsIncludingDrafts(): Lesson[] {
  if (SHOULD_CACHE_CONTENT && _cacheAll) return _cacheAll;
  const lessons = loadLessons(false);
  if (SHOULD_CACHE_CONTENT) _cacheAll = lessons;
  return lessons;
}

export function getLessonBySegments(segments: string[]): Lesson | undefined {
  if (segments.length !== 2) return undefined;
  const [dayFolder, fileSlug] = segments;
  return getAllLessons().find(
    (l) => l.dayFolder === dayFolder && l.fileSlug === fileSlug,
  );
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Strip a leading lesson-number prefix such as `01-` or `06.01-`. */
function stripOrderPrefix(name: string): string {
  return name.replace(/^\d+(?:\.\d+)*-/, "");
}

const warned = new Set<string>();
function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[content] ${message}`);
}

/**
 * Resolve a lesson reference (frontmatter `prerequisites` entry or link) to a
 * published lesson.
 *
 * Accepts `dzien-NN/<file-slug>`, `dzien-NN/<frontmatter-slug>` and the full
 * `/lekcje/dzien-NN/<file-slug>` href. Lessons get renamed and moved between
 * days, so when the exact path does not exist, the last segment is matched
 * case-insensitively (with or without its numeric file prefix) against every
 * lesson, preferring one in the referenced day folder.
 */
export function resolveLessonRef(ref: string): Lesson | undefined {
  const normalized = safeDecode(ref)
    .trim()
    .replace(/^\/?(?:lekcje\/)?/, "")
    .replace(/\/+$/, "");
  const parts = normalized.split("/");
  if (parts.length > 2) return undefined;
  const [dayFolder, name] = parts.length === 2 ? parts : [undefined, parts[0]];
  if (!name) return undefined;

  const lessons = getAllLessons();
  const exact = lessons.find(
    (l) =>
      l.dayFolder === dayFolder &&
      (l.fileSlug === name || l.frontmatter.slug === name),
  );
  if (exact) return exact;

  const wanted = new Set([
    name.toLowerCase(),
    stripOrderPrefix(name).toLowerCase(),
  ]);
  const candidates = lessons.filter((l) =>
    [l.fileSlug, stripOrderPrefix(l.fileSlug), l.frontmatter.slug].some((key) =>
      wanted.has(key.toLowerCase()),
    ),
  );
  const match =
    candidates.find((l) => l.dayFolder === dayFolder) ?? candidates[0];
  if (match) {
    warnOnce(`Lesson reference "${ref}" is stale; resolved to ${match.href}`);
  } else {
    warnOnce(`Lesson reference "${ref}" does not match any published lesson`);
  }
  return match;
}

/**
 * Rewrite an internal `/lekcje/...` href to the lesson's current URL, keeping
 * any `#hash` / `?query`. Other hrefs are returned unchanged.
 */
export function resolveLessonHref(href: string): string {
  if (!href.startsWith("/lekcje/")) return href;
  const suffixStart = href.search(/[?#]/);
  const path = suffixStart === -1 ? href : href.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? "" : href.slice(suffixStart);
  const lesson = resolveLessonRef(path);
  return lesson ? lesson.href + suffix : href;
}

/** Sidebar / nav tree: Weekend → Day → Lesson. */
export interface NavWeekend {
  weekend: number;
  days: NavDay[];
}

export interface NavDay {
  day: number;
  lessons: NavLesson[];
}

export interface NavLesson {
  title: string;
  href: string;
  block: number;
  duration: number;
  publish: boolean;
}

export function buildNav(): NavWeekend[] {
  const lessons = getAllLessonsIncludingDrafts();
  const byWeekend = new Map<number, Map<number, NavLesson[]>>();

  for (const l of lessons) {
    const { weekend, day, title, block, duration } = l.frontmatter;
    if (!byWeekend.has(weekend)) byWeekend.set(weekend, new Map());
    const days = byWeekend.get(weekend)!;
    if (!days.has(day)) days.set(day, []);
    const { publish } = l.frontmatter;
    days.get(day)!.push({ title, href: l.href, block, duration, publish });
  }

  return Array.from(byWeekend.entries())
    .sort(([a], [b]) => a - b)
    .map(([weekend, days]) => ({
      weekend,
      days: Array.from(days.entries())
        .sort(([a], [b]) => a - b)
        .map(([day, lessons]) => ({ day, lessons })),
    }));
}

/** Re-projection for the /program (by-block) view. */
export function groupByBlock(): Array<{
  block: number;
  blockTitle: string;
  lessons: Lesson[];
}> {
  const byBlock = new Map<
    number,
    { block: number; blockTitle: string; lessons: Lesson[] }
  >();
  for (const l of getAllLessons()) {
    const { block, blockTitle } = l.frontmatter;
    if (!byBlock.has(block)) {
      byBlock.set(block, { block, blockTitle, lessons: [] });
    }
    byBlock.get(block)!.lessons.push(l);
  }
  return Array.from(byBlock.values()).sort((a, b) => a.block - b.block);
}
