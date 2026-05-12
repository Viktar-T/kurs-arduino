# claude-agents/

Project-scoped Claude Code subagents (definitions). Two are available:

- `lesson-author.md` — drafts a new Polish MDX lesson.
- `mdx-component-author.md` — writes a new MDX component and wires it in.

## Activation

Claude Code reads subagents from `.claude/agents/`. Copy these files there
after updating their source definitions in `claude-agents/`:

```bash
mkdir -p .claude/agents
cp claude-agents/*.md .claude/agents/
```

PowerShell:

```powershell
New-Item -ItemType Directory -Force .claude\agents
Copy-Item claude-agents\*.md .claude\agents\
```

After copying, restart the Claude Code session so the subagent registry
picks them up. Invoke with the `Task` tool, e.g.:

> Use the **lesson-author** subagent to draft Day 1, Lesson 2 — "Pierwszy
> obwód na płytce stykowej" — sources: Forbot Kurs I #2, Książka B r. 3–4.

> Use the **mdx-component-author** subagent to create a `<Quiz>` component for
> lesson MDX and wire it into `components/mdx/index.ts`.
