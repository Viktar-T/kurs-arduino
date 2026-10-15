/**
 * Zod schemas for MDX frontmatter — single source of truth.
 *
 * - `LessonFrontmatter`: every MDX file in `content/lekcje/**`.
 * - `ProjectPageFrontmatter`: every MDX file in `content/projekty/<project>/`.
 *
 * Build (`npm run build`) fails fast on any invalid or incomplete file.
 *
 * See PROJECT_BRIEF.md §4.1 and §4.5 for the documented schemas and rationale.
 */
import { z } from "zod";

/** Forbot source courses — see brief §1. */
export const ForbotCourse = z.union([
  z.literal(1), // Kurs podstaw Arduino
  z.literal(2), // Kurs Arduino, poziom II
  z.literal(3), // Kurs budowy robotów
]);

export const HardwareItem = z.object({
  name: z.string().min(1),
  qty: z.number().int().positive().default(1),
  optional: z.boolean().optional(),
  note: z.string().optional(),
});

/** Lowercase ASCII, hyphen-separated — safe as a URL segment. */
const Slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "slug must be lowercase ASCII, hyphen-separated, no Polish diacritics",
  });

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "updated must be ISO date YYYY-MM-DD",
});

/**
 * Life-OS / Obsidian vault metadata. Kept for vault hygiene only —
 * the site does NOT read these. Validated loosely.
 */
const VaultMeta = z
  .object({
    type: z.string().optional(),
    namespace: z.string().optional(),
    status: z.string().optional(),
    sensitivity: z.string().optional(),
  })
  .passthrough();

/**
 * Site-driving fields. ALL fields below are required unless marked optional.
 */
export const LessonFrontmatter = VaultMeta.extend({
  // Identity
  title: z.string().min(1),
  slug: Slug,
  summary: z.string().min(1),

  // Primary axis: training day (1..10)
  day: z.number().int().min(1).max(10),
  weekend: z.number().int().min(1).max(5),
  order: z.number().int().min(1),
  duration: z.number().int().positive(), // minutes

  // Client-contract mapping (metadata, not folder structure)
  block: z.number().int().min(1).max(13),
  blockTitle: z.string().min(1),

  // Source mapping
  forbotCourse: ForbotCourse,
  forbotChapter: z.number().int().min(1),

  // Pedagogy
  objectives: z.array(z.string().min(1)).min(1),
  prerequisites: z.array(z.string()).default([]),
  hardware: z.array(HardwareItem).default([]),

  // Discovery / citations
  tags: z.array(z.string()).default([]),
  sources: z.array(z.string()).default([]),

  // Presentation / publishing
  cover: z.string().optional(),
  publish: z.boolean().default(true),
  updated: IsoDate,
});

/**
 * A page of a project — a self-contained series that sits outside the
 * 10-day timetable (e.g. "Monitorowanie"). Deliberately NOT a lesson: no
 * day/weekend/block/Forbot mapping. Part 0 is the project overview,
 * parts 1..N follow it. Cross-file rules (folder name, unique parts,
 * file prefix = `order`) are checked by `lib/projects.ts`.
 */
export const ProjectPageFrontmatter = VaultMeta.extend({
  // Identity
  title: z.string().min(1),
  slug: Slug,
  summary: z.string().min(1),

  // Position in the project
  project: Slug, // = folder name in content/projekty/
  projectTitle: z.string().min(1).optional(), // short name for navigation; required on part 0
  part: z.number().int().min(0), // 0 = overview, 1..N = parts
  order: z.number().int().min(0), // position in the project = two-digit file prefix
  duration: z.number().int().positive().optional(), // minutes

  // Pedagogy
  objectives: z.array(z.string().min(1)).min(1),
  prerequisites: z.array(z.string()).default([]), // lesson hrefs (/lekcje/…) and project page hrefs (/projekty/…)
  hardware: z.array(HardwareItem).default([]),

  // Discovery / citations
  tags: z.array(z.string()).default([]),
  sources: z.array(z.string()).default([]),

  // Publishing
  publish: z.boolean().default(true),
  updated: IsoDate,
}).superRefine((fm, ctx) => {
  if (fm.part === 0 && !fm.projectTitle) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["projectTitle"],
      message: "projectTitle is required on the project overview (part: 0)",
    });
  }
});

export type LessonFrontmatter = z.infer<typeof LessonFrontmatter>;
export type ProjectPageFrontmatter = z.infer<typeof ProjectPageFrontmatter>;
export type HardwareItem = z.infer<typeof HardwareItem>;

/**
 * Parse raw frontmatter (already extracted by gray-matter) with `schema` and
 * either return the typed object or throw a descriptive error including the
 * source path.
 */
function parseFrontmatter<Schema extends z.ZodTypeAny>(
  schema: Schema,
  kind: string,
  raw: unknown,
  sourcePath: string,
): z.infer<Schema> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid ${kind} frontmatter at ${sourcePath}:\n${issues}`);
  }
  return result.data;
}

export function parseLessonFrontmatter(
  raw: unknown,
  sourcePath: string,
): LessonFrontmatter {
  return parseFrontmatter(LessonFrontmatter, "lesson", raw, sourcePath);
}

export function parseProjectPageFrontmatter(
  raw: unknown,
  sourcePath: string,
): ProjectPageFrontmatter {
  return parseFrontmatter(
    ProjectPageFrontmatter,
    "project page",
    raw,
    sourcePath,
  );
}
