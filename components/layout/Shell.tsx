import type { ReactNode } from "react";

import { Sidebar } from "@/components/nav/Sidebar";
import {
  Breadcrumb,
  Progress,
  type BreadcrumbItem,
} from "@/components/ui";

interface ShellProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  progress?: {
    current: number;
    total: number;
    title?: string;
  };
}

export function Shell({ children, breadcrumbs, progress }: ShellProps) {
  return (
    <div className="site-shell mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-[16rem_1fr]">
      <aside className="course-sidebar px-4 py-4 md:sticky md:top-8 md:self-start">
        <Sidebar />
      </aside>
      <main className="article-content max-w-none">
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        {progress && <Progress {...progress} />}
        {children}
      </main>
    </div>
  );
}
