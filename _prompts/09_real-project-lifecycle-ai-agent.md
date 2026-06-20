# Prompt 09 — Applied capstone: a real embedded project, idea → product, built with an AI agent

Act as the **curriculum author** for the Arduino course at TTC Szczecin (Polish technikum). Extend the AI‑assisted
development arc of the dzień‑9 module with **one applied capstone lesson** in which students run a **self‑chosen,
slightly bigger embedded project** through the full **idea → product** lifecycle, working **with an AI agent** and using
a **git‑tracked PlatformIO repo as the single source of truth and the AI's memory**.

This lesson teaches the **method** and ends with a **finishable, real project**. Do **not** duplicate lesson 28 —
lesson 28 builds *one* feature end‑to‑end (the mechanics); this lesson applies the *whole method* to a larger project
of the student's choice. Keep every existing convention; do **not** edit the schema or components.

> Scope note: the boards are 8‑bit Arduino UNO R3 (ATmega328P) with **no networking**. Do **not** call this "IoT".
> Say "automatyczne systemy wbudowane". Only mention connectivity (ESP8266/ESP32) as an out‑of‑scope "what next".

---

## STEP 1 — Read and orient (do this first)

Read the current dzień‑9 lessons and reuse their voice, components and continuity:

- `24` PlatformIO project (`platformio.ini`, build/upload/monitor) · `25` AI assistants (Copilot base + Cursor/Windsurf
  + chatbots) · `26` Spec‑Driven Development (spec, **konstytucja**, file placement: `.github/copilot-instructions.md`
  + `docs/spec-*.md` via `#`) · `27` verification gate + hallucinations + Wokwi · `28` 9‑phase build of the parking sensor.
- Background: `_docs\07-ai-in-embeded-sys-research\` (SDD, **Problem‑Driven Design §2.2**, AI‑as‑engineer, verification).
- Students finished the whole prior course (Forbot I/II + robot course): they know PWM, ADC, I²C, sensors, motors.
  Pitch this at the **next** level — turning that knowledge into a repeatable engineering method.

**The single most important thing to get right:** lesson 28 = build one feature; this lesson = run a bigger project
through the lifecycle with an agent. State that distinction in the lesson so the two capstones don't overlap.

---

## STEP 2 — The new attitude the lesson must land (state it crisply)

A short, memorable thesis, then everything else supports it:

- **You are the architect and reviewer; the AI is an intern that drafts.** You decide, you verify (lesson 27).
- **The git repo is the project's memory and the AI's context.** "Write to the repo" = **commit** each stage.
- **Documentation is written BEFORE code and lives in the repo** — idea, architecture, spec, decisions.
- **Start from the problem, not the component** (the inverse of how we learned in class).

---

## STEP 3 — Content to teach (merged and de‑duplicated)

**A. Problem‑ and architecture‑first (merge the reframe with Problem‑Driven Design, research §2.2).** In class we built
systems *after* explaining each component (PWM, ADC, …); real work runs the other way. The front of the lifecycle is:
**problem → physical constraints → architecture options → tech stack + components → datasheets**. Make the abstract
terms concrete for 8‑bit so the AI can't produce enterprise fluff:
- *Problem & physical constraints* (Problem‑Driven Design): for "a rover that stops before a wall" — stopping distance,
  motor speed, chassis weight, battery capacity — **before** any spec.
- *Architecture* here = sensor/actuator choice, bus (I²C vs analog), power (USB vs battery vs separate motor supply),
  timing model (`millis()` vs blocking), file/module structure — **not** servers or microservices.
- *Tech stack* here = board + Arduino framework + libraries + tools (PlatformIO, Wokwi). Only *then* code.

**B. The lifecycle, classic vs AI‑agent era, side by side.** Refine the author's drafts into clean, well‑named stages
(add: requirements, architecture options, datasheets, iteration, final documentation). Express the AI‑era version as a
**micro‑loop repeated at every stage**:
**Zapisz/commit do repo → Omów z AI → Zweryfikuj (datasheet/Wokwi — bramka z lekcji 27) → Zdecyduj i zapisz decyzję.**
Say *what* to ask the AI per stage (architecture trade‑offs, BOM draft, edge cases, code review) and stress that the
**student decides** — "discuss" never becomes "let the AI choose". Show both lifecycles with a `<Table>` or ordered lists.

> author's drafts to improve — classic: Idea → tech stack + components → simulation → analyse & solve → physical
> prototype → analyse & solve → product. AI‑era: the same, but every stage is "commit to repo → discuss with AI →
> verify → decide".

**C. The git‑tracked repo layout for working WITH an agent.** Refine and explain this corrected layout (verify the
tool‑specific paths — see STEP 6 — before stating them as fact):

```
projekt/                          # repo git — „zapis do repo" = commit na każdym etapie
├── .github/
│   └── copilot-instructions.md   # KONSTYTUCJA dla Copilota (auto-context)
├── .cursor/  /  .windsurf/        # odpowiednik reguł dla Cursor / Windsurf (jeśli ich używasz)
├── docs/
│   ├── 00-idea.md                # problem + oczekiwane zachowanie
│   ├── 01-architektura.md        # warianty architektury + wybór i uzasadnienie
│   ├── 02-tech-stack.md          # płytka, biblioteki, narzędzia + dlaczego
│   ├── 03-spec.md                # specyfikacja (SDD, wzór z lekcji 26)
│   ├── 04-plan.md                # podział na zadania
│   ├── 05-dziennik.md            # log problemów i decyzji (symulacja, prototyp)
│   └── 06-datasheety-notatki.md  # PRZEPISANE kluczowe liczby: piny, V, mA, czasy
├── datasheets/                   # surowe PDF-y (dla człowieka, nie dla AI)
├── diagram.json + wokwi.toml     # symulacja Wokwi (zwykle w korzeniu — zweryfikuj)
├── src/  lib/  include/          # kod (PlatformIO)
└── platformio.ini
```

Two corrections to teach explicitly: (1) **don't feed raw datasheet PDFs to the AI** — the AI reads them unreliably
(lesson 27); instead **transcribe the key numbers** into `06-datasheety-notatki.md`, which the agent *can* use via `#`.
(2) **Make context tool‑agnostic:** `.github/copilot-instructions.md` is Copilot‑only; give the Cursor/Windsurf
equivalent for students who used those in lesson 25.

