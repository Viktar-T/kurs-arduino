# Prompt 08 — Build the "PlatformIO + AI tools" lesson module (dzień 9)

Act as the **curriculum author** for the Arduino course at TTC Szczecin (Polish-language technikum,
80 h, 10 days × 8 h, May–June 2026). Your job in this run is to design and write a **ready-to-use,
practical mini-module** that teaches students to develop Arduino firmware in **VS Code + PlatformIO**
with the help of **AI coding assistants** — and to do it *safely and like an engineer*, not by
"vibe coding". Output is a set of Polish MDX lessons in `content\lekcje\dzien-09`.

Follow the existing lesson conventions exactly. Read `@.claude/agents/lesson-author.md`,
`@lib/frontmatter.ts`, `components/mdx/index.ts`, and 2–3 neighbouring published lessons (e.g.
`content\lekcje\dzien-07\23-Budowa-robotow-wstep-spis-tresci.mdx`,
`content\lekcje\dzien-04\13.01-miniProject.mdx`) before writing, and mirror their frontmatter,
component usage, tone and structure. Do **not** edit the schema, components, or other lessons.

---

## STEP 1 — Analyse before you write (do this first, do not skip)

### 1a. Student knowledge baseline — calibrate the level

These 10 students have **already completed** the full course so far. Assume they are fluent in
everything below and **do not re-teach it** — build on it:

- the entire programme at <https://kurs-arduino.vercel.app/harmonogram>;
- Forbot — Kurs podstaw Arduino: <https://forbot.pl/blog/kurs-arduino-podstawy-programowania-spis-tresci-kursu-id5290>;
- Forbot — Kurs Arduino II: <https://forbot.pl/blog/kurs-arduino-ii-wstep-spis-tresci-id15494>;
- Forbot — Kurs budowy robotów: <https://forbot.pl/blog/kurs-budowy-robotow-arduino-wstep-spis-tresci-id18935>.

So they already know: the **Arduino IDE**, C++ fundamentals (types, variables, operators, conditions,
functions, loops, arrays, classes), digital/analog I/O, PWM, ADC, UART/I2C/SPI, LCD, servos, DC motors,
sensors (HC-SR04, PIR, DHT, LM35/DS18B20), interrupts, `millis()` multitasking, RGB, and basic mobile-robot
construction. What is **new** to them: PlatformIO, a professional VS Code workflow, and **AI-assisted
embedded development**. Pitch every lesson at that gap.

### 1b. Read the research — it is your source of truth for methodology and the tool stack

Read both reports in full and base the module's methodology, tool recommendations and safety content on them:

- `_docs\07-ai-in-embeded-sys-research\01_AI-Embedded-Sys-Report-gemini_DR.md`
- `_docs\07-ai-in-embeded-sys-research\01_genai-embedded-systems-education-perplexity.md`

Mine them specifically for: **Spec-Driven Development (SDD)**; "AI as an engineering assistant, not a
cheat code"; the **hardware-hallucination dangers** (5 V driven into a 3.3 V sensor, exceeding the
ATmega328P GPIO current limits ~20 mA recommended / 40 mA max, missing flyback diodes, fabricated
libraries/pins); the **critical-verification / datasheet gate**; the recommended **classroom tool stack**;
the **9-phase student workflow** (Phase 0 setup → spec/BOM/wiring → Wokwi simulation → code gen → review
gate → build & flash → test → debug & iterate); and the eight classroom strategies. These reports are
your knowledge base — but do **not** cite their internal `_docs\...` paths in `sources:` (see §4).

---

## STEP 2 — Divide the module into logical lessons

Split the topic into separate `lekcje`, each one self-contained with its own objectives, code and exercise.
Use the following structure as the **recommended default** (refine, merge or split only if the research
clearly suggests a better grouping; keep it to ~4–6 lessons). Suggested file numbers continue the global
running counter — verify the next free numbers against existing files before naming, then keep `order`
per-day starting at 1.

