import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface PaginationLink {
  title: string;
  href: string;
}

export interface PaginationLabels {
  /** `aria-label` of the whole navigation. */
  nav: string;
  previous: string;
  next: string;
}

const LESSON_LABELS: PaginationLabels = {
  nav: "Nawigacja między lekcjami",
  previous: "Poprzednia lekcja",
  next: "Następna lekcja",
};

interface PaginationProps {
  previous?: PaginationLink;
  next?: PaginationLink;
  /** Captions above the link titles; lesson wording by default. */
  labels?: PaginationLabels;
}

export function Pagination({
  previous,
  next,
  labels = LESSON_LABELS,
}: PaginationProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={labels.nav}
      className="not-prose mt-10 grid gap-3 border-t border-[var(--forbot-line)] pt-5 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={previous.href}
          className="forbot-page-link group flex items-center gap-3 rounded-md border border-[var(--forbot-line)] p-3 text-sm transition-colors hover:border-[var(--forbot-green)]"
        >
          <ArrowLeft aria-hidden className="h-4 w-4 shrink-0" />
          <span>
            <span className="block text-xs opacity-60">{labels.previous}</span>
            <span className="font-semibold">{previous.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link
          href={next.href}
          className="forbot-page-link group flex items-center justify-end gap-3 rounded-md border border-[var(--forbot-line)] p-3 text-right text-sm transition-colors hover:border-[var(--forbot-green)]"
        >
          <span>
            <span className="block text-xs opacity-60">{labels.next}</span>
            <span className="font-semibold">{next.title}</span>
          </span>
          <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
        </Link>
      )}
    </nav>
  );
}
