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
import { Objectives } from "./Objectives";
import { Prerequisites } from "./Prerequisites";
import { Pinout } from "./Pinout";
import { ExpectedOutput } from "./ExpectedOutput";
import { Troubleshooting, Issue } from "./Troubleshooting";
import { Photo } from "./Photo";
import { Expandable } from "./Expandable";

export {
  Callout,
  Hardware,
  Task,
  MiniProject,
  Schematic,
  Code,
  Objectives,
  Prerequisites,
  Pinout,
  ExpectedOutput,
  Troubleshooting,
  Issue,
  Photo,
  Expandable,
};

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
  Objectives,
  Prerequisites,
  Pinout,
  ExpectedOutput,
  Troubleshooting,
  Issue,
  Photo,
  Expandable,
};
