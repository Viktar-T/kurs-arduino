/**
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
  if (items.length === 0) return null;
  return (
    <section className="my-6 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-80">
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
