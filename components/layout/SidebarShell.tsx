"use client";

/**
 * Client part of the course chrome.
 *
 * - Desktop (≥ 64rem): the sidebar is a sticky grid column that scrolls
 *   independently of the page and can be collapsed.
 * - Mobile (< 64rem): the sidebar is an off-canvas drawer, closed by default,
 *   opened from the sticky top bar.
 *
 * The page itself scrolls the window, so browser scroll restoration,
 * `#hash` links and Next.js scroll-to-top on navigation work natively.
 * A hidden sidebar is `visibility: hidden`, so its links leave the tab order.
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface SidebarShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

const SIDEBAR_ID = "course-sidebar";

export function SidebarShell({ sidebar, children }: SidebarShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Close the mobile drawer after navigation (state adjusted during render
  // instead of in an effect — see react.dev "You Might Not Need an Effect").
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  // Keep the current lesson visible inside the sidebar's own scroll area.
  useEffect(() => {
    const aside = asideRef.current;
    const active = aside?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!aside || !active) return;
    const asideRect = aside.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    if (activeRect.top < asideRect.top || activeRect.bottom > asideRect.bottom) {
      aside.scrollTop += activeRect.top - asideRect.top - asideRect.height / 3;
    }
  }, [pathname]);

  return (
    <div
      className="course-shell site-shell"
      data-collapsed={collapsed}
      data-drawer-open={drawerOpen}
    >
      <aside id={SIDEBAR_ID} ref={asideRef} className="course-shell-sidebar">
        <div className="course-sidebar mx-3 my-4 px-4 py-4">{sidebar}</div>
      </aside>

      <div
        className="course-shell-backdrop"
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />

      <div className="course-shell-main">
        <header className="course-topbar">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-controls={SIDEBAR_ID}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Rozwiń panel nawigacji" : "Zwiń panel nawigacji"}
            title={collapsed ? "Rozwiń panel nawigacji" : "Zwiń panel nawigacji"}
            className="sidebar-toggle-btn course-toggle-desktop"
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
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <polyline points="15 9 19 12 15 15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-controls={SIDEBAR_ID}
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? "Zamknij spis treści" : "Otwórz spis treści"}
            className="sidebar-toggle-btn course-toggle-mobile"
          >
            {drawerOpen ? (
              <X aria-hidden className="h-4 w-4" />
            ) : (
              <Menu aria-hidden className="h-4 w-4" />
            )}
          </button>

          <Link href="/" className="course-topbar-title">
            Kurs Arduino
          </Link>
          <nav aria-label="Widoki kursu" className="course-topbar-nav">
            <Link href="/harmonogram">Harmonogram</Link>
            <Link href="/program">Program</Link>
          </nav>
        </header>

        <main className="course-shell-content">{children}</main>
      </div>
    </div>
  );
}
