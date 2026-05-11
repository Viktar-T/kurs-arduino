# PROJECT_BRIEF: Arduino Course Platform

## 1. Project Goal

We are building a **statically generated e-learning platform** that publishes the materials of the course [[../20_program/01_Program-kursu|01_Program-kursu]] — *Podstawy programowania i budowy robotów z Arduino* — for **10 students of Technikum Technologii Cyfrowych w Szczecinie** (80h, 5 weekends, May–June 2026).

The platform must:

- Render lesson content authored as **Markdown / MDX** files (with YAML frontmatter) into clean, mobile-friendly HTML pages.
- **Course structure and content** — follow the three Forbot courses as the source structure, with additional material added by the trainer where useful:
    1. [Kurs podstaw Arduino](https://forbot.pl/blog/kurs-arduino-podstawy-programowania-spis-tresci-kursu-id5290)
    2. [Kurs Arduino, poziom II](https://forbot.pl/blog/kurs-arduino-ii-wstep-spis-tresci-id15494)
    3. [Kurs budowy robotów](https://forbot.pl/blog/kurs-budowy-robotow-arduino-wstep-spis-tresci-id18935)
- Deliver the course as **10 training days × 8 hours = 80 didactic hours** (*godziny dydaktyczne*). The **day** is the primary delivery unit and the primary navigation axis.
- Preserve the **13-block contract** from `20_program/01_Program-kursu.md` as *metadata* on each lesson (for client reporting), not as a folder/navigation level — because blocks span multiple days (e.g. block 2 = days 1–2, block 12 = days 6–8).
- Display **Arduino C++ code samples** with syntax highlighting and copy-to-clipboard.
- Embed **schematics, photos and diagrams** (Fritzing exports, circuit images, GIFs).
- Support **callouts** (note / warning / hardware / hazard) and **task / mini-project boxes**.
- Be navigable via a **sidebar** grouped by *Weekend → Day → Lesson* (with block badges shown on each lesson).
- Be **deployable as a static site** (Vercel or any static host) — no runtime backend needed for v1.
- Be authored locally in the same Obsidian/Life-OS vault, then committed and built.

**Out of scope for v1** (reserved for v2): user authentication, per-student progress tracking, quizzes, submissions, server-side search.

Working language of the content: **Polish**. UI labels: Polish.

---

## 2. Tech Stack

### Core (already scaffolded — do not change without reason)

- **Framework:** Next.js **16.2.6** (App Router, **`app/`** directory at project root — *not* `src/app`)
- **Runtime:** React **19.2.4**, React DOM **19.2.4**
- **Language:** TypeScript **5.x**, strict mode (`"strict": true`)
- **Styling:** **Tailwind CSS v4** (configured via `@tailwindcss/postcss` — note: v4 uses CSS-first config, no `tailwind.config.ts` by default; some shadcn/ui recipes need a v4-compatible adapter)
- **Linting:** ESLint 9 + `eslint-config-next`
- **Fonts:** Geist Sans / Geist Mono via `next/font/google`

### To add (next implementation step)

- **UI primitives:** `shadcn/ui` — install with the Tailwind v4 compatible CLI. Confirmed components needed for v1: `Button`, `Card`, `Sheet`, `Sidebar`, `Breadcrumb`, `Separator`, `Tabs`, `Tooltip`, `Badge`, `Alert`, `ScrollArea`.
- **Icons:** `lucide-react`
- **Content pipeline:** `@next/mdx` + `gray-matter` + `next-mdx-remote/rsc` for RSC-streamed MDX, with custom components for callouts, code, hardware lists.
- **Syntax highlighting:** `shiki` via `rehype-pretty-code` — must register the `cpp` / `arduino` grammar. Themes: `github-light` + `github-dark`.
- **Markdown plugins:**
    - `remark-gfm` (tables, task lists)
    - `remark-math` + `rehype-katex` (formulas: ADC bit→voltage, PWM duty, Ohm's law)
    - `rehype-slug` + `rehype-autolink-headings` (deep links)
    - `rehype-mermaid` *or* client-side Mermaid (for flow diagrams)
- **Search (v1, client-side):** `Pagefind` (zero-config static search) — runs after `next build`.
- **Images:** `next/image` with `output: 'export'`-compatible loader if exporting; raw circuit photos go in `public/img/lekcje/...`.
- **Build target:** Static — set `output: 'export'` in `next.config.ts` once ready to publish to Vercel/Netlify/GitHub Pages.

### Future / v2 (DO NOT IMPLEMENT NOW)

- **Backend:** Supabase (auth + per-student progress).
- **Quizzes:** Lightweight client-only quiz components, results POSTed to Supabase.
- **Code playground:** Embedded `wokwi.com` simulator for selected lessons.

---

## 3. Repository Layout (target)

```
kurs-arduino/
├── app/                          ← Next.js App Router (NOT src/app)
│   ├── layout.tsx
│   ├── page.tsx                  ← landing / course overview
│   ├── globals.css
│   └── lekcje/
│       └── [...slug]/page.tsx    ← dynamic lesson page (catch-all)
├── components/
│   ├── ui/                       ← shadcn/ui primitives
│   ├── mdx/                      ← MDX components (Callout, Hardware, CodeBlock, Task)
│   ├── nav/                      ← Sidebar, Breadcrumbs, TOC
│   └── layout/                   ← Shell, Header, Footer
├── content/
│   └── lekcje/                   ← single source of truth for lesson MDX
│       ├── dzien-01/             ← organized by training day (1..10)
│       │   ├── 01-srodowisko-ide.mdx
│       │   └── 02-pierwszy-szkic.mdx
│       ├── dzien-02/
│       └── …
├── lib/
│   ├── content.ts                ← getAllLessons, getLessonBySlug, buildNav
│   ├── frontmatter.ts            ← Zod schema for lesson frontmatter
│   └── mdx.ts                    ← MDX compile pipeline (remark/rehype)
├── public/
│   └── img/lekcje/...            ← schematics, photos
├── PROJECT_BRIEF.md              ← this file
├── package.json
├── tsconfig.json                 ← @/* → ./* (already configured)
└── next.config.ts
```

Path alias: `@/*` already maps to `./*` — keep it.

---

## 4. Data Structure (Course Content)

The single source of truth for lesson content are **MDX files** stored in `content/lekcje/`, grouped into **one folder per training day** (`dzien-NN/`, `NN` ∈ 01..10). Each file's filename starts with a two-digit order prefix (`01-`, `02-`, …) reflecting the order of that lesson within the day.

The 13 program blocks from `20_program/01_Program-kursu.md` are tracked **as metadata** on each lesson (the `block` / `blockTitle` frontmatter fields), so the same Markdown corpus can be re-projected as a "by-block" view at `/program` for client reporting.

### 4.1 Lesson frontmatter — required schema

> Note: the Life-OS Obsidian metadata (`type: note`, `namespace`, `status`, `sensitivity`) is kept ONLY for vault hygiene and does NOT drive the site. The site reads the fields below.

```yaml
---
# --- Life-OS / Obsidian (kept for vault, ignored by the site) ---
type: note
namespace: "123-Edu-Kursy"
status: draft
sensitivity: low

# --- Site-driving fields (required) ---
title: "Środowisko Arduino IDE i pierwszy szkic"
slug: "srodowisko-ide-i-pierwszy-szkic"   # URL part inside the day folder
summary: "Instalacja IDE, struktura szkicu setup()/loop(), wgranie Blink na UNO."

day: 1                                    # 1..10 (training days) — PRIMARY axis
weekend: 1                                # 1..5
order: 1                                  # order within day (matches file prefix)
duration: 60                              # minutes
block: 1                                  # 1..13 — client-contract mapping (metadata only)
blockTitle: "Podstawy Arduino i środowisko IDE"
forbotCourse: 1                           # 1 = Podstawy, 2 = Poziom II, 3 = Roboty
forbotChapter: 1                          # chapter number within that Forbot course

objectives:                               # learning objectives — rendered as a list
  - "Zainstalować Arduino IDE i sterowniki UNO"
  - "Wyjaśnić różnicę między setup() a loop()"
  - "Wgrać szkic Blink na płytkę"

prerequisites:                            # other lesson slugs that must be done first
  - "dzien-01/00-wprowadzenie"

hardware:                                 # components needed at the bench
  - { name: "Arduino UNO R3", qty: 1 }
  - { name: "Kabel USB-B",     qty: 1 }
  - { name: "Dioda LED",       qty: 1, optional: true }

tags: [arduino, ide, blink, setup-loop]
sources:                                  # citations / references
  - "[[../../40_materialy/Ebooki Arduino - Helion/ksiazki/arduino-dla-poczatkujacych-podstawy-i-szkice-krok-1-wydanie-2-169s.|Książka B, r. 1–2]]"
  - "https://forbot.pl/blog/kurs-arduino-srodowisko-jak-zaczac-programowac-id936"

cover: "/img/lekcje/dzien-01/ide-pierwszy-szkic.png"  # optional
publish: true                             # gate: false = skipped at build time
updated: "2026-05-11"
---
```

A **Zod schema** in `lib/frontmatter.ts` validates every file at build time. Build fails on missing required fields.

### 4.2 URL routing

```
/                                                       → course landing
/program                                                → 13 blocks overview (client-contract view)
/harmonogram                                            → 10 days timeline (primary delivery view)
/lekcje/<day-folder>/<file-slug>                        → individual lesson
e.g. /lekcje/dzien-01/01-srodowisko-ide
```

`generateStaticParams` walks `content/lekcje/**/*.mdx`, validates frontmatter via Zod, and emits a route per file where `publish: true`.

### 4.3 Navigation (derived, not hand-written)

The sidebar is built from frontmatter at build time, **ordered by `weekend → day → order`, grouped by `day`** (one collapsible group per training day, days grouped under their weekend heading). Each lesson row carries a small **block badge** (`B1`..`B13`) so the client-contract mapping is visible without making block a navigation level. The `/program` page re-projects the same corpus by `block` for client reporting. The 13 blocks and 10 days come from `20_program/01_Program-kursu.md` and `20_program/02_Harmonogram-zjazdow.md`.

### 4.4 Custom MDX components (used inside lessons)

- `<Callout type="note|warning|hardware|hazard|tip">…</Callout>`
- `<Hardware items={[…]} />`               — renders the hardware list
- `<Task>…</Task>`                         — student task box
- `<MiniProject title="…">…</MiniProject>`
- `<Schematic src="…" caption="…" />`
- `<Code lang="cpp" file="blink.ino">…</Code>` — wraps Shiki with file label + copy button

---

## 5. Open questions / decisions to lock in

1. **Static export (`output: 'export'`) vs Vercel runtime:** Static export is cheaper and simpler; Vercel runtime gives ISR for frequent edits. Recommendation: **static export** — content changes are batched per weekend.
2. **Forbot mapping audit:** confirm with the trainer the exact mapping of Forbot chapters (Kurs I #1–#10, Kurs II #1–#9, Kurs Robotów #1–#9) onto the 10 training days, then encode it in `forbotCourse` / `forbotChapter` on every lesson.
3. **License of student submissions / images:** to confirm with West Pomeranian.
4. **Hosting target:** Vercel vs GitHub Pages vs school-hosted — affects asset path prefix in `next.config.ts`.

> Decisions already made (do not re-open without reason):
> - Content pipeline: `@next/mdx` + `gray-matter` + `next-mdx-remote/rsc` (see §2).
> - Primary navigation axis: **day**, not block (see §1, §4.3).
> - `<html lang="pl">` and Polish course metadata are set in `app/layout.tsx`.

---

## 6. Implementation order (suggested)

1. Replace placeholder `app/page.tsx` with a course landing page (course title, 10-day timetable, link to `/harmonogram` and `/program`). (`<html lang="pl">` and metadata are already set.)
2. Wire up `@next/mdx` + `gray-matter` + `next-mdx-remote/rsc`; add `shiki` + `rehype-pretty-code` with the `cpp` grammar.
3. Define the Zod frontmatter schema in `lib/frontmatter.ts` matching §4.1.
4. Seed `content/lekcje/dzien-01/01-srodowisko-ide.mdx` as a reference lesson.
5. Build `app/lekcje/[...slug]/page.tsx` with `generateStaticParams` walking `content/lekcje/**/*.mdx`.
6. Build the sidebar (Weekend → Day → Lesson with block badges) from frontmatter.
7. Add `/program` (by-block view) and `/harmonogram` (by-day view) re-projecting the same corpus.
8. Add Pagefind post-build step.
9. Switch `next.config.ts` to `output: 'export'` and verify the static build.
