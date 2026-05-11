/**
 * Zod schema for lesson frontmatter — single source of truth.
 *
 * Every MDX file in `content/lekcje/**` must satisfy this schema.
 * Build (`npm run build`) fails fast on any invalid or incomplete lesson.
 *
 * See PROJECT_BRIEF.md §4.1 for the documented schema and rationale.
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
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "slug must be lowercase ASCII, hyphen-separated, no Polish diacritics",
    }),
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
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "updated must be ISO date YYYY-MM-DD",
  }),
});

export type LessonFrontmatter = z.infer<typeof LessonFrontmatter>;
export type HardwareItem = z.infer<typeof HardwareItem>;

/**
 * Parse raw frontmatter (already extracted by gray-matter) and either
 * return the typed object or throw a descriptive error including the
 * source path.
 */
export function parseLessonFrontmatter(
  raw: unknown,
  sourcePath: string,
): LessonFrontmatter {
  const result = LessonFrontmatter.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid lesson frontmatter at ${sourcePath}:\n${issues}`,
    );
  }
  return result.data;
}
