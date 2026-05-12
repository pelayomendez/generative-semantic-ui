# Spec: Resilience against truncated / malformed JSX from the LLM

> status: in-progress
> created: 2026-05-12
> updated: 2026-05-13

## Summary
Mistral occasionally returns a response that is parseable JSX up to a
point and then truncates mid-string (observed: "Unterminated string
constant. (47:23)" on `<Paragraph>Constrained JSX vocabulary and
compiler that lets language models render real UI — like HTML for`
…cut off). The whole response then fails to compile, and the visitor
sees a red error block instead of an answer.

This happens most often on multi-card grids where the response is long
and the model's token budget is hit before it can finish.

## Why
A single truncated string takes the entire answer down. That's a poor
visitor experience for the most common kind of question ("show me your
projects"), and the user has to retry blind.

## Requested outcome
The portfolio should degrade gracefully when the model returns an
incomplete or malformed response, rather than rendering a wall of source
JSX.

## Users affected
- Portfolio visitors (especially on the suggestion "show me some
  projects").
- Pelayo (debugging visibility).

## Functional expectations
- When the response fails to compile, the page should either:
  - automatically retry once with a tighter system-prompt nudge to keep
    text short and finish cleanly, OR
  - render a friendly fallback ("That answer came back incomplete —
    ask again or try a shorter question") plus, optionally, what was
    successfully parsed up to the failure point.
- The raw error must still be available to Pelayo for debugging (devtools
  / network response), but should not be the visitor-facing surface.
- The server route can take an active role: detect obviously-truncated
  responses (no closing `>`, unterminated string, max_tokens hit) and
  either retry or trim to the last complete root element before sending.

## Acceptance criteria
- A response that throws "Unterminated string constant" no longer renders
  a JSX dump in the UI. It either retries successfully or shows a tidy
  fallback.
- Long, valid responses still render normally — no false-positive
  truncation detection.
- If the model truncates mid-card in a grid, the surviving cards still
  render and the visitor is told something was cut.
- The error reason is logged on the server for debugging.

## Open questions
- ~~Should we just raise `max_tokens` on the Mistral call (cheapest fix)
  before adding retry/recovery logic?~~ **Resolved 2026-05-13**: yes —
  raising `max_tokens` is step 1. Retry/recovery is deferred unless
  step 1 proves insufficient.
- ~~Should the retry happen client-side or in the API route?~~ **Resolved
  2026-05-13**: neither — no auto-retry in this iteration. The visitor
  gets a manual "Try again" button.
- ~~Should the system prompt cap response length to N elements / N words
  per Paragraph?~~ **Resolved 2026-05-13**: yes — added a rule capping
  grid-cell paragraphs to one short sentence (≤140 chars).
- ~~Is server-side truncation-to-last-valid-element worth implementing?~~
  **Resolved 2026-05-13**: no — too brittle (would need a tolerant JSX
  parser). Friendly fallback covers the UX without a second parser.

## Functional impact
- system-prompts
- portfolio-shell (error fallback UI)

## Plan
Layered, cheapest-first. No auto-retry, no partial-tree rendering.

1. **Raise `max_tokens` to 4096** on the Mistral call in the portfolio
   API route. The Mistral default (~1024) is the likely root cause —
   long grids get clipped mid-Paragraph.
2. **Tighten the system prompt**: add a rule capping each `<Paragraph>`
   inside a grid cell to one short sentence (≤140 chars). Reduces the
   chance the model paints itself into a token-budget corner.
3. **Detect truncation server-side**: if Mistral returns
   `finish_reason === "length"` OR a quick balance check on the raw
   text finds an unmatched `<`/quote at EOF, respond with
   `{ jsx, truncated: true, reason }` and log it. The route never
   pretends a clipped response is clean.
4. **Friendly fallback in the UI**: when `compile()` throws OR
   `truncated: true`, replace the JSX source dump with a soft
   "That answer came back incomplete — try again or ask a shorter
   question" + a "Try again" button that re-runs the same prompt.
   Keep the raw error in `console.error` for devtools.

In scope: `apps/portfolio/app/api/generate/route.ts`,
`apps/portfolio/app/page.tsx`.

Out of scope: server-side auto-retry, partial-tree rendering,
streaming.

## Build log
<!-- Appended by /hdd.build after each iteration -->

### 2026-05-13
- Plan: layered, cheapest-first — (1) raise `max_tokens` to 4096,
  (2) add a system-prompt rule capping grid-cell paragraphs to ≤140
  chars, (3) detect truncation server-side via `finishReason === "length"`
  plus a cheap structural check (unclosed `<`, unterminated `"`), and
  return `{ jsx, truncated, reason }`, (4) replace the red JSX dump in
  the UI with a friendly fallback + "Try again" button on either
  `compile()` failure OR `truncated: true`. No auto-retry. No partial-
  tree rendering.
- Done:
  - `apps/portfolio/app/api/generate/route.ts`: set `maxTokens: 4096`,
    added a "grid-cell `<Paragraph>` ≤140 chars" rule to the system
    prompt, added `looksTruncated()` heuristic, route now returns
    `{ jsx, truncated, reason? }` and logs `[generate] truncated response`
    when it fires.
  - `apps/portfolio/app/page.tsx`: `Answer` carries `truncated`; on
    `error || truncated` the page renders a new `IncompleteAnswer`
    component (soft message + "Try again" button that re-runs
    `current.question`); raw compile error + truncation reason still
    go to `console.error` / `console.warn` for devtools.
  - All four open questions resolved (see Open questions section).
- Verified: `tsc --noEmit` clean on `apps/portfolio`. Not yet exercised
  live against Mistral — next time the bug fires in production, confirm
  the friendly fallback is what shows up instead of the JSX dump.

## Closure
<!-- Filled by /hdd.close -->
