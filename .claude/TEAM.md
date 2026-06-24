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

## Scheduled automations (GitHub Actions, branch-and-commit)
Both run `claude -p` headless on `main`, open a **PR for review**, and **never
push to `main` / never deploy** (merging is the human step; Vercel deploys on
merge to `main`).

| Workflow | Cadence | Objective | Output |
|---|---|---|---|
| `.github/workflows/portfolio-data-enrichment.yml` | daily ~05:17 UTC | `.github/agent-objectives/portfolio-data-enrichment.md` | edits `apps/portfolio/lib/data/` → PR |
| `.github/workflows/growth-digest.yml` | weekly Mon ~06:23 UTC | `.github/agent-objectives/growth-digest.md` | drafts under `growth/` → PR |

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
As of **2026-06-24**: files committed on a branch, **NOT yet activated**. To turn on:
1. `gh secret set ANTHROPIC_API_KEY` (both workflows need it).
2. Land these commits on `main` (scheduled crons only fire from the default branch).
3. Smoke-test by hand: `gh workflow run "Portfolio data enrichment"` / `"Growth digest"`.
