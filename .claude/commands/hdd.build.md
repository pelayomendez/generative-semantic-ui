---
description: Evolve a spec — refine intent and build toward the outcome
argument-hint: "<spec name or path> [optional refinement]"
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Bash(git switch:*), Bash(git branch:*), Bash(git rev-parse:*), Bash(mkdir:*), Bash(ls:*)
---

## Command: /hdd.build [spec-path] [optional refinement]

Iterate on an existing spec in `.hdd/specs/`.

### Steps

1. If `.hdd/config.json` exists, read it. Check `models.claude.build` for the configured model. If set, tell the user: "This stage is configured for [model]. Switch with /model if you're using a different one."
2. Read this file and the project's `AGENTS.md` (or `CLAUDE.md` as fallback).
2. If `AUTHOR.md` exists, read it for context.
3. Resolve the spec:
   - If the argument is a full path (e.g. `.hdd/specs/2026-04-01-voting.md`), use it directly.
   - If it's a keyword (e.g. `voting`), glob `.hdd/specs/*` and find files whose name contains the keyword.
   - If one match is found, use it.
   - If multiple matches are found, list them and ask the user which one.
   - If no match is found, tell the user no spec was found with that name.
4. Read the spec.
5. **Present a plan before making changes.** Based on the spec and the refinement (if any), explain in plain language:
   - What you're going to change or build
   - Why (how it connects to the spec's intent)
   - What's out of scope for this iteration
   Wait for the user to approve, adjust, or redirect before proceeding.
6. Once approved, **write the plan to the `## Plan` section** of the spec. This replaces any previous plan — the Plan section always reflects the current iteration's approved plan.
7. Apply changes to the relevant sections:
   - Functional expectations
   - Acceptance criteria
   - Open questions
   - Any section where the refinement applies
8. If no refinement is provided, review the spec and suggest next steps or ask clarifying questions.
9. Do NOT rewrite the entire spec blindly — preserve existing intent.
10. Append a dated entry to the **Build log** section. Each entry must include:
    - The plan that was approved
    - What was actually done
11. Resolve open questions when possible based on the refinement.

### AUTHOR.md support

- Use `AUTHOR.md` as contextual guidance, not as output content
- Adapt communication to the author's profile
- Prioritize `AGENTS.md` for project rules and `AUTHOR.md` for creator preferences

### Rules

- Always preserve the original Summary and Why unless explicitly asked to change them
- Do not include code unless the user asks for it
- Use simple language
- Update metadata: `status: in-progress`, `updated: YYYY-MM-DD`
- Each build iteration must add a Build log entry
- If the spec has no open questions and no refinement is given, suggest closing it

### Build log entry format

```markdown
### YYYY-MM-DD
- Plan: [what was approved]
- Done: [what was actually changed]
```
