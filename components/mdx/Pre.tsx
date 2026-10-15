/**
 * `<pre>` override for lesson MDX — registered as `pre` in
 * `components/mdx/index.ts`. Every fenced code block (also inside `<Code>`)
 * gets a "Kopiuj" button; authors don't need to do anything.
 *
 * Server Component; only the button is a Client Component.
 */
import type { ComponentPropsWithoutRef } from "react";

import { CopyButton } from "./CopyButton";

export function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return (
    <div className="code-block">
      <pre {...props} />
      <CopyButton />
    </div>
  );
}