**D. The agent session protocol (repeatable checklist).** A concrete loop the student runs every working session:
open repo → confirm the konstytucja is current → attach the relevant `docs/*.md` to chat with `#` → state the lifecycle
stage and the goal → ask → **verify against the datasheet note / Wokwi** → write the decision to `05-dziennik.md` →
**commit**. Render it as an ordered list or `<Callout>`.

**E. Tool/agent reality (verify, then state).** Distinguish **agent mode** (multi‑file, semi‑autonomous edits) from
plain inline/chat assistance, and warn that on **Copilot Free** premium/agent requests are capped (per lesson 25), so
heavy agent use may need careful budgeting or a local/alternative tool. Keep it honest and current.

---

## STEP 4 — What the lesson must SHIP (make it real and practical, not just explained)

The lesson is incomplete unless it gives students copy‑paste artifacts and a finishable deliverable:

1. **Ready‑to‑use templates** (in `<Code>` blocks) for every repo file: `00-idea.md`, `01-architektura.md`,
   `02-tech-stack.md`, `04-plan.md`, `05-dziennik.md`, `06-datasheety-notatki.md`, and a **starter
   `copilot-instructions.md`** (reuse the konstytucja from lesson 26). `03-spec.md` reuses the lesson‑26 spec template.
2. **One worked example on a project with *genuine* architectural choices** — e.g. a multi‑sensor monitoring node or a
   robot behaviour (power + motor supply + bus + timing decisions). Use the parking sensor only as a one‑line callback,
   because it is too small to *have* architecture decisions.
3. **The agent session protocol** as a concrete checklist (STEP 3D).
4. **A "definition of done" / acceptance checklist** for the capstone: filled `docs/`, transcribed datasheet notes,
   passing Wokwi sim, working sketch on hardware, decision log, and a git history with a commit per stage.
5. **The deliverable `<Task>`/`<MiniProject>`:** the student runs their **own chosen** project through the full
   lifecycle and submits the repo. This is what makes the dzień‑9 block "real to complete".

Use existing MDX components only (`<Table>`, `<Code>`, `<Callout>`, `<Expandable>`, `<Task>`, `<MiniProject>`,
ordered lists). No new components, no Mermaid, no broken images.

---

## STEP 5 — Placement, conventions, schema

- **Placement (recommended): day 10.** Day 9 already holds five lessons (24–28); weekend 5 spans days 9–10 and a
  finishable capstone needs time. Create the lesson under `content\lekcje\dzien-10\` with `day: 10`, `weekend: 5`.
  Add **light cross‑links only**: in lesson 28 (one line: "this is one feature of the bigger lifecycle → see capstone")
  and lesson 26 (one line pointing to the fuller repo layout). If the author insists on day 9, use `day: 9`, `order: 6`
  instead — but prefer day 10 and rebalance.
- **Polish content, ASCII slug**, e.g. `XX-od-pomyslu-do-produktu-z-agentem-ai.mdx`. **Verify the next free global file
  number** and the day‑10 `order` against existing files before naming.
- **Frontmatter valid against `lib/frontmatter.ts`:** all required fields, `block: 1`,
  `blockTitle: "Podstawy Arduino i środowisko IDE"`, measurable `objectives`, `prerequisites` chaining to
  `dzien-09/miniprojekt-od-specyfikacji-do-ukladu`, `publish: true`, `updated:` = today.
- **Schema debt (flag, don't hide):** `forbotCourse`/`forbotChapter` are required but this module is not Forbot‑sourced.
  Set `forbotCourse: 3` + a sequential `forbotChapter` only to pass Zod, and put real citations in `sources:`. In your
  final report, **recommend the proper fix** to the teacher: make those two fields optional in `lib/frontmatter.ts`
  (a one‑line change) so future non‑Forbot lessons stop faking them. Do **not** change the schema in this task.
- C++ for Arduino UNO R3 / ATmega328P, PlatformIO style, Polish comments, wrapped in `<Code lang="cpp" file="…">`.

---

## STEP 6 — Verify before you write (these facts are volatile/technical)

Use web search to confirm, then state accurately: GitHub Copilot **agent mode** availability and Free‑tier limits;
the **Cursor** and **Windsurf** project rules‑file locations; where **Wokwi** for VS Code expects `diagram.json` /
`wokwi.toml`; and the GitHub Copilot **custom‑instructions** + `#`‑context behaviour. Cite official/external URLs in
`sources:` (PlatformIO docs, GitHub Copilot docs, GitHub Spec Kit, Wokwi, the course harmonogram
<https://kurs-arduino.vercel.app/harmonogram>). Use the research reports as background only — do **not** cite their
`_docs\…` vault paths.

---

## STEP 7 — After writing

1. List every file created or edited.
2. One‑paragraph summary of the new lesson and of each cross‑link edit to 26/28.
3. Validate: run `npm run build` (or the project's Zod + MDX check) and confirm all dzień‑9/10 lessons pass.
4. Report: facts you could not re‑verify, the `forbotCourse` workaround used, and the recommended optional‑schema fix.
