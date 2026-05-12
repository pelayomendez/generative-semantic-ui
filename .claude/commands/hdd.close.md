---
description: Finalize a spec and record the outcome
argument-hint: "<spec name or path>"
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Bash(git switch:*), Bash(git branch:*), Bash(git rev-parse:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git status:*)
---

## Command: /hdd.close [spec-path]

Finalize a spec in `.hdd/specs/` and record what was delivered.

### Steps

1. If `.hdd/config.json` exists, read it. Check `models.claude.close` for the configured model. If set, tell the user: "This stage is configured for [model]. Switch with /model if you're using a different one."
2. Read this file and the project's `AGENTS.md` (or `CLAUDE.md` as fallback).
2. Resolve the spec:
   - If the argument is a full path (e.g. `.hdd/specs/2026-04-01-voting.md`), use it directly.
   - If it's a keyword (e.g. `voting`), glob `.hdd/specs/*` and find files whose name contains the keyword.
   - If one match is found, use it.
   - If multiple matches are found, list them and ask the user which one.
   - If no match is found, tell the user no spec was found with that name.
3. Read the spec.
4. Evaluate if the spec is ready to close:
   - Is the requested outcome implemented?
   - Are remaining open questions acceptable or intentionally deferred?
   - Would further changes represent a new feature rather than a refinement?
4. If the spec is NOT clearly ready to close, warn the user:
   "This spec still has open questions or evolving intent. Do you want to close anyway?"
5. If the user confirms (or the spec is ready), fill the **Closure** section.
6. Update metadata: `status: closed`, `updated: YYYY-MM-DD`
7. Ask the user: "Do you want to commit this closure?"
8. If yes:
   - Stage the spec file and any related `.hdd/` files (e.g. functional-specs). Do NOT stage unrelated files.
   - Create a commit with message: `hdd: close <spec-slug>`
   - Show the commit hash to the user.
   - Add the commit hash to the **References** section in the Closure.
9. If the user declines, skip the commit silently.

### Rules

- Do not modify the Summary, Why, or Requested outcome sections
- Do not remove Build log entries
- Use simple, honest language in the closure
- If there are unresolved open questions, list them under "Remaining open questions" in the Closure section

### Git rules

- Never force push or amend existing commits
- Only stage files inside `.hdd/` — never stage unrelated changes
- If the user declines the commit, do not ask again

### Closure template

```markdown
## Closure

### Delivered outcome
[One-sentence summary of what was built]

#### What was added or changed
- [Concrete deliverable: file, feature, config, or behavior — one per bullet]
- [Include key technical choices made (e.g. "Used X instead of Y")]
- [Mention anything removed or cleaned up]

### Deviations from original intent
- [Any differences between what was requested and what was delivered, or "None"]

### Remaining open questions
- [Questions that were not resolved, or "None"]

### References
- [Links to commits, PRs, or related specs]
```
