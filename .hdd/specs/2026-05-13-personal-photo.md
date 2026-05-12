# Spec: Use Pelayo's portrait as the portfolio's personal photo

> status: closed
> created: 2026-05-13
> updated: 2026-05-13 (closed)

## Summary
The portfolio currently uses a placeholder SVG (`/avatar.svg`) as
`profile.avatar` in the closed dataset. Pelayo has shared a real
portrait (a seaside head-and-shoulders shot) and wants to use it as
the personal photo across the portfolio.

The vocabulary already has an `<Avatar src alt? size?>` primitive, and
the dataset already has a `profile.avatar` slot — so this is an
asset + placement decision, not a vocabulary change.

## Why
- Humanises the landing — "a portfolio that builds itself" feels less
  abstract when a face is attached to it.
- Gives the LLM something concrete to render when a visitor asks
  "introduce yourself".
- The current placeholder is a generic SVG; it visibly says
  "unfinished".

## Requested outcome
- Pelayo's portrait lives at `apps/portfolio/public/portrait.jpg`.
- The closed dataset's `profile.avatar` points to `/portrait.jpg`.
- The photo is **only LLM-renderable** — no static chrome in the
  brand bar or landing. It surfaces when the model emits `<Avatar>`.
- The portfolio system prompt nudges the model to lead "introduce
  yourself" answers with `<Avatar src="/portrait.jpg">`.
- The old `apps/portfolio/public/avatar.svg` placeholder is deleted.

## Users affected
- Portfolio visitors (warmer first impression).
- Pelayo (brand alignment with the rest of his sites).

## Functional expectations
- The image file is committed to `apps/portfolio/public/portrait.jpg`
  so it ships with the deploy. No external image host.
- `profile.avatar` in the dataset is updated to `/portrait.jpg` and is
  the single source of truth — both the system prompt and any LLM
  answer reference it from the same value.
- The photo only appears via `<Avatar>` rendered by the LLM. No
  hardcoded `<img>` in the page shell, brand bar, or intro.
- The system prompt is updated so "introduce yourself" answers lead
  with `<Avatar src="/portrait.jpg" alt="...">`.
- Image is appropriately compressed for web (the source is a ~800px
  JPEG, which is already reasonable).
- Alt text is set explicitly so screen readers and SEO have a
  human-readable label.

## Acceptance criteria
- `apps/portfolio/public/portrait.jpg` exists in the repo and ships
  with the deploy.
- `profile.avatar` in the closed dataset equals `/portrait.jpg`.
- Asking "introduce yourself" on the live portfolio renders an
  `<Avatar>` (circle) using that path, near the top of the answer.
- The image renders sharp on retina screens.
- No static `<img>` for the portrait exists in the page shell
  (brand bar, intro, etc.) — the photo is rendered exclusively
  through `<Avatar>` from the LLM.
- `apps/portfolio/public/avatar.svg` is removed.
- `profile.avatar` is the only path that needs updating to point at a
  different image in the future.

## Open questions
1. ~~Where should the photo appear?~~ **Resolved 2026-05-13**:
   LLM-renderable only. No persistent chrome (brand bar, intro).
2. ~~Filename and format for the asset under `public/`?~~ **Resolved
   2026-05-13**: `portrait.jpg`. WebP/AVIF generation deferred —
   trust Next.js image optimisation for now.
3. ~~Treatment.~~ **Resolved 2026-05-13**: circle, the default for
   `<Avatar>`. Size left to the model / per-answer context.
4. ~~System-prompt update.~~ **Resolved 2026-05-13**: yes — add a
   rule that "introduce yourself" answers lead with
   `<Avatar src="/portrait.jpg" alt="...">`.
5. ~~Placeholder cleanup.~~ **Resolved 2026-05-13**: delete
   `apps/portfolio/public/avatar.svg` when the new asset lands.
6. ~~Asset delivery.~~ **Resolved 2026-05-13**: Pelayo will save the
   file to `apps/portfolio/public/portrait.jpg` himself before the
   next /hdd.build iteration. The build iteration will verify the
   file exists before touching the dataset/prompt.

(All defining-stage questions resolved.)

## Functional impact
- portfolio-dataset — `profile.avatar` is updated to `/portrait.jpg`.
- system-prompts — rule added for "introduce yourself" answers.
- portfolio-adapter — verify `<Avatar>` styling looks right with a
  real photo (vs. the previous SVG placeholder); adjust if needed.

