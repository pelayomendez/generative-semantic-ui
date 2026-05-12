---
description: Create or redefine intent for a feature
argument-hint: "[Short feature description] [--branch branch-name]"
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Bash(git switch:*), Bash(git branch:*), Bash(git rev-parse:*), Bash(git checkout:*), Bash(mkdir:*), Bash(ls:*)
---

## Command: /hdd.define [short request] [--branch branch-name]

Create or redefine a spec in `.hdd/specs/`. Optionally create or switch to a git branch for the work.

### Steps

1. If `.hdd/config.json` exists, read it. Check `models.claude.define` for the configured model. If set, tell the user: "This stage is configured for [model]. Switch with /model if you're using a different one."
2. Read this file and the project's `AGENTS.md` (or `CLAUDE.md` as fallback). Use the project context, product principles, and functional domains defined there to guide the spec.
2. If `AUTHOR.md` exists in the project root, read it. Use it to understand the creator's role, priorities, communication style, and constraints.
3. If `--branch <name>` is provided:
   - If the branch exists, switch to it.
   - If it doesn't exist, create it from the current branch and switch to it.
4. Ensure `.hdd/specs/` directory exists.
4. If a spec reference is given (path or keyword), resolve it:
   - If it's a full path (e.g. `.hdd/specs/2026-04-01-voting.md`), use it directly.
   - If it's a keyword (e.g. `voting`), glob `.hdd/specs/*` and find files whose name contains the keyword.
   - If one match is found, use it.
   - If multiple matches are found, list them and ask the user which one.
   - If no match is found, treat this as a new spec.
   - If a spec is found, this is a **redefine** — read the existing spec, preserve the Build Log, and update intent sections.
5. If no existing spec is resolved, create a new spec file in `.hdd/specs/`.
6. Write in language suitable for non-technical profiles.
7. Focus on WHAT and WHY, not implementation.
8. Always include open questions if something is unclear.
9. Check whether the request impacts a functional domain listed in `AGENTS.md`.
10. If it does, ensure `.hdd/functional-specs/` exists and propose or update the relevant `<domain>.md` file.
11. After creating the spec, walk through each open question **one at a time** interactively with the user. Ask one question, wait for the answer, then ask the next.
12. After all questions are answered (or the user skips them), update the spec file with the answers.

### AUTHOR.md support

- Use `AUTHOR.md` as contextual guidance, not as output content
- Do not copy the file verbatim into specs
- Adapt the tone, structure, and assumptions of the spec to the author's profile
- Prioritize `AGENTS.md` for project rules and `AUTHOR.md` for creator preferences
- If there is a conflict, `AGENTS.md` wins for product and project decisions

### Rules

- Include all sections from the spec template below
- Do not include code
- Do not include implementation details unless explicitly requested
- Use simple language
- Filename: `YYYY-MM-DD-short-slug.md`
- Ask only one open question per message
- If the user says "skip" or "I don't know", move on without pressing
- On redefine: preserve Build Log and Closure sections, update intent sections

### Spec template

```markdown
# Spec: [Title]

> status: defined
> created: YYYY-MM-DD
> updated: YYYY-MM-DD

## Summary
[Short explanation]

## Why
[Reason this matters]

## Requested outcome
[What should change]

## Users affected
- [user type]

## Functional expectations
- [behavior]

## Acceptance criteria
- [result]

## Open questions
- [question]

## Functional impact
- [none / domain name]

## Plan
<!-- Written by /hdd.build before each iteration -->

## Build log
<!-- Appended by /hdd.build after each iteration -->

## Closure
<!-- Filled by /hdd.close -->
```
