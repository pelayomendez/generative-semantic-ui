# Spec: Restore smooth morph between landing and docked input positions

> status: defined
> created: 2026-05-12
> updated: 2026-05-12

## Summary
The chat input used to spring smoothly from page-centre (landing) to
bottom-docked (chat) when the first question landed. That morph was
removed because Framer Motion's `layout` prop fought with Tailwind's
`-translate-x-1/2` and left the input visually right-of-centre after the
animation. The current swap is an instant className change. We want the
spring morph back without the alignment regression.

## Why
The morph is one of the most polished moments on the site — it sells the
"a portfolio that builds itself" promise. Losing it makes the first
interaction feel abrupt.

## Requested outcome
- The input morphs (spring) between the centred landing anchor and the
  bottom-docked anchor when `hasStarted` flips.
- After the morph, the input is correctly horizontally and vertically
  positioned for the new anchor — not drifted left/right.
- Drag continues to work in both states.
- Suggestion chips still hang directly below the input on landing.

## Users affected
- Portfolio visitors (visual polish on first interaction).

## Functional expectations
- On first question, the input slides + springs from centre to bottom.
- The morph is interruptible — typing or dragging during the animation
  does not break.
- On subsequent questions, the input stays docked (no morph back to
  centre).

## Acceptance criteria
- Landing → chat: the input visibly animates from centre to bottom with a
  spring (not a jump cut).
- After the animation, the input's left edge is at viewport-centre minus
  half its width (i.e. truly horizontally centred).
- Dragging the input still works in both states.
- No layout shift or flicker during the morph.

## Open questions
- Should drag offsets be reset when `hasStarted` flips, or preserved?
- Acceptable approach options:
  - (a) Outer non-transform wrapper carries Framer `layout`; inner form
    carries `drag`. Cleanest.
  - (b) Drop `layout`, use Framer's `animate` driving `top`/`bottom`
    numerically with a known viewport height.
  - (c) `layoutId` with two motion forms across an AnimatePresence swap.

## Functional impact
- portfolio-shell

## Plan
<!-- Written by /hdd.build before each iteration -->

## Build log
<!-- Appended by /hdd.build after each iteration -->

## Closure
<!-- Filled by /hdd.close -->
