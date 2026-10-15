/**
 * Course chrome (sidebar + top bar) shared by every course page.
 *
 * Rendered once by `app/(kurs)/layout.tsx`, so the sidebar keeps its
 * collapsed state and scroll position while navigating between lessons.
 */
import type { ReactNode } from "react";

import { Sidebar } from "@/components/nav/Sidebar";
import { SidebarShell } from "@/components/layout/SidebarShell";

export function Shell({ children }: { children: ReactNode }) {
  return <SidebarShell sidebar={<Sidebar />}>{children}</SidebarShell>;
}
