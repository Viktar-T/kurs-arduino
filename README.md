# kurs-arduino

Statyczna platforma e-learningowa dla kursu **„Podstawy programowania i budowy robotów z Arduino”** prowadzonego w Technikum Technologii Cyfrowych im. Jacka Karpińskiego w Szczecinie (10 dni szkoleniowych × 8 h = 80 h, maj–czerwiec 2026).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS v4 · `next-mdx-remote/rsc` · `zod` · `shiki` · `Pagefind`.

## Start

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build i export statyczny

```bash
npm run build                  # produkcyjny build
# (po ustawieniu output:'export' w next.config.ts)
npm run search:index           # indeks wyszukiwania Pagefind w out/
```

## Dokumentacja projektu

- [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) — źródło prawdy dla decyzji produktowych.
- [`CLAUDE.md`](./CLAUDE.md) — instrukcje dla asystenta Claude Code (konwencje, recepty, granice).
- [`AGENTS.md`](./AGENTS.md) — ostrzeżenia dot. Next.js 16.
- [`claude-agents/`](./claude-agents/) — definicje subagentów Claude Code (lesson-author, mdx-component-author).

## Struktura

Krótko: `app/` (routing), `components/` (UI + MDX + nav + layout), `content/lekcje/dzien-NN/` (lekcje), `lib/` (schema + content loader + MDX pipeline), `public/img/lekcje/` (schematy/zdjęcia). Pełna mapa w `CLAUDE.md` §3.

## Dodanie nowej lekcji

Zobacz `CLAUDE.md` §6 albo wywołaj subagenta `lesson-author`.
