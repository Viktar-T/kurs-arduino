w 15_courses/2026-TTC-Szczecin-Arduino-i-Roboty/20_program/01_Program-kursu mam punkt | 11 | Wielozadaniowość, opóźnienia.

napisz gotowy skrypt zajęć dla nauczyciela do prowadzenia zajęcia na temat Wielozadaniowość, opóźnienia. skrypt zajęć musi być logiczny, zrozumiały dla uczniów, pobudzający interes uczniów, pobudzający do pracy. Skrypt musi zawierać teorie oraz praktykę, zawierać zadania dla studentów. napisz skrypt jako .md file w folderze 15_courses/2026-TTC-Szczecin-Arduino-i-Roboty/40_materialy/teoria-niektore-tematy/programowanie
=======================

**Role & Context:**
Act as an expert computer science educator and technical writer. 

**Task 1: File Renaming**
Rename the following file:
- From: `content\lekcje\dzien-01\06-UART-(komunikacja-z-PC)-zmienne.mdx`
- To: `content\lekcje\dzien-01\06.01-UART-(komunikacja-z-PC)-zmienne.mdx`

**Task 2: Create a New Lesson Script**
Create a new file named: `content\lekcje\dzien-01\06.02-UART-zmienne.mdx`. 
This file must be a comprehensive, ready-to-use lesson script for a teacher (skrypt zajęć dla nauczyciela) written entirely in **Polish**.

**Reference Materials (Context):**
- Strict Formatting Guidelines: `@lesson-author.md`
- Technical Knowledge Base (UART & Zmienne): `@public\docs`
- Previous Lesson (for context): `@content\lekcje\dzien-01\06.01-UART-(komunikacja-z-PC)-zmienne.mdx` (Use the newly renamed file).

**Content Requirements & Constraints for 06.02:**
1. **Focus:** The primary focus is deeply exploring "Zmienne" (Variables) in the context of UART communication.
2. **Progression:** The difficulty level must be strictly higher/more advanced than lesson 06.01.
3. **Strict No-Duplication:** Do NOT repeat the foundational information already explained in 06.01. Assume students have fully mastered it.
4. **Pedagogical Quality:** 
   - The script must be highly logical and clearly structured.
   - It must be highly engaging for students (pobudzający interes).
   - It must include active learning elements to motivate hands-on work (pobudzający do pracy).

=========================

**Role & Context:**
Act as an expert computer science educator and technical writer. 

**Task: Create a New Lesson Script**
Create a new file named: `content\lekcje\dzien-01\06.02-UART-zmienne.mdx`. 
This file must be a beginer-mid level, ready-to-use lesson script for self studying, written entirely in **Polish**.

**Reference Materials (Context):**
- Strict Formatting Guidelines: `@lesson-author.md`
- Technical Knowledge Base (UART & Zmienne): `@public\docs`
- Previous Lesson (for context): `@content\lekcje\dzien-01\06.01-UART-(komunikacja-z-PC)-zmienne.mdx` (Use the newly renamed file).

**Content Requirements & Constraints for 06.02:**
1. **Focus:** 
   - typy: bool, byte, int, long, char, String. tasks should explain the types. Mostly examples and tasks should be related to use veraibles in UART.
   - używać skróconych operatorów (++, --, +=, -=) zamiast długich form.
   - zmienną globalną od lokalnej i wybrać właściwą.
   - opisać float i pułapka dzielenia całkowitoliczbowego.
   - Odbieranie liczb przez UART — Serial.parseInt()
2. **Strict No-Duplication:** Do NOT repeat the information already explained in 06.01. 
3. **Pedagogical Quality:** 
   - The script must be highly logical and clearly structured.
   - It must be highly engaging for students (pobudzający interes).
   - It must include active learning elements to motivate hands-on work (pobudzający do pracy).

=========================
**Role & Context:**
Act as an expert computer science educator and technical writer specializing in embedded systems (Arduino/C++). 

**Task: Create a Self-Study Tutorial**
Create a new file named: `content\lekcje\dzien-01\06.02-UART-zmienne.mdx`. 
This file must be a beginner-to-mid level, ready-to-use **self-study guide** (samouczek do samodzielnej nauki), written entirely in **Polish**. Address the student directly and encouragingly.

**Reference Materials (Context):**
- Strict Formatting Guidelines: `@lesson-author.md`
- Technical Knowledge Base (UART & Zmienne): `@public\docs`
- Previous Lesson: `@content\lekcje\dzien-01\06.01-UART-(komunikacja-z-PC)-zmienne.mdx`

**Content Requirements & Constraints for 06.02:**

1. **Core Focus (Variables & Scope):** 
   - Explain the following data types: `bool`, `byte`, `int`, `long`, `char`, `String`.
   - Explain `float` and explicitly warn about the "integer division trap" (pułapka dzielenia całkowitoliczbowego).
   - Explain the difference between global and local variables (zasięg zmiennych), including best practices on when to choose which.

2. **Syntax & Operations:**
   - Require the use of shorthand operators (`++`, `--`, `+=`, `-=`) in code examples instead of long forms.

3. **UART Integration (Crucial):**
   - The majority of code examples and practical tasks MUST revolve around sending and receiving these variables via UART.
   - Specifically explain and demonstrate receiving numerical data through UART using `Serial.parseInt()`.

4. **Strict No-Duplication:** 
   - Do NOT repeat foundational information already covered in `06.01`. Assume the student has mastered it and build directly upon it.

5. **Pedagogical Quality (Self-Study):** 
   - **Structure:** Highly logical, step-by-step progression suitable for a solo learner.
   - **Engagement (Pobudzający interes):** Use real-world analogies for the data types and why they matter in microcontrollers.
   - **Active Learning (Pobudzający do pracy):** Include hands-on mini-tasks, "try it yourself" challenges, or broken code snippets for the student to fix.

