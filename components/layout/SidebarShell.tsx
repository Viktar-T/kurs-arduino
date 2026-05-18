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
      className="site-shell"
      style={{
        display: "grid",
        gridTemplateColumns: sidebarOpen ? "16rem 1fr" : "0px 1fr",
        transition: "grid-template-columns 0.3s ease",
        height: "100dvh",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <aside
        style={{
          overflowX: "hidden",
          overflowY: sidebarOpen ? "auto" : "hidden",
          opacity: sidebarOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
          height: "100%",
          scrollbarGutter: "stable",
        }}
      >
        <div className="course-sidebar mx-3 my-4 px-4 py-4">
          {sidebar}
        </div>
      </aside>

      <main
        style={{
          overflowY: "auto",
          height: "100%",
          minWidth: 0,
          scrollbarGutter: "stable",
        }}
      >
        <div className="px-6 py-8">
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
        </div>
      </main>
    </div>
  );
}
