"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui";
import type { NavDay } from "@/lib/content";

interface DayAccordionProps {
  day: NavDay;
  defaultOpen?: boolean;
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function DayAccordion({ day, defaultOpen = true }: DayAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const pathname = safeDecode(usePathname());

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="day-accordion-trigger"
      >
        <span>Dzień {day.day}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="day-accordion-chevron"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        id={panelId}
        className="day-accordion-panel"
        data-open={open}
        inert={!open}
      >
        <div className="day-accordion-panel-inner">
          <ul className="space-y-1 border-l border-slate-200 pl-3 pt-1 pb-1">
            {day.lessons.map((l) => (
              <li key={l.href} className="flex items-baseline gap-2">
                {l.publish ? (
                  <>
                    <Badge variant="block">B{l.block}</Badge>
                    <Link
                      href={l.href}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className="hover:underline"
                    >
                      {l.title}
                    </Link>
                  </>
                ) : (
                  <span className="opacity-40 italic">w przygotowaniu</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}
