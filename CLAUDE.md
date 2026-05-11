@AGENTS.md

# CLAUDE.md — kurs-arduino (Arduino Course Platform)

> **Read [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) first.** This file is a fast reference for Claude Code. The brief is the source of truth — if they conflict, the brief wins and this file is wrong.

---

## 1. What this project is

A statically generated e-learning platform (Next.js 16 App Router) that publishes the materials of the **80-hour Arduino course for 10 students of Technikum Technologii Cyfrowych w Szczecinie** (May–June 2026, 10 training days × 8 h, 5 weekends).

- Source structure of the curriculum: the three Forbot courses — *Kurs podstaw Arduino*, *Kurs Arduino poziom II*, *Kurs budowy robotów*.
- Primary navigation axis: **day** (`dzien-01`..`dzien-10`). The 13 contractual program blocks are kept as **metadata** on each lesson, never as folders.
- Working language of content and UI: **Polish**.
- Output: static export, deployable to Vercel / GitHub Pages / any static host.

The parent vault (`../`) is a Life-OS / Obsidian vault — see `../CLAUDE.md` for the wider project (admin, finance, comms, source materials). This sub-folder is **only the web platform**.

---

## 2. Tech stack (locked)

- Next.js **16.2.6** · React **19.2.4** · TypeScript 5 (strict) · Tailwind CSS **v4**
- App Router in **`app/`** at project root (NOT `src/app`)
- UI: `shadcn/ui` (Tailwind v4 compatible CLI) + `lucide-react`
- Content: MDX via `next-mdx-remote/rsc` + `gray-matter` (compiled from `content/lekcje/**/*.mdx`)
- Code highlighting: `shiki` via `rehype-pretty-code` with the `cpp` grammar
- Markdown: `remark-gfm`, `remark-math` + `rehype-katex`, `rehype-slug` + `rehype-autolink-headings`, Mermaid for flow diagrams
- Search: `Pagefind` (client-side, post-build)
- Frontmatter validation: `zod`
- Build target: `output: 'export'` (set in `next.config.ts` when ready)

> Per `AGENTS.md`: this is **Next.js 16** — don't assume training-data APIs. Check `node_modules/next/dist/docs/` before using features that may have changed.

---

## 3. Repository layout

```
kurs-arduino/
├── app/                   ← Next.js App Router pages
│   ├── layout.tsx         ← root layout (lang="pl", Polish metadata)
│   ├── page.tsx           ← course landing
│   ├── globals.css        ← Tailwind v4 entry
│   ├── lekcje/[...slug]/page.tsx   ← dynamic lesson route
│   ├── program/page.tsx   ← by-block view (client-contract)
│   └── harmonogram/page.tsx ← by-day view
├── components/
│   ├── ui/                ← shadcn/ui primitives (added via CLI)
│   ├── mdx/               ← Callout, Hardware, Task, MiniProject, Schematic, Code
│   ├── nav/               ← Sidebar, Breadcrumbs, TOC
│   └── layout/            ← Shell, Header, Footer
├── content/lekcje/dzien-NN/   ← one folder per training day (1..10)
├── lib/
│   ├── frontmatter.ts     ← Zod schema (single source of truth for lesson metadata)
│   ├── content.ts         ← getAllLessons, getLessonBySlug, buildNav
│   └── mdx.ts             ← MDX compile pipeline (remark/rehype)
├── types/lesson.ts        ← inferred from Zod
├── public/img/lekcje/…    ← schematics, photos, GIFs
├── mdx-components.tsx     ← Next.js MDX components map
├── PROJECT_BRIEF.md       ← source of truth for product decisions
├── CLAUDE.md              ← this file
├── AGENTS.md              ← Next.js-16-specific guardrails
└── next.config.ts
```

Path alias: `@/*` → `./*` (already configured in `tsconfig.json`).

---

## 4. Conventions

### Polish content

- All lesson text, callouts, headings and student-facing UI strings are in **Polish**.
- Internal identifiers (file slugs, component names, function names, frontmatter keys) stay **English / ASCII** to keep URLs and imports stable. Example: file `dzien-01/01-srodowisko-ide.mdx`, frontmatter `title: "Środowisko Arduino IDE i pierwszy szkic"`.
- Use ASCII-friendly slugs (no Polish diacritics): `srodowisko-ide`, not `środowisko-ide`.

### Frontmatter

Every lesson MUST satisfy the Zod schema in `lib/frontmatter.ts`. Build fails on any lesson with missing or invalid fields. When adding fields, update the schema first and the brief second.

