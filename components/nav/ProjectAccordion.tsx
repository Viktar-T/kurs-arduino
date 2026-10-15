"use client";

/**
 * Sidebar entry for one project (e.g. "Monitorowanie"): a collapsible list
 * of its pages in reading order — the overview first, then the parts. Same
 * look and behaviour as `DayAccordion`; unpublished pages show as
 * "w przygotowaniu", like unpublished lessons.
 */
import { useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavProject } from "@/lib/projects";

interface ProjectAccordionProps {
  project: NavProject;
  defaultOpen?: boolean;
}

export function ProjectAccordion({
  project,
  defaultOpen = true,
}: ProjectAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const pathname = usePathname();

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="day-accordion-trigger"
      >
        <span>{project.title}</span>
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
            {project.pages.map((page) => {
              const label = page.part === 0 ? "Wprowadzenie" : page.title;
              return (
                <li key={page.href}>
                  {page.publish ? (
                    <Link
                      href={page.href}
                      aria-current={pathname === page.href ? "page" : undefined}
                      className="hover:underline"
                    >
                      {label}
                    </Link>
                  ) : (
                    <span className="opacity-40 italic">
                      {page.part === 0 ? "Wprowadzenie" : `Część ${page.part}`}{" "}
                      — w przygotowaniu
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}
