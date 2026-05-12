/**
 * Jak używać w lekcji MDX:
 *
 *   <Objectives items={["Podłączyć diodę LED", "Wgrać program Blink"]} />
 *
 * Możesz też pominąć `items` i wpisać własną treść między tagami.
 */
import type { ReactNode } from "react";

interface ObjectivesProps {
  items?: string[];
  title?: string;
  children?: ReactNode;
}

export function Objectives({
  items,
  title = "Cele lekcji",
  children,
}: ObjectivesProps) {
  if ((!items || items.length === 0) && !children) return null;

  return (
    <section className="forbot-panel my-6 px-4 py-3">
      <p className="forbot-label mb-2 text-sm font-semibold uppercase">
        {title}
      </p>
      {items ? (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="text-sm">{children}</div>
      )}
    </section>
  );
}
