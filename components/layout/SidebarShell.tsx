"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface SidebarShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function SidebarShell({ sidebar, children }: SidebarShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="site-shell mx-auto grid w-full gap-8 px-6 py-8"
      style={{
        gridTemplateColumns: sidebarOpen ? "16rem 1fr" : "0px 1fr",
        transition: "grid-template-columns 0.3s ease",
      }}
    >
      <aside
        className="course-sidebar-wrapper"
        style={{
          overflow: "hidden",
          transition: "opacity 0.3s ease",
          opacity: sidebarOpen ? 1 : 0,
        }}
      >
        <div className="course-sidebar px-4 py-4 md:sticky md:top-8 md:self-start">
          {sidebar}
        </div>
      </aside>

      <main className="min-w-0" style={{ minWidth: 0 }}>
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label={sidebarOpen ? "Zwiń panel nawigacji" : "Rozwiń panel nawigacji"}
          className="sidebar-toggle-btn"
          title={sidebarOpen ? "Zwiń sidebar" : "Rozwiń sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{
              transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <polyline points="15 9 19 12 15 15" />
          </svg>
        </button>
        {children}
      </main>
    </div>
  );
}
