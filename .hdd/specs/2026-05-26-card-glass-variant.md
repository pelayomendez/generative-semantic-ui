# Spec: Card `glass` variant

> status: defined
> created: 2026-05-26
> updated: 2026-05-26

## Summary
`apps/portfolio/designs/{about,detail}/code.html` use a glass-panel
surface heavily for non-photo content — Tech Stack lists, Current
Focus blocks, supporting media frames, client logo cells, hero-media
overlays. The current `<Card>` is opaque white (correct for
gallery-style project cards) and has no way to express that floating-
overlay feel.

Add an opt-in `variant: "default" | "glass"` prop to `<Card>`. Default
stays as today (opaque, hairline, y-lift hover). `glass` switches the
surface to a semi-transparent white with a heavy backdrop blur,
matching the `glass-panel` / `glass-surface` idiom from the design
HTML. Same hairline border, same prop shape — only the surface
treatment differs.

No new vocabulary primitives; the registry still exports the same 20
components. The LLM picks the variant per response context.

## Why
- About and Detail visually fall apart without the glass surface — they
  rely on it for ~5 different content panels each. Today the LLM has
  no way to emit those surfaces; everything ends up as opaque cards.
- A variant prop is the smallest possible extension. Adapter
  components already support variant props (`<Badge variant>`,
  `<Button variant>`, `<Link external>`), so this is a familiar
  pattern.
- Glass on Cards complements the existing chat-input glass (which is
  shell-only) — the portfolio's "Lab" aesthetic uses glass as a
  signal of "this is a contextual overlay" vs flat surfaces signalling
  "this is a discrete item".

## Requested outcome
- `<Card>` accepts `variant?: "default" | "glass"`, defaulting to
  `"default"`.
- `default` behaviour is unchanged from today's
  card-and-badge-design-alignment closure: opaque `bg-card`, hairline
  border, `y: -4` lift on hover, cover-image support.
- `glass` variant renders the same shape with
  `bg-white/70 backdrop-blur-2xl` instead of `bg-card`. Same hairline
  border. Cover images still work the same way (first-child Image →
  16:9 cover slot).
- System prompt at `apps/portfolio/app/api/generate/route.ts` gains a
  rule explaining when to use `variant="glass"`: about-style content
  panels, supporting-media frames, hero overlays. Default stays for
  project cards / repo cards / gallery contexts.
- `apps/portfolio/lib/few-shots.ts` gets at least one glass example —
  most naturally the about sample (since the design uses glass
  panels there).
- Registry export shape unchanged; vocabulary and compiler untouched.

## Users affected
- Portfolio visitors (about + detail responses render with the right
  surface vocabulary).
- Pelayo (visual fidelity to the designs without bloating vocab).
- Future LLM agents emitting JSX — they get a clean way to express
  "this surface should feel floating" without inventing styles.

## Functional expectations
- `<Card variant="glass">` renders glass; `<Card>` (no variant) and
  `<Card variant="default">` render exactly as today.
- Cover-image detection works for both variants. SVG icons stay
  inline-only per the previous Image/Card spec; that logic is
  variant-agnostic.
- Hover behaviour: open question (see below) — same lift, or scale
  1.02 for glass to match the DESIGN.md prose's "scale rather than
  lift" line.
- No new tokens added. Glass uses `bg-white/70` (literal Tailwind
  utility) + `backdrop-blur-2xl` + the existing `border-hair`.

## Acceptance criteria
- On the deployed portfolio, asking "tell me about yourself" returns
  an answer where at least one `<Card variant="glass">` renders
  visibly as glass (semi-transparent, blurred backdrop).
- Asking "show your work" still returns opaque project cards (no
  regression on `default`).
- `tsc --noEmit` clean.
- Registry export in `lib/adapter/registry.tsx` has the same 20
  components, same names. Only `<Card>`'s prop shape grows by one
  optional field.
- A `<Card variant="glass">` example appears in at least one
  few-shot in `lib/few-shots.ts`.

## Open questions
- ~~**Glass hover model**: same `y: -4` lift as default, or `scale: 1.02`
  for glass only?~~ **Resolved 2026-05-28**: same `y: -4` lift across
  variants. Consistency over per-variant motion language; the LLM
  doesn't have to learn a second rule.
- ~~**Shadow on glass**: shadow-2xl, shadow-md, or none?~~ **Resolved
  2026-05-28**: none. The adapter "no shadows" rule from the closed
  adapter-visual-refresh spec holds; glass surfaces float via blur
  alone.
- ~~**Cover image support in glass**: keep the same first-child
  detection?~~ **Resolved 2026-05-28**: yes — variant-agnostic. The
  design HTML's detail page uses glass-surface frames around images,
  so cover-image semantics need to work for both variants.
- ~~**Default-variant naming**: `"default" | "glass"` or
  `undefined | "glass"`?~~ **Resolved 2026-05-28**:
  `"default" | "glass"` to match the existing `<Badge variant>` /
  `<Button variant>` pattern.
- ~~**Few-shot placement**: where does the glass example land?~~
  **Resolved 2026-05-28**: update `aboutSample` to wrap the bio
  block in `<Card variant="glass">`. The about response is the most
  natural fit per the design HTML; no new sample export needed.
- ~~**Prompt rule precision**: how strict?~~ **Resolved 2026-05-28**:
  specific contexts list — "use `variant="glass"` for bio panels,
  tech-stack lists, focus blocks, hero overlays; default everywhere
  else." Narrow enough to prevent over-use, explicit enough to
  trigger correctly.

## Functional impact
- **portfolio-adapter** — `apps/portfolio/lib/adapter/registry.tsx`
  (Card adds a variant prop, branches on surface class).
- **system-prompts** — `apps/portfolio/app/api/generate/route.ts`
  (one new rule + maybe rephrase of an existing rule).
- **portfolio-shell / dataset / playground / vocabulary / compiler /
  adapter-shadcn / adapter-html** — no impact.

## Out of scope
- **Status pill** (separate /hdd.define candidate).
- **Eyebrow lifted out of Hero** (separate /hdd.define candidate).
- **New tokens** (`--surface-glass` etc.) — use literal Tailwind
  utilities for now.
- **Dark-mode glass** — placeholder block stays; the `--border-
  hairline` already has a dark value, the `bg-white/70` does not.
  Future dark-mode rebrand spec covers it.
- **Glass on the shell chat input** — already lives in `page.tsx`
  from the earlier landing-tune commit. Out of scope here.
- **MediaCard / hero-overlay** — expressible by `<Card variant="glass">`
  with an `<Image>` cover; doesn't need its own variant.

## Plan
<!-- /hdd.build -->

## Build log
<!-- /hdd.build -->

## Closure
<!-- /hdd.close -->
