# Spec: Card + badge design alignment

> status: in-progress
> created: 2026-05-23
> updated: 2026-05-23

## Summary
The just-closed `adapter-visual-refresh` spec applied DESIGN.md *prose*
to the adapter — glassmorphic Cards, scale-only hover, "no shadows
anywhere". After deploy, the visual gap with `designs/gallery/code.html`
remained large: the reference Cards are **opaque white**, hover with a
**y-lift**, contain an **image that zooms on group hover**, sit on
**p-8 content padding**, and ship badges that are **rounded-lg,
UPPERCASE, tracked, 0.7rem**.

DESIGN.md prose and `designs/{mode}/code.html` source files contradict
each other on these points. This spec resolves the conflict in favour
of the design HTML (the canonical visual artefact) for Card and
Badge, and re-tunes the adapter accordingly.

## Why
- The previous spec shipped the wrong visual direction for Cards
  because I read DESIGN.md prose as the source of truth. The visible
  outcome on the deployed site is "still doesn't look like the
  designs" — feedback that's directly addressable.
- Glassmorphism in DESIGN.md prose was about "modals, floating
  inputs" — the floating chat input in `code.html` *is* glass +
  shadow-2xl. Cards in `code.html` are flat-opaque. I conflated the
  two contexts.
- Re-aligning early matters: the LLM produces Grids of Cards
  constantly (gallery is the most-requested response mode); every
  rendered grid currently misrepresents the brand.

## Requested outcome
- Card: opaque white surface, no glass, no backdrop-blur. Hover = a
  -4px y-lift (matching the design HTML), AND the image inside
  group-zooms to ~scale 1.05 over ~700ms.
- Card content padding default: 32px (`p-8`).
- Card border: stays hairline (`border-hair`) — `code.html` uses an
  equally subtle `border-outline-variant/5`; both read as "barely
  there".
- Badge: `rounded-lg` instead of `rounded-full`, `text-[0.7rem]`,
  `uppercase`, `tracking-wider`. All three variants (default /
  outline / accent) adopt the new shape; only the colour treatment
  differs per variant.
- The contradiction between DESIGN.md prose and the design HTML is
  resolved explicitly in `designs/DESIGN.md` so future iterations
  know which wins.
- No new vocabulary primitives. Registry export unchanged. No new
  tokens added.

## Users affected
- Portfolio visitors (rendered Grids of Cards now match the designed
  gallery shape).
- Pelayo (visual outcome catches up with the visual intent).
- Future LLM agents emitting JSX (no behaviour change at the JSX
  level — `<Card>` and `<Badge>` props are unchanged).

## Functional expectations
- Rendered project Cards on the deployed site visually resemble the
  cards in `designs/gallery/screen.png` to a reasonable approximation
  (opaque white surface, generous padding, lifted hover, image zoom).
- Default `<Card padding={6}>` becomes `<Card padding={8}>` at the
  prop default — callers passing an explicit value still win.
- All three Badge variants keep their respective colour palettes:
  `default` (secondary surface), `outline` (transparent + hairline),
  `accent` (Process Red over `accent/10`). Only shape + typography
  change.
- The Input component (separate concern) is **not** restyled in this
  spec — open question records the decision.

## Acceptance criteria
- Visiting the deployed portfolio after this spec ships, a project
  Card matches the reference: opaque white, hairline border,
  -4px lift on hover, image inside zooms on group hover, p-8 content
  padding.
- Badge variants render as rounded-`md` (or `lg`), uppercase,
  letter-spaced, ~0.7rem text. Pill (`rounded-full`) is gone from
  Badge.
- `designs/DESIGN.md` carries a brief note resolving the
  prose-vs-HTML source-of-truth question (so the next iteration
  doesn't repeat the mistake).
- `apps/portfolio/lib/adapter/registry.tsx` registry export
  unchanged (same 20 components, same prop shapes).
- `tsc --noEmit` clean.

## Open questions
- ~~**Source of truth**: when `designs/DESIGN.md` prose contradicts
  a `designs/{mode}/code.html` reference, which wins?~~ **Resolved
  2026-05-23**: the `code.html` reference wins. Prose is commentary,
  not contract. Future visual specs read `code.html` first, prose
  second. The rule will be recorded as a short note at the top of
  `designs/DESIGN.md` as part of this iteration.
- ~~**Card hover scope**: does the y-lift apply to ALL `<Card>`
  instances, or only when a Card has an Image cover?~~ **Resolved
  2026-05-23**: all Cards lift uniformly. Simpler, predictable.
  Covered and bare Cards behave the same on hover. The
  group-hover image zoom only applies when there's actually a cover
  Image to zoom (free benefit of how the JSX nests).
- ~~**Image hover zoom**: confirm scale 1.05 over 700ms?~~
  **Resolved 2026-05-23**: yes, match the design HTML literally
  (`scale-105` / `duration-700`). The cover Image is a child of Card;
  Framer Motion handles the Card's lift on the parent (`whileHover`
  on `<motion.div>`), and CSS `group-hover:scale-105` on the child
  Image handles the zoom. The two don't conflict because they target
  different elements.
- ~~**Default Card padding**: bump from `6` to `8`?~~ **Resolved
  2026-05-23**: yes, default `padding={8}`. Matches the design HTML.
  Existing callers passing explicit values still win.
- ~~**Default Grid gap**: bump from `4` to `8`?~~ **Resolved
  2026-05-23**: yes, default `gap={8}`. Matches design HTML. The
  gallery few-shot currently emits `gap={6}` — this iteration bumps
  it to `gap={8}` so adapter default and few-shot line up.
