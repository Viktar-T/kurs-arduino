/**
 * Shell — common chrome (sidebar + header + main) for lesson pages.
 * Stub — extend with shadcn `<Sheet>` for mobile, breadcrumbs, TOC, etc.
 */
import type { ReactNode } from "react";

import { Sidebar } from "@/components/nav/Sidebar";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-[16rem_1fr]">
      <aside className="md:sticky md:top-8 md:self-start">
        <Sidebar />
      </aside>
      <main className="prose dark:prose-invert max-w-none">{children}</main>
    </div>
  );
}
