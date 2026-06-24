/team Advance the team's goal backlog by exactly one goal.

CONTEXT: You are an automated loop step inside an open Claude Code session. Prefer to proceed without asking — only stop to ask if truly blocked. Read `AGENTS.md`, `AUTHOR.md`, and `.claude/TEAM.md` first.

HOLD CHECK (do this first): if a `team-loop/*` PR is already open (`gh pr list --state open`), STOP immediately and do nothing — a goal is awaiting review. Only proceed when none is open.

SELECT THE GOAL:
1. Read `.hdd/BACKLOG.md`. The goal is the FIRST unchecked `- [ ]` item in the Queue.
2. If the queue has no unchecked items: run the Product Owner (and `team-growth` if useful) to propose 3 candidate goals, write them into the Queue, then go straight to GIT to open a PR with just that backlog change.

DELIVER THE GOAL via the full `/team` lifecycle:
- Ideation & Scope (PO + Designer), Technical Planning (with DSL Specialist if the core/vocabulary is involved), Implementation (App Developer and/or DSL Specialist), Verification (QA Guard).
- Respect every domain boundary and the vocabulary RIPPLE rule (a vocabulary change must update prompt + all adapters + playground examples together).
- If the goal warrants it, create a proper spec under `.hdd/specs/` during planning.
- Keep the change SMALL and focused on this one goal. No scope creep.

QA GATE (hard): run `npm run build:packages` and, if `apps/portfolio` changed, `npm run typecheck --workspace=portfolio`. If it cannot pass cleanly, revert this run's edits and STOP rather than leave a broken tree.

CLOSE THE LOOP:
- In `.hdd/BACKLOG.md`: move the delivered goal to the Done section, and append the PO's 2–3 next-goal candidates to the Queue.
- If you created/updated a spec, set its status to reflect what was delivered.

GIT (you handle it — this is in-app, not CI): create a branch `team-loop/<today's date>`, commit your changes (NEVER commit to `main`), push, and open a PR with `gh pr create --base main --assignee @me`. The next loop round holds until this PR is merged or closed.

FINISH by printing a concise report: which goal you worked, files changed, QA result, the PR link, and the next goals you queued.
