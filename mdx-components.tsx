/**
 * Required by Next.js when @next/mdx is installed.
 *
 * Even though lesson MDX is compiled at runtime via `next-mdx-remote/rsc`
 * (which uses its own `components` prop — see `lib/mdx.ts`), this file is
 * the conventional global registry. Keep both in sync via `components/mdx/index.ts`.
 */
import type { MDXComponents } from "mdx/types";

import { mdxComponents } from "@/components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
