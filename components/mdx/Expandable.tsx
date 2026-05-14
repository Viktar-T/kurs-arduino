/**
 * Jak używać w lekcji MDX:
 *
 *   <Expandable title="Podpowiedź">
 *   Sprawdź, czy dioda LED jest wpięta dobrą stroną.
 *   </Expandable>
 *
 *   <Expandable title="Większy nagłówek" heading="####" defaultOpen>
 *   Ta sekcja jest domyślnie rozwinięta.
 *   </Expandable>
 *
 * Możesz użyć `heading="#|##|###|####` do zmiany rozmiaru tytułu.
 * Możesz użyć `defaultOpen`, jeśli sekcja ma być domyślnie rozwinięta.
 */
import type { ReactNode } from "react";

type ExpandableHeading = "#" | "##" | "###" | "####";

interface ExpandableProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  heading?: ExpandableHeading;
}

const HEADING_CLASS_NAME: Record<ExpandableHeading, string> = {
  "#": "text-3xl",
  "##": "text-2xl",
  "###": "text-xl",
  "####": "text-lg",
};

export function Expandable({
  title,
  children,
  defaultOpen = false,
  heading = "####",
}: ExpandableProps) {
  return (
    <details
      open={defaultOpen}
      className="my-5 rounded-md border border-[var(--forbot-line)] bg-white px-4 py-3"
    >
      <summary
        className={`cursor-pointer select-none font-semibold ${HEADING_CLASS_NAME[heading]}`}
      >
        {title}
      </summary>
      <div className="mt-3 text-sm leading-6">{children}</div>
    </details>
  );
}
