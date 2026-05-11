/**
 * MDX component registry — single source of truth for what's available
 * inside lesson MDX. Wired into Next.js via `mdx-components.tsx`.
 */
import type { MDXComponents } from "mdx/types";

import { Callout } from "./Callout";
import { Hardware } from "./Hardware";
import { Task } from "./Task";
import { MiniProject } from "./MiniProject";
import { Schematic } from "./Schematic";
import { Code } from "./Code";

export { Callout, Hardware, Task, MiniProject, Schematic, Code };

/**
 * Components available inside MDX without an explicit import.
 * Add new shared components here when registering them globally.
 */
export const mdxComponents: MDXComponents = {
  Callout,
  Hardware,
  Task,
  MiniProject,
  Schematic,
  Code,
};