1. **`24-platformio-vs-code-srodowisko.mdx` — PlatformIO w VS Code: profesjonalne środowisko zamiast Arduino IDE.**
   Po co wychodzić poza Arduino IDE; instalacja VS Code + rozszerzenia PlatformIO; anatomia projektu
   (`src/`, `lib/`, `platformio.ini`, `board = uno`, `framework = arduino`); budowanie, wgrywanie i monitor
   portu szeregowego (`pio run`, `pio run -t upload`, `pio device monitor`); zarządzanie bibliotekami.
   Ćwiczenie: przenieść znany szkic z wcześniejszych zajęć (np. czujnik / robot) do PlatformIO.

2. **`25-asystenci-ai-w-vs-code.mdx` — Asystenci AI w VS Code: GitHub Copilot (Student) i darmowe alternatywy.**
   Krajobraz narzędzi; instalacja i logowanie do **GitHub Copilot** (uzupełnianie inline + czat). Sekcja
   o darmowym dostępie dla uczniów (patrz §3). Tabela porównawcza alternatyw. Krótka wzmianka o symulatorze
   **Wokwi** jako bezpiecznej piaskownicy. Nota o RODO/zgodzie rodziców (uczniowie < 18 lat).

3. **`26-ai-jako-asystent-inzyniera-sdd.mdx` — AI jako asystent inżyniera, nie „ściąga": Spec-Driven Development.**
   Metodyka „najpierw specyfikacja"; szablon specyfikacji; jak napisać dobry prompt do systemów wbudowanych
   (zawsze podać: Arduino UNO R3 / ATmega328P, PlatformIO, realne liczby z datasheetów); kontrast z „vibe
   coding"; metafora „AI to stażysta-inżynier bez własnego osądu". Ćwiczenie: napisać specyfikację małej
   funkcji, potem zlecić AI szkic na jej podstawie.

4. **`27-weryfikacja-i-bezpieczenstwo-sprzetu.mdx` — Krytyczna weryfikacja i bezpieczeństwo sprzętu: łapanie halucynacji AI.**
   Niebezpieczeństwa halucynacji sprzętowych; weryfikacja względem datasheetu; wzorzec „promptu
   weryfikującego"; **checklista przeglądu kodu (bramka)** przed wgraniem na fizyczną płytkę; jak błędy
   kompilatora wyłapują zmyślone wywołania; symulacja w Wokwi przed podłączeniem układu; „Biblioteka błędów
   AI". Ćwiczenie: dostać celowo błędną odpowiedź AI i znaleźć oraz poprawić usterki.

5. **`28-miniprojekt-od-specyfikacji-do-ukladu.mdx` — Mini-projekt: od specyfikacji do działającego układu z AI** (lekcja kończąca moduł).
   Pełny 9-fazowy workflow zastosowany od początku do końca na realnym, małym projekcie (np. funkcja powiązana
   z ich robotem albo gadżet czujnikowy): setup → specyfikacja/BOM/schemat (zweryfikowane) → symulacja Wokwi →
   generowanie kodu → bramka przeglądu → kompilacja i wgranie → test → debugowanie. Użyj komponentu
   `<MiniProject>`. Efekt: specyfikacja + zweryfikowany, działający szkic.

---

## STEP 3 — GitHub Copilot Edu first, plus free AI options for students (must cover)

Students are expected to have **GitHub Copilot through education** as the primary assistant — so make the
"how to get it" path concrete:

