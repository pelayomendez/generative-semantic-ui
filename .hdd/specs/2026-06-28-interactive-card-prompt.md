# Spec: Interactive Card → follow-up prompt

> status: closed
> created: 2026-06-28
> updated: 2026-06-28
> delivered: 2026-06-28 — branch `team-loop/2026-06-28`

## Summary
Let a generated `<Card>` (and, uniformly, `<Button>`) carry a literal
prompt string that is sent to the chat when the element is clicked. On
the portfolio this turns generated cards into navigation: clicking a
project card asks a follow-up question ("Tell me about Mugaritz:
OFF-ROAD") and the page renders the generated answer in place.

The mechanism reuses what already exists:
- `onClick="<action>"` — the string action name already supported by
  `<Button>`, now also accepted by `<Card>`.
- `dispatchAction(name, payload)` — already takes a payload; the
  adapters now pass the prompt string as that payload.
- The host registers the action. The portfolio registers `ask` →
  `Page.ask(prompt)`.

No compiler change. No new vocabulary primitive. Two optional props on
existing components, applied uniformly across all adapters.

## Why
- The portfolio is chat-driven but answers are currently dead ends: a
  grid of project cards can't be clicked to drill in. The visitor has
  to re-type a question. Making cards navigational is the single
  biggest interaction win and the whole point of "generative UI that
  talks back".
- `dispatchAction` was built with a `payload?` parameter from day one
  but nothing ever used it. This is exactly the use case it was for —
  no new machinery, just wiring.
- Keeping the contract as `onClick` (action name) + `prompt` (literal
  payload) matches the existing string-action convention and stays
  library-agnostic: the core knows nothing about "ask"; the host
  decides what the action does.

## Requested outcome
- `<Card>` accepts two new optional props:
  - `onClick?: string` — a string action name (same contract as
    `<Button onClick>`). When present, the card is interactive.
  - `prompt?: string` — a literal string passed as the dispatch
    payload.
- `<Button>` gains the same optional `prompt?: string` payload prop
  (it already has `onClick`). Existing buttons without `prompt` are
  unchanged (payload `undefined`).
- On click, adapters call `dispatchAction(onClick, prompt)`.
- A `<Card>` WITHOUT `onClick` renders exactly as today (plain
  container, no cursor/role change) — fully backward compatible.
- A `<Card>` WITH `onClick` is keyboard-accessible: `role="button"`,
  `tabIndex={0}`, Enter/Space activate it, `cursor: pointer`.
- The portfolio registers an `ask` action wired to `Page.ask()`, so a
  clicked card/button sends its `prompt` to the chat and renders the
  answer in place.
- The portfolio system prompt + few-shots emit interactive cards for
  gallery and open-source grids: each project/repo card gets
  `onClick="ask"` and a `prompt` that asks about that specific item
  (using only dataset facts).
- The playground gains one example exercising an interactive Card; the
  playground already auto-registers any `onClick="…"` name and logs
  when fired, so it works with no page change.

## Vocabulary ripple (all updated together)
- `packages/core/src/prompt.ts` — document `onClick`+`prompt` on Card
  and `prompt` on Button; add a rule + an example.
- `packages/adapter-shadcn/src/index.tsx` — Card interactive branch;
  Button passes payload.
- `packages/adapter-html/src/index.tsx` — same.
- `apps/portfolio/lib/adapter/registry.tsx` — same (motion.div).
- `apps/portfolio/app/page.tsx` — register/unregister `ask` action.
- `apps/portfolio/app/api/generate/route.ts` + `lib/few-shots.ts` —
  emit `onClick="ask"` + `prompt` on gallery/repos cards.
- `playground/lib/examples.ts` — one interactive-Card example.

## Out of scope (deliberately)
- No new primitive, no compiler change, no change to `dispatchAction`'s
  signature (already has `payload?`).
- No multi-arg payloads or structured payloads — `prompt` is a single
  literal string only (compiler already forbids non-literal props).
- No nested-click disambiguation beyond the browser default; a `<Link>`
  inside an interactive card still navigates (its own anchor click).
  Authors should avoid putting actionable `<Button>`/`<Link>` inside an
  interactive `<Card>` where ambiguity matters.
- Detail-view editorial layout (a separate backlog goal) is untouched.

## Acceptance criteria (observable)
- Compiling `<Card onClick="ask" prompt="Tell me about X">…</Card>`
  through all three adapters renders a card that, when clicked, calls
  the registered `ask` handler with `"Tell me about X"`.
- A `<Card>` without `onClick` renders identically to before (no
  role/tabindex/cursor).
- On the portfolio, asking "show your work" returns a grid whose cards,
  when clicked, ask the matching follow-up and render the answer.
- `npm run build:packages` passes; `npm run typecheck --workspace=portfolio`
  passes.

## Users affected
- Portfolio visitors (cards become navigation).
- Developers consuming the package (Card/Button gain an optional,
  backward-compatible payload contract).
