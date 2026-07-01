# Spec: Project detail view — design-reference fidelity

> status: in-progress
> created: 2026-06-30
> updated: 2026-06-30

## Summary
Bring a single-PROJECT detail answer closer to the
`apps/portfolio/designs/detail/` reference. Today a project drill-down is
a flat `<Stack>`: hero video, one paragraph, a row of tags, a role line.
The reference is richer — a hero media block, a title carrying year +
location, a split between summary prose and structured metadata (Role,
**Collaborators**, Tags), supporting images below, and a glassmorphic
frame around the media.

This is a **portfolio-adapter + system-prompt + few-shot** change only.
No core/vocabulary change, no ripple to the other adapters or playground.

## Why
- The project detail is the deepest, most important answer the portfolio
  gives, and it's the one furthest from the agreed design.
- `collaborators` and `images[1..]` already exist in the dataset
  (`portfolio.ts`) but are never rendered — surfacing them is pure upside,
  invents nothing.
- The glassmorphic framing is the signature of the design system
  (`designs/DESIGN.md` → Elevation & Depth) and is currently absent from
  generated media.

## Requested outcome
A single-project detail answer renders, in order, inside a
`<Section title="<name> (<year> · <location>)">`:
1. **Hero media** — the project's OWN `<Video>` (its exact `video` URL)
   or, if it has no video, its OWN `images[0]`. Never another entry's.
2. **Prose ↔ meta split** — a `<Grid cols={2}>` whose left cell is a
   `<Stack>` of the summary prose and whose right cell is a `<Stack>` of
   structured metadata: a **Role** block, a **Collaborators** block
   (outline `<Badge>`s from the entry's `collaborators`), and a **Tags**
   block (`<Badge>`s from `tags`).
3. **Supporting media** — a `<Grid cols={2}>` of the project's remaining
   `images[1..]` (verbatim paths), each rendered with the glassmorphic
   frame.

Adapter behaviour:
- A standalone `<Image>` (photographic, not an `.svg` icon) renders inside
  a glassmorphic frame: a translucent, blurred, hairline-bordered panel
  with a 1px inset (echoing `.glass-surface p-1` in the reference).
- The `<Card>` cover slot is unaffected — covers stay full-bleed with no
  frame (decoupled from `<Image>` styling so the gallery is unchanged).
- `<Heading level={4}>` renders as a small uppercase tracked "label-caps"
  used for the metadata block labels.

## In scope
- `apps/portfolio/lib/few-shots.ts` — rewrite `detailSample`.
- `apps/portfolio/lib/adapter/registry.tsx` — glass-framed standalone
  `<Image>`; decouple `<Card>` cover from `<Image>`; `level={4}` label
  styling.
- `apps/portfolio/app/api/generate/route.ts` — rewrite the SPECIFIC-project
  rule to describe the layout above. Media-isolation hard rules unchanged.

## Out of scope (deliberately deferred)
- **True asymmetric layout.** The reference is an ~8/4 prose↔meta split and
  an asymmetric "bento" of supporting media with varied column spans. The
  current `<Grid>` only does equal columns; real asymmetry needs a
  vocabulary change (a `span`/`weight` capability) and belongs to the
  DSL Specialist as a separate spec. This spec uses an even `cols={2}`
  split — the correct structure, even widths.
- A `glass` variant prop on `<Card>` (separate spec
  `2026-05-26-card-glass-variant.md`).
- Repo / open-source detail views (already correct — text + tags + link).

## Acceptance criteria (observable)
- Asking "tell me about APOLO — Nitsa" renders: hero video, a title with
  "(2018 · Barcelona)", a two-column prose/meta split, a "Collaborators"
  block showing "ProtoPixel", and a grid of the apolo supporting images.
- Supporting images appear inside a translucent blurred frame.
- The "selected work" gallery grid is visually unchanged (covers full-bleed).
- `npm run build:packages` and `npm run typecheck --workspace=portfolio`
  pass clean.
