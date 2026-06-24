# LinkedIn source feed (manual)

LinkedIn can't be scraped reliably (auth/ToS wall), so it's a **manual feed**.

To let the scheduled enrichment job pick up LinkedIn data:

1. On LinkedIn: **Settings → Data privacy → Get a copy of your data** →
   request the archive (or just the profile/positions CSVs).
2. Drop the relevant files (`Profile.csv`, `Positions.csv`, `Skills.csv`, or a
   pasted `.md`/`.txt`) into **this folder**.

The enrichment job reads whatever is here and reconciles it into
`apps/portfolio/lib/data/portfolio.ts`. With nothing here, LinkedIn is skipped.

> Raw export files are **git-ignored** (see root `.gitignore`) — they may
> contain personal data and stay on your machine. Only the curated facts that
> land in `portfolio.ts` get committed. This README and `.gitkeep` are tracked
> so the folder exists in CI.
