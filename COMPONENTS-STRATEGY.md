# Component Strategy - Kurs Arduino

## Current Architecture

This project is a small Next.js App Router site using:

- `content/lekcje/**/*.mdx` as the lesson source.
- `lib/content.ts` for build-time lesson discovery, ordering, and navigation data.
- `lib/mdx.ts` with `next-mdx-remote/rsc` for server-side MDX compilation.
- `components/mdx/index.ts` as the single registry of components available in lesson MDX.
- `components/layout/Shell.tsx` and `components/nav/Sidebar.tsx` as the course chrome.
- Tailwind v4 plus global course CSS in `app/globals.css`.

The component strategy should therefore stay lightweight. Do not install a large UI system as a prerequisite. Build small typed primitives first, promote only repeated patterns into shared components, and keep lesson components as Server Components unless they need browser APIs.

## Design Principles

1. **MDX components are the lesson-authoring API.** If a teacher should write it inside `.mdx`, it belongs in `components/mdx` and must be exported from `components/mdx/index.ts`.
2. **UI components are reusable page primitives.** Navigation, badges, tables, alerts, pagination, and progress indicators belong in `components/ui`.
3. **Server-first by default.** Most educational components render static content and should remain Server Components. Client Components are reserved for interactions such as copy buttons, accordions, quizzes, search, and theme toggles.
4. **Polish labels by default.** The student-facing interface is Polish; props can remain English for developer ergonomics.
5. **Hardware clarity beats decorative polish.** Prioritize pin references, expected output, wiring notes, and troubleshooting over generic cards or modal patterns.
6. **No dependency churn for MVP.** Use existing dependencies (`next`, `react`, `lucide-react`, Tailwind) before adding shadcn or headless UI packages.

## Implemented Foundation

Existing components:

- `components/layout/Shell.tsx`
- `components/nav/Sidebar.tsx`
- `components/mdx/Callout.tsx`
- `components/mdx/Code.tsx`
- `components/mdx/Hardware.tsx`
- `components/mdx/MiniProject.tsx`
- `components/mdx/Schematic.tsx`
- `components/mdx/Task.tsx`

Phase 1 should extend this foundation instead of replacing it.

## Phase 1 - Lesson MVP

Goal: make the first weekend lessons easier to follow in a classroom.

### MDX Components

- `Objectives` - reusable goal list for lesson openings or section-level objectives.
- `Prerequisites` - renders prior knowledge or previous lesson requirements.
- `Pinout` - concise board/pin reference table, especially for Arduino UNO.
- `ExpectedOutput` - shows what students should see in hardware behavior or Serial Monitor.
- `Troubleshooting` with `Issue` - common symptoms and fixes.

`Breadboard` remains deferred until there are real diagrams or a stable schematic format. For now, use `Schematic` for images and `Pinout`/`Callout` for wiring clarity.

### UI Components

- `Alert` - system or content notices outside MDX.
- `Badge` - block, difficulty, status, and small metadata labels.
- `Breadcrumb` - course position in lesson pages.
- `Pagination` - previous/next lesson navigation.
- `Progress` - lesson progress within the published course.
- `Table` - reusable accessible table styling for pages and MDX helpers.

`CopyButton` is intentionally not Phase 1 unless code extraction is solved cleanly. `rehype-pretty-code` owns the rendered `<pre>` output, so copying should be added as a small client enhancement around code blocks later.

## Phase 2 - Teaching Depth

Add once the first lessons repeatedly need them:

- `CodeExplained` - line-by-line beginner explanations.
- `ComparisonTable` - concept/function comparisons.
- `References` - source list and further reading.
- `Tabs` - alternate code or explanation views. This will be a Client Component.
- `Accordion` - optional deep dives and classroom FAQs.
- `Tooltip` - short explanations for abbreviations and icons.

## Phase 3 - Interactivity

Add when the content volume justifies the extra client bundle:

- `Quiz` / `SelfCheck`
- `SearchBar`
- `ThemeToggle`
- `Modal`
- richer breadboard/circuit visualization

## File Structure

```txt
components/
  layout/
    Shell.tsx
  mdx/
    Callout.tsx
    Code.tsx
    ExpectedOutput.tsx
    Hardware.tsx
    MiniProject.tsx
    Objectives.tsx
    Pinout.tsx
    Prerequisites.tsx
    Schematic.tsx
    Task.tsx
    Troubleshooting.tsx
    index.ts
  nav/
    Sidebar.tsx
  ui/
    Alert.tsx
    Badge.tsx
    Breadcrumb.tsx
    Pagination.tsx
    Progress.tsx
    Table.tsx
    index.ts
```

## Lesson Page Integration

The lesson route should derive navigation context from `getAllLessons()`:

- breadcrumb: Kurs -> Zjazd -> Dzien -> current lesson
- progress: current lesson index / total published lessons
- previous/next: adjacent published lessons in course order
- objectives/hardware/prerequisites: rendered from frontmatter before MDX body

This keeps lesson MDX focused on teaching content while frontmatter handles repeated metadata.

## Authoring Examples

```mdx
<Pinout board="Arduino UNO">

| Pin | Funkcja | Notatka |
| --- | --- | --- |
| GND | Masa | Wspolny punkt odniesienia ukladu |
| 5V | Zasilanie | Nie zwierac z GND |
| D0-D13 | Piny cyfrowe | D3, D5, D6, D9, D10, D11 maja PWM |

</Pinout>
```

```mdx
<ExpectedOutput title="Efekt po wgraniu">
Dioda podlaczona do pinu 8 swieci stale. Po zmianie programu miga co 500 ms.
</ExpectedOutput>
```

```mdx
<Troubleshooting>
  <Issue title="LED nie swieci">
    - Sprawdz polaryzacje diody.
    - Sprawdz, czy rezystor laczy katode z GND.
    - Upewnij sie, ze w kodzie uzywasz tego samego pinu co w ukladzie.
  </Issue>
</Troubleshooting>
```

## Deferred Decisions

- Do not add shadcn until the app needs complex accessible widgets that are painful to maintain manually.
- Do not create an `icons/` folder while `lucide-react` already covers icon needs.
- Do not build a custom breadboard DSL before lessons have enough real wiring examples to validate the API.
- Do not make MDX authors import components manually; keep the registry centralized.
