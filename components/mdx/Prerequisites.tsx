/**
 * Jak używać w lekcji MDX:
 *
 *   <Prerequisites items={["Znajomość Arduino IDE", { label: "Lekcja Blink", href: "/lekcje/dzien-01/01-srodowisko-ide" }]} />
 *
 * Możesz też pominąć `items` i wpisać własną treść między tagami.
 */
import Link from "next/link";
import type { ReactNode } from "react";

export interface PrerequisiteItem {
  label: string;
  href?: string;
}

interface PrerequisitesProps {
  items?: Array<string | PrerequisiteItem>;
  title?: string;
  children?: ReactNode;
}

export function Prerequisites({
  items,
  title = "Wymagania wstępne",
  children,
}: PrerequisitesProps) {
  if ((!items || items.length === 0) && !children) return null;

  return (
    <section className="forbot-prerequisites my-5 rounded-md border border-[var(--forbot-line)] bg-white px-4 py-3">
      <p className="forbot-label mb-2 text-sm font-semibold uppercase">
        {title}
      </p>
      {items ? (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {items.map((item, index) => {
            const normalized =
              typeof item === "string" ? { label: item } : item;
            return (
              <li key={`${normalized.label}-${index}`}>
                {normalized.href ? (
                  <Link href={normalized.href}>{normalized.label}</Link>
                ) : (
                  normalized.label
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-sm">{children}</div>
      )}
    </section>
  );
}
