/**
 * /program — by-block view (client-contract mapping).
 *
 * Re-projects the lesson corpus by `frontmatter.block` so the 13-block
 * client contract is visible without making block a folder.
 */
import Link from "next/link";
import type { Metadata } from "next";

import { groupByBlock } from "@/lib/content";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "Program kursu — 13 bloków · Kurs Arduino",
  description:
    "Mapowanie 13 bloków programu kursu Arduino na lekcje (widok kontraktu z zamawiającym).",
};

export default function ProgramPage() {
  const blocks = groupByBlock();

  return (
    <Shell>
      <h1>Program kursu — 13 bloków</h1>
      <p className="opacity-80">
        Mapowanie lekcji na 13 bloków programu wymaganych przez zamawiającego
        (West Pomeranian / TTC Szczecin). Każda lekcja w widoku „dziennym”
        należy do jednego z tych bloków.
      </p>

      {blocks.length === 0 ? (
        <p className="opacity-60">
          Brak opublikowanych lekcji. Dodaj pliki MDX do{" "}
          <code>content/lekcje/dzien-NN/</code>.
        </p>
      ) : (
        <ol className="space-y-6 not-prose">
          {blocks.map((b) => (
            <li key={b.block}>
              <h2 className="text-lg font-semibold">
                <span className="mr-2 rounded bg-slate-100 px-2 py-0.5 font-mono text-sm dark:bg-slate-800">
                  B{b.block}
                </span>
                {b.blockTitle}
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
                {b.lessons.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:underline">
                      {l.frontmatter.title}
                    </Link>
                    <span className="ml-2 opacity-60">
                      (Dzień {l.frontmatter.day}, {l.frontmatter.duration} min)
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </Shell>
  );
}
