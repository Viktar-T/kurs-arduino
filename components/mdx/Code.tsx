/**
 * Jak używać w lekcji MDX:
 *
 *   <Code lang="cpp" file="blink.ino">
 *   ```cpp
 *   void setup() {
 *     pinMode(13, OUTPUT);
 *   }
 *   ```
 *   </Code>
 *
 * <Code lang="cpp" file="blink.ino">…</Code>
 *
 * Wraps a pre-highlighted code block (from rehype-pretty-code) with
 * a file-name header. The copy-to-clipboard button is a separate
 * client component if/when added — keep this Server-Component-only.
 */
import type { ReactNode } from "react";

interface CodeProps {
  lang?: string;
  file?: string;
  children: ReactNode;
}

export function Code({ lang, file, children }: CodeProps) {
  return (
    <div className="code-frame">
      {(file || lang) && (
        <div className="code-frame-header flex items-center justify-between px-3 py-1 text-xs font-mono">
          <span className="opacity-80">{file ?? ""}</span>
          {lang && <span className="opacity-60">{lang}</span>}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}
