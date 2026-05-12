# Spec: Project cards include a cover photo

> status: in-progress
> created: 2026-05-13
> updated: 2026-05-13

## Summary
The "selected work" grid currently produces text-only `<Card>`s
(heading + short paragraph + tag badges). The dataset already has an
`images` array per project — absolute URLs pointing at
`https://www.pelayomendez.dev/img/<id><n>.jpg|png` — so every project
has at least one image available; the cards just don't use it.

This spec adds a cover photo at the top of each project card,
sourced from the existing dataset. No vocabulary changes are needed:
the `<Image src alt?>` primitive already exists in the portfolio
adapter.

## Why
- Text-only project cards feel thin compared to the visual nature of
  the work (lighting, projection mapping, dance pieces, film).
- Visitors get a much faster read of the portfolio when each card
  carries a single representative frame.
- The images are already produced and hosted — no design work
  required, just a wiring decision.

## Requested outcome
- The "selected work" grid renders one cover photo per project,
  full-bleed at the top of each `<Card>`, locked to 16:9.
- The image source is the project's `images[0]`, mirrored locally
  into `apps/portfolio/public/projects/` so the portfolio doesn't
  depend on `pelayomendez.dev` staying up.
- The dataset's `images` URLs are rewritten from the remote
  `pelayomendez.dev` paths to the local `/projects/...` paths.
- Card content order: image → heading → short paragraph → tag
  badges.
- Cards stay visually consistent: the 16:9 lock means every card is
  the same height regardless of source image ratio.

## Users affected
- Portfolio visitors (faster, more honest read of the work).
- Pelayo (showcase feels representative of the actual output).

## Functional expectations
- The "selected work" / "your projects" rule in the portfolio system
  prompt is updated so each `<Card>` leads with an `<Image>` whose
  `src` is the project's local cover path and whose `alt` follows
  the pattern `"<Project name> — <year>"`.
- Image `src` and `alt` are inlined verbatim (per the existing
  no-template-references rule).
- All project cover images are mirrored from
  `https://www.pelayomendez.dev/img/<id>1.<ext>` into
  `apps/portfolio/public/projects/<id>.<ext>`, preserving the source
  file's extension (`.jpg` or `.png`).
- The dataset's `images[0]` for each project is rewritten to the new
  local path. The remaining `images[1..n]` URLs are left untouched
  for now (deep-dive is out of scope).
- The change applies only to the grid view. The project deep-dive
  (which renders the `<Video>` today) is **not** modified.
- The image is rendered full-bleed with a 16:9 aspect ratio. The
  portfolio adapter's `<Image>` (or a new `<Card>`-aware behaviour)
  must support this without an explicit prop — the LLM only emits a
  literal `<Image src alt?>`.

## Acceptance criteria
- Asking "show me your selected work" on the deployed site renders
  a grid where every visible card has a cover photo on top.
- All cover images live under `apps/portfolio/public/projects/` and
  are committed to the repo.
- The dataset's `images[0]` for each project points at the local
  path, not at `pelayomendez.dev`.
- Cards in the grid are visually aligned: every cover is 16:9 and
  full-bleed at the top of the card.
- Images load without console errors (no broken paths, no remote
  fetches in the network tab for the cover row).
- The text content of cards is unchanged from before — heading,
  short paragraph, badges still present, in that order below the
  image.
- Compile is clean: `<Image>` with a literal `src` and `alt`
  validates against the existing compiler rules.

## Open questions
1. ~~Asset delivery.~~ **Resolved 2026-05-13**: mirror locally into
   `apps/portfolio/public/projects/`. Resilience over zero-effort.
2. ~~Which image per project.~~ **Resolved 2026-05-13**: always
   `images[0]`. If a card reads wrong later, that's a follow-up
   spec.
3. ~~Card treatment.~~ **Resolved 2026-05-13**: full-bleed at top of
   card, locked to 16:9. Will need either an adapter tweak to
   `<Image>` (special case when inside `<Card>`) or a small new prop
   on `<Image>` — see open question 6.
4. ~~Alt text.~~ **Resolved 2026-05-13**: derived in the system
   prompt rule as `"<Project name> — <year>"`. No dataset change for
   alt text.
5. ~~Project deep-dive.~~ **Resolved 2026-05-13**: out of scope.
   Grid-only. Deep-dive images become their own spec if/when wanted.
6. ~~How to achieve full-bleed 16:9 in the adapter?~~ **Resolved
   2026-05-13**: Option (a) — adapter-only. The portfolio `<Card>`
   detects a first-child `<Image>` (by component reference) and
   renders it inside a 16:9 wrapper above the padded content area.
   Zero vocabulary ripple. Vocabulary contract for `<Image>` stays
   `Image(src, alt?)`.

