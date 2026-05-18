"use client";

import { useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui";
import type { NavDay } from "@/lib/content";

interface DayAccordionProps {
  day: NavDay;
  defaultOpen?: boolean;
}

export function DayAccordion({ day, defaultOpen = true }: DayAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
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
        className="day-accordion-panel"
        style={{ maxHeight: open ? "9999px" : "0px" }}
      >
        <ul className="space-y-1 border-l border-slate-200 pl-3 pt-1 pb-1">
          {day.lessons.map((l) => (
            <li key={l.href} className="flex items-baseline gap-2">
              <Badge variant="block">B{l.block}</Badge>
              <Link href={l.href} className="hover:underline">
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
