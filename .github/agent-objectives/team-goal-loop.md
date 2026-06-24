/team Advance the team's goal backlog by exactly one goal.

CONTEXT: You are running NON-INTERACTIVELY in GitHub Actions CI. No human is available — never ask questions; make conservative decisions and proceed. Do NOT `git commit`, `git push`, or create branches — the workflow handles all git. Read `AGENTS.md`, `AUTHOR.md`, and `.claude/TEAM.md` first.

SELECT THE GOAL:
1. Read `.hdd/BACKLOG.md`. The goal is the FIRST unchecked `- [ ]` item in the Queue.
2. If the queue has no unchecked items: run the Product Owner (and `team-growth` if useful) to propose 3 candidate goals, write them into the Queue of `.hdd/BACKLOG.md`, and STOP — make NO code changes this run.

DELIVER THE GOAL via the full `/team` lifecycle:
- Ideation & Scope (PO + Designer), Technical Planning (with DSL Specialist if the core/vocabulary is involved), Implementation (App Developer and/or DSL Specialist), Verification (QA Guard).
- Respect every domain boundary and the vocabulary RIPPLE rule (a vocabulary change must update prompt + all adapters + playground examples together).
- If the goal warrants it, create a proper spec under `.hdd/specs/` during planning.
- Keep the change SMALL and focused on this one goal. No scope creep.

QA GATE (hard): run `npm run build:packages` and, if `apps/portfolio` changed, `npm run typecheck --workspace=portfolio`. If it cannot pass cleanly, REVERT all your edits and STOP rather than leave a broken tree — do not force a half-done goal through.

CLOSE THE LOOP:
- In `.hdd/BACKLOG.md`: move the delivered goal to the Done section, and append the PO's 2–3 next-goal candidates to the Queue.
- If you created/updated a spec, set its status to reflect what was delivered.

FINISH by printing a concise report: which goal you worked, files changed, QA result, and the next goals you queued.
