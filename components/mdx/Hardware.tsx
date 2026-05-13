/**
 * Jak używać w lekcji MDX:
 *
 *   <Hardware
 *     items={[{ name: "Arduino UNO R3", qty: 1 }, { name: "Dioda LED", qty: 1 }]}
 *   />
 *
 * <Hardware items={[{ name, qty, optional?, note? }]} />
 *
 * Renders the bench-required components list. Server Component.
 * Mirrors the shape of `HardwareItem` in `lib/frontmatter.ts`.
 */
import type { HardwareItem } from "@/types/lesson";

interface HardwareProps {
  items: HardwareItem[];
  title?: string;
}

export function Hardware({ items, title = "Potrzebny sprzęt" }: HardwareProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className="forbot-hardware border-l-4 px-4 py-3">
      <h3 className="forbot-label mb-2 text-sm font-semibold uppercase">
        {title}
      </h3>
      <ul className="space-y-1 text-sm">
        {items.map((it, idx) => (
          <li key={`${it.name}-${idx}`} className="flex gap-2">
            <span className="font-mono opacity-70">×{it.qty}</span>
            <span>
              {it.name}
              {it.optional && (
                <span className="ml-2 text-xs opacity-60">(opcjonalnie)</span>
              )}
              {it.note && (
                <span className="ml-2 text-xs opacity-70">— {it.note}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
