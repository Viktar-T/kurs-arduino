/**
 * Layout for all course pages (lessons, /harmonogram, /program).
 *
 * The route group `(kurs)` does not change URLs; it only lets these pages
 * share one persistent Shell instead of re-mounting it on every navigation.
 */
import type { ReactNode } from "react";

import { Shell } from "@/components/layout/Shell";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
