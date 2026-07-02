# Asymmetric grid layout — `span` on a Grid child

- **Status:** delivered
- **Date:** 2026-07-02
- **Domain:** vocabulary (ripples: prompt + all adapters + playground examples + portfolio detail)
- **Driver:** team-goal-loop (morning turn), branch `team-loop/2026-07-02`

## Why
The DSL's `<Grid cols={n}>` only splits a row into equal columns. The
`designs/detail/` project-detail reference wants an asymmetric ~8/4
(prose ↔ meta) split, which the shipped even `cols={2}` only approximates.
This is the smallest vocabulary addition that unblocks that fidelity and
asymmetric bento layouts generally.

## What (in scope)
A direct child of `<Grid>` may carry `span={n}` (1 ≤ n ≤ cols) to occupy
`n` of the grid's columns. Default is `1` (unchanged behaviour). Semantics
are relative to the grid's own `cols`, so `cols={3}` with children
`span={2}` + `span={1}` reads as a ~2:1 (8/4) split while keeping `cols`
in its existing 1–4 range.

Ripple (all updated together):
- `packages/core/src/prompt.ts` — Grid rule documents `span`; one example.
- `packages/adapter-shadcn` / `adapter-html` / portfolio adapter — Grid
  wraps a spanned child in a grid-item that carries a responsive col-span
  (Tailwind `col-span-*` in the class adapters, `gridColumn` inline in
  the HTML adapter).
- `playground/lib/examples.ts` — an example exercises `span`.
- Portfolio project-detail few-shot + route rule — prose↔meta split moves
  to `cols={3}` with the prose cell `span={2}` for a true 8/4.

## How it stays within the grammar
No compiler change. `span={2}` is a numeric-literal attribute, already
accepted by `extractProps`. The prop is inspected by the Grid parent (via
`Children`/`isValidElement`) — child components ignore the unknown prop —
so no per-component ripple is needed. Responsive col-span mirrors the
existing `colsClass` breakpoints (collapses to one column on mobile).

## Out of scope
- Row spanning / a full 12-column bento engine (span is column-only).
- A `weight`/fractional API (kept to integer `span` for now).
- Any change to `compile.ts` or the single-root/literal-only rules.

## Acceptance criteria (observable)
- A `<Grid cols={3}>` with a `span={2}` child and a `span={1}` child
  renders ~2:1 columns on desktop and stacks to one column on mobile,
  in all three adapters.
- `npm run build:packages` and `npm run typecheck --workspace=portfolio`
  pass with no new errors.
- The portfolio "tell me about <project>" detail view renders the
  prose block roughly twice as wide as the meta block.

## Known tradeoff
In the portfolio adapter a spanned child is wrapped in a `motion.div`
that participates in the parent stagger. If that child is itself a
fadeUp primitive with no own animation state (e.g. a bare `<Card>`), it
fades in slightly heavier. The detail-view cells are `<Stack>`s (self-
controlled animation), so they are unaffected.