- ~~**Adapter `<Input>` revisit**: the previous spec gave Input the
  same glass treatment as Card. With Card going opaque, should
  Input follow?~~ **Resolved 2026-05-23**: match Card — opaque +
  hairline. Visual consistency in the adapter, and a form-inside-a-
  Card would look broken if Input stayed glass while Card went
  opaque. None of the `code.html` files actually show an inline
  form so this is judgment-call territory, but the rule we just
  locked (`code.html` wins) implies treating the visual artefact as
  authoritative, and the visual artefact has no glass inline inputs.
- ~~**Functional-spec update**: do we update the functional-spec
  now to reflect the new reality?~~ **Resolved 2026-05-23**: yes,
  update `.hdd/functional-specs/portfolio.md` in this spec's closure.
  "Glassmorphism on Card" was wrong; the new Visual language sub-
  section should say "Cards are opaque white with hairline borders
  and y-lift hover; glassmorphism is reserved for the floating chat
  input (shell-spec, future)."

## Functional impact
- **portfolio-adapter** — `apps/portfolio/lib/adapter/registry.tsx`
  (Card, Badge primarily; possibly Grid for default gap; possibly
  Input depending on the open question).
- **designs/DESIGN.md** — source-of-truth note added.
- **`.hdd/functional-specs/portfolio.md`** — Visual language
  sub-section reconciled with the new reality.
- **vocabulary / compiler / adapter-shadcn / adapter-html /
  portfolio-shell / portfolio-dataset / playground / system-prompts**
  — no impact.

## Out of scope
- **Reactive backdrop** — still a separate upcoming spec.
- **Chat input restyle** (shell `page.tsx` input, distinct from
  adapter `<Input>`) — shell-spec.
- **About / detail / home design HTML alignment** beyond what
  follows automatically from re-skinned Cards (they appear there
  too).
- **New vocabulary primitives or new tokens.**
- **Restoring shadows broadly.** The chat input wants `shadow-2xl`
  per its design HTML, but that lives in the shell, not the adapter.

## Plan
Iteration 1 — re-align Card + Badge (and the related defaults) to
match `designs/gallery/code.html`.

1. **`apps/portfolio/designs/DESIGN.md`** — prepend a source-of-truth
   note after the frontmatter so the rule ("`code.html` wins over
   prose") is recorded in the canonical doc.
2. **`apps/portfolio/lib/adapter/registry.tsx`** — four targeted
   component edits, no structural changes:
   - **Card**: default `padding={6}` → `{8}`; surface
     `bg-white/70 + backdrop-blur-[20px]` → `bg-card` (opaque white);
     `whileHover: scale: 1.02 → y: -4` (duration 0.2 → 0.3); image
     wrapper gains `[&>img]:transition-transform [&>img]:duration-700
     [&>img]:group-hover:scale-105`.
   - **Badge**: `rounded-full text-xs` →
     `rounded text-[0.7rem] uppercase tracking-wider`. `font-medium`
     kept. All three variants get the new shape; colour treatments
     unchanged.
   - **Grid**: default `gap={4}` → `{8}`.
   - **Input**: surface `bg-white/70 + backdrop-blur-[20px]` →
     `bg-card`; hairline border and focus ring untouched.
3. **`apps/portfolio/lib/few-shots.ts`** — `gallerySample` Grid
   `gap={6}` → `gap={8}` to match the new default.
4. **`tsc --noEmit`** clean.

Out of scope: about / detail / home design HTML alignment beyond
what cascades from Card + Badge restyling; chat-input shell restyle;
reactive backdrop; new tokens or vocabulary.

## Build log
<!-- /hdd.build -->

### 2026-05-23
- Plan: re-align Card + Badge + Grid + Input to match the actual
  visual artefact in `designs/gallery/code.html`. Record the
  source-of-truth rule (`code.html` wins over prose) at the top of
  `designs/DESIGN.md`. Bump Card default padding 6→8 and Grid
  default gap 4→8 so adapter defaults line up with the design HTML.
- Done:
  - `apps/portfolio/designs/DESIGN.md`: prepended a "Source of
    truth" blockquote immediately after the frontmatter.
  - `apps/portfolio/lib/adapter/registry.tsx`:
    - `Card`: `padding` default 6→8; surface from glass
      (`bg-white/70 + backdrop-blur-[20px]`) to opaque `bg-card`;
      hover from `scale: 1.02` over 0.2s to `y: -4` over 0.3s;
      image wrapper gains
      `[&>img]:transition-transform [&>img]:duration-700
      [&>img]:group-hover:scale-105` so the cover Image zooms 5%
      on group hover over 700ms.
    - `Badge`: container class swapped from `rounded-full text-xs
      font-medium` to `rounded text-[0.7rem] font-medium uppercase
      tracking-wider`. All three variants inherit the new shape; the
      colour treatments (`bg-secondary` / hairline outline /
      `bg-accent/10`) are unchanged.
    - `Grid`: `gap` default 4→8.
    - `Input`: dropped `backdrop-blur-[20px]`; surface from
      `bg-white/70` to opaque `bg-card`; hairline border, focus ring
      untouched.
  - `apps/portfolio/lib/few-shots.ts`: `gallerySample` Grid
    `gap={6}` → `gap={8}`. The few-shot now matches the adapter's
    new Grid default.
- Verified: `tsc --noEmit` clean on the portfolio.
- Not yet verified: visual check on the deployed site. Cards should
  now read as opaque white with hairline borders, lift on hover,
  and the image inside zoom subtly. Badges become small-caps tags
  with letter-spacing.

## Closure
<!-- /hdd.close -->