The Life-OS fields (`type`, `namespace`, `status`, `sensitivity`) are kept for vault hygiene but ignored by the site.

### File ordering

- Day folder name: `dzien-NN` (zero-padded, 01..10).
- Lesson filename starts with a two-digit prefix matching `order` in frontmatter: `01-srodowisko-ide.mdx`. If you change `order`, rename the file.

### Code samples

- Arduino sketches in lessons use the `cpp` language tag (Shiki has no native `arduino` grammar — `cpp` is the correct alias).
- Comments inside code samples: **Polish** (consistent with the spoken language during training).
- Wrap longer sketches in `<Code lang="cpp" file="blink.ino">…</Code>` for the file-name header + copy button.

### Components

- Server Components by default. Use `"use client"` only where strictly needed (interactivity, hooks, browser APIs).
- Tailwind v4 is CSS-first — no `tailwind.config.ts`. Add new theme tokens in `app/globals.css` under `@theme inline`.
- For `shadcn/ui` components, prefer the official CLI (Tailwind v4 mode) over hand-writing.

---

## 5. Commands

```bash
npm install                                          # after pulling dependency changes
npm run dev                                          # localhost:3000
npm run build                                        # production build (and static export when output:'export')
npm run lint                                         # eslint
npx shadcn@latest add button card sheet sidebar      # add UI primitives
```

When static export is enabled, the build emits to `out/`. Pagefind runs against `out/` after `next build`.

---

## 6. How to add a new lesson (recipe)

1. Pick the day folder: `content/lekcje/dzien-NN/`. Create it if missing.
2. Copy a sibling lesson as a template, rename to `MM-slug.mdx` with a two-digit `order` prefix and an ASCII slug.
3. Fill the frontmatter — every field required by `lib/frontmatter.ts` must be present.
4. Write the body in Polish MDX. Use the components from `components/mdx/` for callouts, hardware lists, tasks, schematics.
5. Add images to `public/img/lekcje/dzien-NN/` and reference them via absolute paths.
6. Run `npm run dev` — the lesson appears under `/lekcje/dzien-NN/<slug>` and in the sidebar.
7. Run `npm run build` before committing to catch frontmatter validation errors.

A reference lesson lives at `content/lekcje/dzien-01/01-srodowisko-ide.mdx` — copy it.

---

## 7. How to add a new MDX component

1. Create `components/mdx/MyComponent.tsx`. Keep it a Server Component unless it needs interactivity.
2. Export it from `components/mdx/index.ts`.
3. Register it in `mdx-components.tsx` so it's available globally in MDX without explicit import.
4. Document its props at the top of the file (JSDoc) — content authors will use it.

---

## 8. Boundaries — don't do this

- **Don't add a backend** in v1. No Supabase, no auth, no API routes. Reserved for v2 (see brief §2).
- **Don't introduce `src/app`**. App Router lives at `app/` at the project root.
- **Don't add `tailwind.config.ts`**. This is Tailwind v4 — config is CSS-first.
- **Don't put the 13 blocks in folder structure**. Block is metadata on lessons; the only "by-block" UI is the read-only `/program` view.
- **Don't write Polish identifiers with diacritics**. UI strings yes, identifiers no.
- **Don't `npm install` new packages without updating the brief's Tech Stack section** if the addition is significant.

---

## 9. Where to look for the curriculum

- 13 program blocks (client contract): `../20_program/01_Program-kursu.md`
- 10-day timetable: `../20_program/02_Harmonogram-zjazdow.md`
- Forbot reference (chapters / examples): `../40_materialy/forbot.pl.md`
- Helion ebooks (Simon Monk B & C) and their mapping to the program: `../40_materialy/Ebooki Arduino - Helion/Analiza-ksiazek-i-mapa-do-kursu.md`
- Topics not covered by ebooks (need external sources): see `../CLAUDE.md` §6.

---

## 10. Subagents available

Project-scoped Claude Code subagent definitions ship in **`claude-agents/`**. To activate them, copy (or symlink) into `.claude/agents/`:

```bash
mkdir -p .claude/agents
cp claude-agents/*.md .claude/agents/
```

Provided agents:

- `lesson-author` — drafts a new Polish MDX lesson from a topic + day + source references, conformant to the Zod frontmatter schema.
- `mdx-component-author` — writes a new MDX component (Server Component, Tailwind v4, shadcn-compatible) and wires it into `mdx-components.tsx`.

Invoke them when the task matches their description.
