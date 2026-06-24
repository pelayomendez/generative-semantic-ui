/team Enrich the portfolio's closed dataset, following the spec at .hdd/specs/2026-06-24-portfolio-data-enrichment.md.

CONTEXT: You are an automated loop step inside an open Claude Code session. Prefer to proceed without asking; only stop if truly blocked. Only edit files under `apps/portfolio/lib/data/`. When done (see GIT below), commit just that directory to a branch and open a PR — never commit to `main`.

SOURCES (in priority order):
1. GitHub — run `gh repo list pelayomendez --limit 100 --json name,description,primaryLanguage,repositoryTopics,stargazerCount,pushedAt,url,isFork,isArchived` and use `gh repo view <name> --json ...` / `gh api` for README excerpts. Refresh the `openSource` and `projects` entries: descriptions, tags/topics, years, and add genuinely new repos. Skip forks and archived repos unless they are already featured in the dataset.
2. pelayomendez.dev — WebFetch the site and reconcile `profile`, `recognition`, and the project list against it.
3. LinkedIn — read any files under `apps/portfolio/lib/data/sources/linkedin/`. If none exist (only the README/.gitkeep), SKIP LinkedIn entirely. Do NOT scrape linkedin.com.

RULES:
- Every fact you add or change MUST trace to one of the sources above. Invent nothing; a missing fact stays missing.
- Keep the dataset's existing shape and TypeScript type unchanged, and keep the component vocabulary unchanged. This is data curation only — not a schema, vocabulary, compiler, or adapter change.
- Preserve the hand-written voice in `bio`/`summary` prose. Prefer enriching factual fields (repos, tags, years, recognition, skills) over rewriting prose.
- Run the QA gate before finishing: `npm run typecheck --workspace=portfolio`.

GIT (you handle it — in-app, not CI): if there are changes, create a branch `data-enrichment/<date>`, commit only `apps/portfolio/lib/data/`, push, and open a PR with `gh pr create --base main --assignee @me`. Never commit to `main`.

FINISH by printing a concise report: what changed, grouped by source, and what was skipped (e.g. "LinkedIn: no export found, skipped").
