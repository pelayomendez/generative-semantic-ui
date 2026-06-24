# Project Context

## Why
Language models can write code, but they can't *render UI* without a host
framework picking up the slack — or without going wild with arbitrary JSX
that's unsafe to run. This project gives them a constrained JSX vocabulary
and a compiler that turns LLM output into real React elements, safely.

The contract is small on purpose: a fixed list of semantic components, no
arbitrary expressions in children, exactly one root. The output is portable
across UI libraries via adapters.

## What
A TypeScript monorepo:

- `packages/core` — the contract: prompt rules, types, and the `compile()`
  function that parses LLM-emitted JSX into a React tree.
- `packages/adapter-shadcn` — default styled adapter (Tailwind + shadcn
  primitives). What new users see first.
- `packages/adapter-html` — zero-CSS adapter with inline styles. Fallback
  for hosts without a design system.
- `playground/` — public Next.js demo at `generative-semantic-ui.vercel.app`.
  Compares adapters side-by-side, exercises every vocabulary primitive.
- `apps/portfolio/` — Pelayo's portfolio at `pelayomendez-portfolio.vercel.app`.
  Chat-driven, generative, runs on its own custom adapter (Framer Motion +
  bespoke styling). Both the canonical showcase and the brand site.

Users:
- developers building LLM-driven UIs (consume the package)
- Pelayo's portfolio visitors (consume the deployed site)

## Product principles
- **Small vocabulary > big vocabulary.** Every new primitive must justify
  its existence with a use case the existing set can't express cleanly.
- **Semantic, not visual.** Names describe intent (`Card`, `Hero`,
  `Section`), never pixels (`BlueBox`, `LargeButton`).
- **Library-agnostic core.** The compiler doesn't know about Tailwind,
  shadcn, MUI, or Framer. Adapters do.
- **Strict by default.** Single root, no `import`s, no fragments, no
  expressions in children (literals only). Compile errors surface to the
  user rather than getting hidden.
- **Apps own their adapter.** The shadcn adapter is a starting point;
  serious apps (like `apps/portfolio`) ship their own.
- **No surprise refactors.** Don't expand scope past the request. Surface
  tradeoffs first, then act on the user's choice.

## Functional domains
Stable areas of the product. Changes that touch any of these usually need
a spec — and often need to ripple to ALL the others:

- **vocabulary** — the list of components an LLM may emit. Source of
  truth: `packages/core/src/prompt.ts` (the `DEFAULT_PROMPT_RULES` string).
- **compiler** — `packages/core/src/compile.ts`. Babel-based JSX parser
  that resolves tag names against the registry and rejects unsafe nodes.
- **adapter-shadcn** — `packages/adapter-shadcn/src/index.tsx`. Component
  implementations + the `registry` export.
- **adapter-html** — `packages/adapter-html/src/index.tsx`. Inline-style
  parity implementation.
- **portfolio-adapter** — `apps/portfolio/lib/adapter/registry.tsx`.
  Framer-Motion-powered, brand-specific. Anything visual on the portfolio
  starts here.
- **portfolio-dataset** — `apps/portfolio/lib/data/portfolio.ts`. The
  closed dataset the LLM is allowed to render. Never invent beyond it.
- **portfolio-shell** — `apps/portfolio/app/page.tsx` + globals + Backdrop.
  The chat UI, the input behaviour, the canvas backdrop.
- **system-prompts** — `packages/core/src/prompt.ts` (shared rules) AND
  `apps/portfolio/app/api/generate/route.ts` (portfolio-specific system
  prompt with dataset injection). Both feed Mistral.
- **playground-examples** — `playground/lib/examples.ts`. Pre-baked outputs
  so the page works without an API key. Must compile cleanly through both
  registered adapters.

## Functional restrictions
- **TypeScript everywhere.** No JS in source files.
- **Next.js 15** for both apps.
- **npm workspaces.** No yarn/pnpm/bun.
- **No new dependencies** without justification. The portfolio's animated
  backdrop is hand-rolled Canvas 2D for that reason.
- **Vocabulary changes ripple.** Adding/removing a component means: prompt
  rules, shadcn adapter, html adapter, portfolio adapter, playground
  examples — all updated together.
- **LLM provider: Mistral** (`mistral-small-latest`). Single source of
  truth. Rate-limited on the portfolio's deployed key (12/hour per IP).
- **No `import`/fragments/expressions** in generated JSX. The compiler
  rejects them; never weaken the parser.
- **Deploy is Git → Vercel.** Two Vercel projects (`generative-semantic-ui`
  for the playground, `pelayomendez-portfolio` for the portfolio), both
  auto-deploying from `main`. Pushing IS deploying.
- **Never commit or push without explicit authorization.** Pushes are
  deploys. Always wait for "publish" or equivalent before `git push`.

## Agent team
A local Orchestrator–Worker agent team operates this repo (invoked via the
`/team` command, with two scheduled GitHub Actions). Its agents, lifecycle,
scheduled automations, and hard rules are documented in `.claude/TEAM.md` —
**read it before acting as part of the team.**
