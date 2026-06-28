# Scheduled tasks manifest

The agent loop's **triggers** live in Claude Desktop's local store
(`~/.claude/scheduled-tasks/<id>/SKILL.md`) — they are **not in git** and don't
travel with a clone. This file is the committed record so they can be recreated
on any machine. The *brains* they invoke (objectives, agents, backlog, rules)
ARE in git; see `.claude/TEAM.md`.

There is no CLI to create these — recreate them via Claude Desktop's scheduler
(the `schedule` skill / Scheduled sidebar). For each task: set the cron (local
time), paste the prompt below (which just points at its committed objective),
and disable completion-pings.

## Tasks (current as of 2026-06-28)

| Task id | Cron (local) | Enabled | Objective it runs | Branch |
|---|---|---|---|---|
| `team-goal-loop` | `10 9 * * *` (09:11) | ✅ | `.github/agent-objectives/team-goal-loop.md` (morning turn) | `team-loop/<date>` |
| `team-goal-loop-night` | `10 16 * * *` (16:10) | ✅ | same objective (PM turn) | `team-loop/<date>-pm` |
| `portfolio-data-enrichment` | `50 10 * * *` (10:54) | ✅ | `.github/agent-objectives/portfolio-data-enrichment.md` | `data-enrichment/<date>` |
| `growth-digest` | `25 15 * * 1` (Mon 15:25) | ✅ | `.github/agent-objectives/growth-digest.md` | `growth-digest/<date>` |
| `pr-responder` | `25 8,13,18 * * *` | ✅ | `.github/agent-objectives/pr-responder.md` | (edits existing PR branches) |
| `scene-builder-merge-requests-review` | `*/30 * * * *` | ⬜ disabled | (different project — not part of this team) | — |

Up to **2 goal-loop turns in flight** (morning + PM); each picks the top backlog
goal not already covered by an open `team-loop/*` PR. See `.claude/TEAM.md`.

## Recreate-prompt template

Each task's stored prompt is intentionally thin — it defers to the committed
objective. To rebuild a task, create a scheduled task with its cron above and
this prompt (swap in the right objective path + turn/branch):

```
Follow .github/agent-objectives/<OBJECTIVE>.md in the generative-semantic-ui
project at <repo path>. Obey its SYNC & CONFLICT SAFETY and CONCURRENCY rules:
git fetch; base work on origin/main; scoped commits; never push main (it's
branch-protected); open a branch + PR assigned to the maintainer; verify the PR
is mergeable. Read .claude/TEAM.md, AGENTS.md, AUTHOR.md first.
```

Disable completion notifications on each (the PR list is the feedback channel).

## Known gaps (from the loop-engineering audit, 2026-06-28)
- **No worktree isolation** — turns share one working dir; rely on distinct
  branches + staggered times + conflict-safety. Tangled-loop risk under the
  2-in-flight setup.
- **No independent AI evaluator** — verification is `build:packages`/`typecheck`
  inside the generating run + Vercel build + human PR review. No adversarial
  reviewer that judges behavior.
- **No token/retry caps** — the Desktop scheduler exposes none; the human merge
  + small-scope + revert-on-gate-fail are the backstops. Keep goals small.
- **Human checkpoint is load-bearing** — branch protection (PR-required,
  enforce-admins) is the real "no". Never weaken it; read each diff.
