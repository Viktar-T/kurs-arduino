/**
 * Public type surface for lesson data. Re-exports from the Zod schema
 * so that consumers can import a single, stable type without pulling Zod.
 */
export type {
  LessonFrontmatter,
  HardwareItem,
} from "@/lib/frontmatter";

export type {
  Lesson,
  NavWeekend,
  NavDay,
  NavLesson,
} from "@/lib/content";
