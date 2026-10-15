/**
 * `<a>` override for lesson MDX — registered as `a` in `components/mdx/index.ts`,
 * so authors keep writing plain Markdown links:
 *
 *   [poprzednia lekcja](/lekcje/dzien-01/03-srodowisko-ide)
 *
 * Course routes (`/`, `/lekcje/…`, `/projekty/…`, `/narzedzia/…`, `/harmonogram`, `/program`)
 * render via `next/link` for client-side navigation; `/lekcje/…` hrefs are
 * rewritten to the lesson's current URL if the lesson was renamed or moved to
 * another day. External URLs, `/docs/…` files and `#anchors` stay plain `<a>`
 * elements. Server Component.
 */
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { resolveLessonHref } from "@/lib/content";

const COURSE_ROUTE =
  /^\/(?:$|[?#]|lekcje\/|projekty\/|narzedzia\/|harmonogram(?:$|[?#])|program(?:$|[?#]))/;

export function Anchor({ href, ...props }: ComponentPropsWithoutRef<"a">) {
  if (href && COURSE_ROUTE.test(href)) {
    return <Link href={resolveLessonHref(href)} {...props} />;
  }
  return <a href={href} {...props} />;
}