- **GitHub Copilot — plan Student / GitHub Student Developer Pack** (<https://education.github.com/pack>):
  darmowy dla zweryfikowanych uczniów (weryfikacja przez e-mail/legitymację szkolną, wiek 13+); polskie
  technika kwalifikują się. Native w VS Code, mocny w C/C++.

In addition, **present alternative ways for a student to use AI for free** (so nobody is blocked if
verification stalls). Cover at least:

- **Claude.ai (free)** i/lub **ChatGPT (free)** — najlepsze do *wyjaśniania* kodu C++ i logiki „dlaczego";
- **Gemini Code Assist** — bardzo wysoki darmowy limit uzupełnień (dobry zapas), ale sprawdzić ustawienia prywatności;
- **Continue.dev + Ollama** (np. model Qwen2.5-Coder) — w 100% lokalnie, offline, zgodne z RODO, bez kont — wariant „złoty standard prywatności";
- **Codeium / Windsurf** oraz **Cline** (agentowy, krok-po-kroku) — jako dodatkowe opcje;
- jako sanity-check: **Arduino Cloud AI Assistant** (RAG po oficjalnej dokumentacji, ~30 interakcji/mies. za darmo).

Add a short, honest note: **Cursor's** free student year is **university-only** (`.edu`), so technikum
students are *not* eligible — do not build around it. Include a brief **RODO/GDPR + parental-consent** note
for cloud tools and recommend the local Continue.dev+Ollama path for routine work.

⚠️ **Verify current facts before writing.** Pricing, free tiers and eligibility change often (the reports
themselves warn about this). Use web search to re-confirm each tool's current free-for-students status and
update any figures, then cite the official page.

---

## STEP 4 — Conventions every lesson must follow

- **Polish content, ASCII slugs.** Body, headings and callouts in Polish; file name and `slug` lowercase
  ASCII without diacritics. One `.mdx` per lesson in `content\lekcje\dzien-09\MM-slug.mdx`, `MM` matching `order` intent.
- **Frontmatter first, valid against `lib/frontmatter.ts`.** Fill every required field. Use `day: 9`,
  `weekend: 5`, `order:` 1..N in sequence, realistic `duration` (minutes), `block: 1`,
  `blockTitle: "Podstawy Arduino i środowisko IDE"` (PlatformIO is the IDE/environment topic — keep it
  consistent across the module). `objectives:` ≥1 concrete, measurable items. Set `publish: true` and
  `updated:` to today's date.
- **Schema-required Forbot fields:** the schema demands `forbotCourse` (1|2|3) and `forbotChapter` (int ≥1)
  even though this module is **not** Forbot-sourced. Set `forbotCourse: 3` (the students' most recent context)
  and increment `forbotChapter` per lesson purely to satisfy Zod; the *real* sources go in `sources:`. If you
  judge a cleaner value satisfies validation, use it — but never modify the schema, and flag the choice in
  your final summary.
- **Use the registered MDX components**, not ad-hoc HTML: `<Callout>`, `<Objectives>`, `<Prerequisites>`,
  `<Hardware>`, `<Code lang="cpp" file="…">`, `<Task>`, `<MiniProject>`, `<ExpectedOutput>`,
  `<Troubleshooting>`/`<Issue>`, `<Table>`, `<Expandable>`, `<Photo>`/`<Schematic>`/`<Video>` where a visual helps.
- **Code is C++ for Arduino UNO R3 / ATmega328P**, PlatformIO-style (`#include <Arduino.h>`); comments in
  Polish; wrap larger sketches in `<Code lang="cpp" file="…">`. Show `platformio.ini` where relevant.
- **Each lesson includes at least one `<Task>`** (hands-on exercise) and a closing **Podsumowanie**.
  End-of-module lesson includes a `<MiniProject>`.
- **`prerequisites:`** chain lessons within the module and back to the relevant earlier lesson.

---

## STEP 5 — Sources & citations

In each lesson's `sources:`, cite the **official / external** URLs the content rests on (verify each with web
search), e.g. PlatformIO docs (<https://docs.platformio.org>), GitHub Education / Copilot docs, the chosen
free-AI tools' pages, Wokwi (<https://wokwi.com>), Continue.dev / Ollama, the Arduino blog, and the course
harmonogram (<https://kurs-arduino.vercel.app/harmonogram>). Use the two research reports as your *background
knowledge*, but **do not** put their `_docs\...` vault paths in `sources:`.

---

## STEP 6 — After writing

1. List each file path you created.
2. One-paragraph summary per lesson (what it teaches, key exercise).
3. Run `npm run build` to confirm Zod frontmatter validation passes; fix any errors.
4. Note any facts you could not re-verify and any frontmatter compromises (e.g. the Forbot fields).