## Functional impact
- portfolio-dataset — `images[0]` rewritten to local paths for every
  project. No new fields.
- system-prompts — the "selected work" grid rule grows an `<Image>`
  step with derived alt text.
- portfolio-adapter — `<Image>` (or `<Card>`) updated to render
  full-bleed 16:9 when used as the cover of a card. Open question 6
  picks the exact mechanism.
- portfolio-shell — none.

(Vocabulary impact: only if Option (b) or (c) of open question 6 is
chosen at build time. Option (a) keeps the vocabulary contract
unchanged.)

## Plan
Pick on Open Question #6: **Option (a) — adapter-only**. The
portfolio's `<Card>` detects a first-child `<Image>` and renders it
as a full-bleed 16:9 cover above the padded content area. The LLM
keeps emitting a bare `<Image src alt?>` — zero vocabulary ripple.

Steps:
1. Fetch 15 cover images via `curl` from
   `https://www.pelayomendez.dev/img/<source-name>` into
   `apps/portfolio/public/projects/<id>.<ext>`. Source filenames are
   inconsistent (`apolo1.jpg` vs. `mileni.jpg`), so normalise local
   filenames to the project's `id` field. Preserve the source's
   extension (`.jpg` for all except `alexis` which is `.png`).
2. Rewrite `images[0]` in
   `apps/portfolio/lib/data/portfolio.ts` for each of the 15
   projects to point at the new local path. Leave `images[1..n]`
   pointing at remote URLs (deep-dive is out of scope).
3. Restructure `<Card>` in
   `apps/portfolio/lib/adapter/registry.tsx`: if the first child is
   an `<Image>`, extract it and render inside a
   `aspect-video w-full overflow-hidden` wrapper above the padded
   content area. Image fills via wrapper-scoped CSS overrides.
   Cards without a leading `<Image>` behave exactly as today.
4. Update the "selected work" grid rule in
   `apps/portfolio/app/api/generate/route.ts`: each `<Card>` MUST
   lead with `<Image src="/projects/<id>.<ext>" alt="<name> — <year>">`,
   path inlined verbatim from `projects[i].images[0]`, alt
   composed from the same project.
5. Resolve Q6 in the spec and append the build log.

Out of scope:
- Deep-dive image rendering.
- Vocabulary changes (`<Image>` stays `Image(src, alt?)`).
- Other adapters / playground.

## Build log
<!-- Appended by /hdd.build after each iteration -->

### 2026-05-13
- Plan: pick Option (a) for Q6 (adapter-only, zero vocabulary
  ripple), fetch 15 cover images from `pelayomendez.dev/img/...`
  into `apps/portfolio/public/projects/<id>.<ext>`, rewrite
  `images[0]` in the dataset to local paths, restructure the
  portfolio `<Card>` to render a leading `<Image>` child as a
  full-bleed 16:9 cover, and update the "selected work" grid
  system-prompt rule to emit the `<Image>` first.
- Done:
  - Fetched 15 covers via `curl` from
    `https://www.pelayomendez.dev/img/` into
    `apps/portfolio/public/projects/`. All 200 OK. Total ~2.3 MB.
    Local filenames normalised to `<project.id>.<ext>` (the source
    naming was inconsistent — `apolo1.jpg` vs. `mileni.jpg` vs.
    `singapore.jpg`, etc.). One PNG preserved (`alexis.png`).
  - `apps/portfolio/lib/data/portfolio.ts`: 15 `images[0]` entries
    rewritten from `${PMD}/<source>.<ext>` to
    `/projects/<id>.<ext>`. `images[1..n]` left remote — deep-dive
    is out of scope.
  - `apps/portfolio/lib/adapter/registry.tsx`: `<Card>`
    restructured. Reads `Children.toArray(children)`, checks if the
    first child is an `<Image>` (by component reference). If so,
    extracts it and renders inside a
    `aspect-video w-full overflow-hidden` wrapper above the padded
    content area. Inner img is forced to fill via wrapper-scoped
    CSS (`[&>img]:h-full [&>img]:w-full [&>img]:rounded-none
    [&>img]:object-cover`). Hover overlay moved to `z-10` so it
    stays above the cover. Padding moved from outer to inner
    content wrapper so the cover bleeds to card edges.
  - `apps/portfolio/app/api/generate/route.ts`: rewrote the
    "selected work" grid rule to require an `<Image
    src="/projects/<id>.<ext>" alt="<name> — <year>" />` as the
    first child of each `<Card>`, followed by `<Heading>`,
    `<Paragraph>`, and a `<Row>` of `<Badge>`s.
  - Resolved Q6.
- Verified: `tsc --noEmit` clean. Visual validation pending — ask
  "show me your selected work" on the dev server and confirm every
  card has a sharp 16:9 cover at the top.

## Closure
<!-- Filled by /hdd.close -->
