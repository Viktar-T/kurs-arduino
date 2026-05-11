import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Treat .mdx files as pages too (we still keep lesson MDX outside `app/`,
  // but this lets us colocate one-off static MDX pages if needed).
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  // Flip to "export" when ready to ship a fully static build.
  // output: "export",

  // For static export with subpath hosting (e.g. GitHub Pages), set:
  // basePath: "/kurs-arduino",
  // images: { unoptimized: true },

  images: {
    // remoteHosting placeholder — extend when adding external assets.
  },
};

const withMDX = createMDX({
  // Plugins for any `.mdx` files placed inside `app/`.
  // Lesson MDX from `content/lekcje/**` is compiled via `lib/mdx.ts` instead.
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
