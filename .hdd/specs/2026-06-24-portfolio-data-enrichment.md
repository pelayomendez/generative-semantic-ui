# Spec: Portfolio data enrichment

> status: defined
> created: 2026-06-24
> updated: 2026-06-24

## Summary
Keep the portfolio's closed dataset (`apps/portfolio/lib/data/portfolio.ts`)
rich, accurate and current by periodically curating it from real sources:
relevant **GitHub** repositories, the **pelayomendez.dev** site (and any
older site URL provided), and **LinkedIn**. This is the standing objective
of the scheduled agent team, run in branch-and-commit mode.

Curation happens **offline, at job time** — it fetches from sources and
rewrites the static dataset. The deployed portfolio still renders only the
committed `portfolio.ts`; nothing hits a live API at render time. This is the
explicit reconciliation of the data-enrichment goal with the QA Guard rule
"never hit live GitHub/LinkedIn APIs during render."

## Why
- The dataset is hand-maintained and drifts: new repos, updated repo
  descriptions/topics/stars, new roles, new projects. A hiring manager should
  see current work, not a stale snapshot.
- GitHub is reliably machine-readable via the `gh` CLI / API — it should be
  the spine of the enrichment.
- The richer the dataset, the better every generative response, since the LLM
  may only surface facts that appear in it.

## Sources & access reality
- **GitHub** (`pelayomendez`) — reliable. Use `gh repo list pelayomendez`,
  `gh api` for descriptions, topics, primary language, stars, README excerpts,
  pushedAt. The spine of each enrichment run.
- **pelayomendez.dev** (+ any older site URL the user supplies) — public,
  fetchable. Cross-check project list, headline, recognition.
- **LinkedIn** (`/in/pelayomendez/`) — NOT reliably fetchable: auth/ToS wall,
  scraping is brittle and discouraged. Treated as **manual-feed only**: the
  user drops a LinkedIn "Download your data" export (or pasted text) into
  `apps/portfolio/lib/data/sources/linkedin/` and the job reads from there. A
  run with no export simply skips LinkedIn rather than scraping.

## Requested outcome
- A scheduled run enriches `portfolio.ts` from GitHub + site (+ LinkedIn export
  if present), producing a reviewable diff on a fresh branch — never pushed to
  `main`, never auto-deployed.
- Every added/changed fact traces to a real source. No invented data; the
  closed-dataset contract holds.
- The dataset's shape and the 20-component vocabulary are unchanged — this is
  data curation, not a vocabulary or schema change.
- The run reports: what changed, from which source, and what it skipped (e.g.
  "LinkedIn: no export found, skipped").

## In scope
- Adding/updating repos in `openSource` + `projects` from GitHub.
- Refreshing repo descriptions, tags/topics, years from GitHub metadata.
- Reconciling `profile`, `experience`, `recognition`, `skills` against the
  site and (if present) the LinkedIn export.
- A `sources/` convention for manual feeds (LinkedIn export).

## Out of scope (deliberately)
- Live API calls at portfolio render/build time — render stays on static data.
- Automated LinkedIn scraping — manual export only.
- Any change to the DSL vocabulary, compiler, adapters, or dataset *type*.
- Auto-merging or pushing — output is a branch/PR for human review.
- Inventing facts to fill gaps — a missing fact stays missing.

## Acceptance criteria (observable)
- Running the enrichment objective on a clean tree yields a branch whose only
  changes are within `apps/portfolio/lib/data/` and leaves `main` untouched.
- `npm run typecheck --workspace=portfolio` and `npm run build:portfolio` pass
  on the branch (QA gate).
- Each changed fact in the diff is attributable to GitHub or the site or the
  LinkedIn export — verifiable from the run's report.
- With no LinkedIn export present, the run completes and reports LinkedIn as
  skipped (does not fail, does not scrape).
