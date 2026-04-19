# Playground

Hosted demo of [Generative Semantic UI](../README.md). Type a prompt, pick an adapter (`shadcn` or `html`), watch the agent's JSX compile into real React.

## Dev

```bash
npm install
npm run build:core && npm run build:html && npm run build:shadcn
npm run dev:playground     # http://localhost:3001
```

Or from inside this folder:

```bash
cd playground
npm run dev
```

## API key

Two modes:

**1. Shared demo key** — set `MISTRAL_API_KEY` as a server env var. Used when the user hasn't entered their own key. Rate-limited to 5 calls/IP/hour in [lib/rate-limit.ts](lib/rate-limit.ts).

**2. BYO key** — user pastes their Mistral key in the UI. Stored in `localStorage`, sent per-request via POST body. No rate limit.

Both paths proxy through [`/api/generate`](app/api/generate/route.ts) so the shared key never ships to the browser.

Get a free Mistral key at [console.mistral.ai](https://console.mistral.ai/).

## Deploy on Vercel

From the repo root:

```bash
vercel link
vercel env add MISTRAL_API_KEY   # paste your demo key
vercel --prod
```

The root [`vercel.json`](../vercel.json) configures the build pipeline (core + adapters + playground) and output dir.

## Stack

- Next.js 15 (App Router, Node runtime for the API route)
- Tailwind v3
- `@generative-semantic-ui/core` + `/html` + `/shadcn` via workspace symlinks, transpiled via `next.config.mjs`
- `@mistralai/mistralai` SDK
