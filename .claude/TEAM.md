# Agent Team — operating manual

Shared, committed memory for the local agent team. Every team agent should read
this (plus `AGENTS.md` and `AUTHOR.md`) so behaviour is consistent across
sessions and across agents. Subagents don't receive the maintainer's private
cross-session memory — **this file is their shared memory.**

## The team (6 agents + orchestrator)
Orchestrator = the main Claude session, invoked via the `/team` command.
Workers live in `.claude/agents/`:

| Agent | Role | Writes? |
|---|---|---|
| `team-product-owner` | Scope/value guard; defines acceptance criteria; **proposes next goals after a delivered goal** | no (read-only) |
| `team-designer` | Layout/motion blueprint within the DSL vocabulary | no (read-only) |
| `team-app-developer` | Portfolio features — `apps/portfolio` only | yes |
| `team-dsl-specialist` | `packages/core` + adapters; guards the grammar & the ripple rule | yes |
| `team-qa-guard` | Verification gate (typecheck + builds); zero regressions | no (runs cmds) |
| `team-growth` | Researches peer portfolios; drafts social posts (library / HDD / career) | yes (`growth/` only) |

## Lifecycle (`/team <objective>`)
1. **Ideation & Scope** — PO + Designer (parallel, read-only).
2. **Technical Planning** — orchestrator maps files; DSL Specialist confirms grammar fit. Plan presented in plain language before code.
3. **Implementation** — App Developer and/or DSL Specialist.
4. **Verification** — QA Guard. BLOCKED ⇒ route back, re-verify.
5. **Close & next steps** — PO proposes 2–3 next goals across the connected body of work; Growth runs when the objective is positioning/promotion.

## The connected body of work
The **portfolio**, the **generative-semantic-ui** library, and **Honest-DD** are
one story and improve together. PO next-step proposals and Growth drafts span all
three.

## Scheduled automations (LOCAL — macOS launchd, branch-and-commit)
Runs **on Pelayo's machine** via the logged-in Claude CLI — no
`ANTHROPIC_API_KEY`. `scripts/automation/run-team.sh <job>` runs the objective
headless, verifies, and opens a **PR for review**; it never pushes `main` /
never deploys (merging is the human step; Vercel deploys on merge to `main`).
launchd schedules it — see `scripts/automation/README.md`.

| Job (`run-team.sh`) | Cadence (local) | Objective | Output |
|---|---|---|---|
| `goal-loop` | daily 06:41 | `.github/agent-objectives/team-goal-loop.md` | top `.hdd/BACKLOG.md` goal → PR |
| `data-enrichment` | daily 07:17 | `.github/agent-objectives/portfolio-data-enrichment.md` | edits `apps/portfolio/lib/data/` → PR |
| `growth-digest` | weekly Mon 08:23 | `.github/agent-objectives/growth-digest.md` | drafts under `growth/` → PR |

### The goal loop
`team-goal-loop` is the continuous, goal-driven engine. Each run works the **top
unchecked item** in `.hdd/BACKLOG.md`, delivers it via the full lifecycle, and
the PO appends the next candidates. **One goal in flight at a time:** the loop
holds while any `team-loop/*` PR is open — merging/closing it releases the next.
`.hdd/BACKLOG.md` is the steering wheel; edit it to redirect the team.

## Hard rules
- **Never push to `main`.** Pushing `main` deploys. Feature/automation branches + PRs only.
- **Growth is draft-only.** Never post/publish/DM anywhere; no posting credentials.
- **Data enrichment is curation-time, not render-time.** Jobs fetch from GitHub /
  site / LinkedIn export to rewrite the static dataset; the deployed app still
  renders only committed `portfolio.ts` (no live APIs at render).
- **LinkedIn = manual feed.** Read `apps/portfolio/lib/data/sources/linkedin/`;
  if empty, skip. Never scrape linkedin.com.
- **Vocabulary changes ripple** to all adapters + prompt + playground (see AGENTS.md).
- **Mock/closed data only** for the portfolio; invent nothing beyond the dataset.

## Activation state
As of **2026-06-24**: runs **locally via launchd** (no API key — uses the
logged-in Claude CLI). Install/refresh schedules:
`scripts/automation/install-launchd.sh`. Test a job by hand:
`bash scripts/automation/run-team.sh goal-loop`. Remove: `uninstall-launchd.sh`.
The GitHub Actions variants were removed (they required an `ANTHROPIC_API_KEY`).
The Mac must be awake at the scheduled time.
