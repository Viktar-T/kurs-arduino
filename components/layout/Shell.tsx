import type { ReactNode } from "react";

import { Sidebar } from "@/components/nav/Sidebar";
import { SidebarShell } from "@/components/layout/SidebarShell";
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
    <SidebarShell sidebar={<Sidebar />}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      {progress && <Progress {...progress} />}
      {children}
    </SidebarShell>
  );
}
