# claude-agents/

Project-scoped Claude Code subagents (definitions). Two are available:

- `lesson-author.md` — drafts a new Polish MDX lesson.
- `mdx-component-author.md` — writes a new MDX component and wires it in.

## Activation

Claude Code reads subagents from `.claude/agents/`. Move (or symlink) these
files there once `.claude/` exists in this repo:

```bash
mkdir -p .claude/agents
cp claude-agents/lesson-author.md       .claude/agents/
cp claude-agents/mdx-component-author.md .claude/agents/
```

After copying, restart the Claude Code session so the subagent registry
picks them up. Invoke with the `Task` tool, e.g.:

> Use the **lesson-author** subagent to draft Day 1, Lesson 2 — "Pierwszy
> obwód na płytce stykowej" — sources: Forbot Kurs I #2, Książka B r. 3–4.
