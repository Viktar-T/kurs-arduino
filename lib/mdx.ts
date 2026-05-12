/**
 * MDX compilation pipeline.
 *
 * Compiles a lesson body (Polish MDX) to RSC-streamed React using
 * `next-mdx-remote/rsc`. Centralized so every lesson route uses the
 * same remark/rehype plugin stack.
 *
 * See PROJECT_BRIEF.md §2 for the plugin list.
 */
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";

import { mdxComponents } from "@/components/mdx";

const prettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
  defaultLang: {
    block: "cpp",
    inline: "cpp",
  },
};

/**
 * Compile an MDX string (lesson body) to a React node renderable from RSC.
 *
 * Usage in a Server Component:
 *
 *   const { content } = await renderLesson(lesson.body);
 *   return <article>{content}</article>;
 */
export async function renderLesson(source: string) {
  return compileMDX({
    source,
    options: {
      parseFrontmatter: false, // frontmatter is parsed separately in lib/content.ts
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypePrettyCode, prettyCodeOptions],
          rehypeKatex,
        ],
      },
    },
    components: mdxComponents,
  });
}
