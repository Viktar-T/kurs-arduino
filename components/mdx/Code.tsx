/**
 * <Code lang="cpp" file="blink.ino">…</Code>
 *
 * Wraps a pre-highlighted code block (from rehype-pretty-code) with
 * a file-name header. The copy-to-clipboard button is a separate
 * client component if/when added — keep this Server-Component-only.
 *
 * Usage in MDX:
 *
 *   <Code lang="cpp" file="blink.ino">
 *   ```cpp
 *   void setup() { … }
 *   ```
 *   </Code>
 */
import type { ReactNode } from "react";

interface CodeProps {
  lang?: string;
  file?: string;
  children: ReactNode;
}

export function Code({ lang, file, children }: CodeProps) {
  return (
    <div className="my-4 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
      {(file || lang) && (
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-1 text-xs font-mono dark:border-slate-700 dark:bg-slate-800">
          <span className="opacity-80">{file ?? ""}</span>
          {lang && <span className="opacity-60">{lang}</span>}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}