(No vocabulary impact — `<Avatar>` already exists.)
(No portfolio-shell impact — no static chrome was added.)

## Plan
Straight execution — all six open questions are resolved at define
time. The JPEG is already on disk at
`apps/portfolio/public/portrait.jpg` (~54 KB).

1. Update `profile.avatar` in `apps/portfolio/lib/data/portfolio.ts`
   from `/avatar.svg` to `/portrait.jpg`.
2. Add a hard rule to the portfolio system prompt in
   `apps/portfolio/app/api/generate/route.ts`: when asked to
   introduce himself, the model leads the answer with
   `<Avatar src="/portrait.jpg" alt="Pelayo Méndez" size="lg">`.
   Inline the path verbatim (no template references).
3. Delete `apps/portfolio/public/avatar.svg`.
4. No adapter changes — existing `<Avatar>` already does circle +
   `object-cover` + ring + shadow.

Out of scope:
- Verifying the deployed Mistral call actually renders the avatar
  (manual visual validation, mirrors the Geist swap).
- Generating WebP/AVIF; trusting Next.js image optimisation.

## Build log
<!-- Appended by /hdd.build after each iteration -->

### 2026-05-13
- Plan: execute the resolved spec — point `profile.avatar` at
  `/portrait.jpg`, add a system-prompt rule that introductions lead
  with `<Avatar src="/portrait.jpg" alt="Pelayo Méndez" size="lg" />`,
  delete the old `avatar.svg` placeholder. No adapter changes.
- Done:
  - Verified `apps/portfolio/public/portrait.jpg` exists (54 KB,
    saved by Pelayo before the build).
  - `apps/portfolio/lib/data/portfolio.ts` — `profile.avatar` changed
    from `/avatar.svg` to `/portrait.jpg`.
  - `apps/portfolio/app/api/generate/route.ts` — added a hard rule
    above the project deep-dive rule: introductions ("introduce
    yourself", "who are you?", "tell me about yourself") must lead
    with `<Avatar src="/portrait.jpg" alt="Pelayo Méndez" size="lg" />`
    inside the outer wrapper, followed by `<Heading>` + bio
    `<Paragraph>`s.
  - Deleted `apps/portfolio/public/avatar.svg`.
- Verified: `tsc --noEmit` clean. Visual validation on the deployed
  site is still pending — confirm the photo actually renders on the
  "Introduce yourself" suggestion chip.

## Closure

### Delivered outcome
Pelayo's portrait is now the portfolio's personal photo, surfaced
only by the LLM when it emits `<Avatar src="/portrait.jpg">` — and
the system prompt guarantees that happens on "introduce yourself"
answers.

#### What was added or changed
- New asset: `apps/portfolio/public/portrait.jpg` (~54 KB, JPEG).
- `apps/portfolio/lib/data/portfolio.ts` — `profile.avatar` updated
  from `/avatar.svg` to `/portrait.jpg`. The dataset is the single
  source of truth for the photo URL.
- `apps/portfolio/app/api/generate/route.ts` — added a hard rule to
  the portfolio system prompt: introductions ("introduce yourself",
  "who are you?", "tell me about yourself") must lead with
  `<Avatar src="/portrait.jpg" alt="Pelayo Méndez" size="lg" />`,
  followed by `<Heading>` and the bio `<Paragraph>`s. Path is inlined
  verbatim, per the existing no-template-references rule.
- Removed: `apps/portfolio/public/avatar.svg` placeholder.

Key technical choices:
- LLM-renderable only — no static `<img>` in the brand bar or
  intro. The photo lives purely inside generated answers, matching
  the portfolio's generative identity.
- Used the existing `<Avatar>` vocabulary primitive (circle, ring,
  shadow) — no adapter changes needed.
- `size="lg"` for introductions (`h-28 w-28`) — large enough to feel
  intentional, small enough not to dominate the answer.
- No WebP/AVIF generation; relying on Next.js image optimisation.

### Deviations from original intent
- None. All six open questions were resolved at define time and the
  build executed them straight.

### Remaining open questions
- None. The "visual validation on deployed site" item from the build
  log is not a spec-level question — it's a deploy-time check the
  user is signing off on by closing.

### References
- Build log entry: 2026-05-13 (execution).
- Related spec: `.hdd/specs/2026-05-13-design-system.md` (also
  touches the portfolio's visual identity, different layer).
