"use client";

/**
 * Sidebar list of course tools (e.g. Rejestrator CSV). Client Component only
 * to mark the current page with `aria-current`, like the lesson links.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface ToolLink {
  title: string;
  href: string;
}

export function ToolLinks({ tools }: { tools: ToolLink[] }) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1 pl-1">
      {tools.map((tool) => (
        <li key={tool.href}>
          <Link
            href={tool.href}
            aria-current={pathname === tool.href ? "page" : undefined}
            className="hover:underline"
          >
            {tool.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
