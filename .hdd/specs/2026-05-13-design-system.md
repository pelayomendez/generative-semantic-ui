# Spec: Portfolio design system (token config)

> status: closed
> created: 2026-05-13
> updated: 2026-05-13 (closed)

## Summary
The portfolio's visual identity is currently inferred from scattered
choices in `tailwind.config.mjs`, `globals.css`, and `app/layout.tsx`.
There is no single place that records the design tokens or the reasoning
behind them. This spec is that place: a living record of the **actual
config values** (font families, color tokens, spacing, radii, motion)
the portfolio is built on, and the constraints any future change must
respect.

This iteration only fills in the **font** section. Other token families
are stubbed as `[deferred]` and will be filled by future iterations.

## Why
- New code changes that touch the visual surface keep re-deriving "what
  font/colour/scale are we using again?" from the source.
- Future contributors (or future Pelayo) need a single doc to read
  before changing anything visual.
- The brand should be intentional, not the residue of defaults.

## Requested outcome
- A canonical doc that names the actual tokens the portfolio uses.
- For the **font family**, the display face is non-serif and modern —
  swapping the current Instrument Serif for Geist.
- The doc names where each token is consumed (which file, which class).
- Other token families have a placeholder + a one-line note for what
  the next iteration should resolve.

## Users affected
- Pelayo (consistency when touching anything visual).
- Future contributors / LLM agents working on this repo.
- Indirectly: portfolio visitors (the design itself).

## Functional expectations
- The spec is the source of truth for the tokens listed below. Code
  that contradicts it should be reconciled to match (or the spec
  updated, explicitly).
- Wiring the values into the codebase is a **separate iteration** — this
  spec records intent, not the diff.

## Token config

### Typography

| Role | CSS variable | Tailwind utility | Family | Fallback stack | Weights | Loader |
|---|---|---|---|---|---|---|
| Body | `--font-sans` | `font-sans` | Inter | `ui-sans-serif, system-ui, sans-serif` | variable | `next/font/google` |
| Display | `--font-display` | `font-display` | **Geist** | `ui-sans-serif, system-ui, sans-serif` | `["400"]` (current usage only) | `next/font/google` (will move to `geist` package at closure) |
| Mono | `--font-mono` (not yet defined) | `font-mono` | `[deferred]` | system mono | `[deferred]` | `[deferred]` |

**Display change**: Instrument Serif → Geist. Reason: non-serif and more
modern; matches the developer-tooling / creative-coder positioning.
Tradeoff accepted: the literary warmth the serif provided is lost.

**Loader choice (transitional)**: Geist is loaded via `next/font/google`
in this iteration to avoid adding a dependency before the font has been
visually validated. On `/hdd.close` (assuming validation passes), swap
to the `geist` package for variable axes and the canonical Vercel
distribution. Until then, only weight `400` is loaded — that's the only
weight the `<Intro>` h1 actually uses.

**Where the display family is consumed today**:
- `apps/portfolio/app/page.tsx` — the `<Intro>` h1 (`font-display`).
- Anywhere else that uses the `font-display` Tailwind utility.

**Loader settings** (for both families):
- `subsets: ["latin"]`
- `display: "swap"`
- `variable: "--font-sans"` / `variable: "--font-display"`

### Color
`[deferred]` — next iteration should record: background, foreground,
muted, border, accent (currently `hsl(var(--accent))` with a glow), and
the red used for the error block before the friendly-fallback work.

### Spacing & radii
`[deferred]` — next iteration should record the spacing scale actually
used (Tailwind default vs. customised) and the chat-input + card radii
(`rounded-2xl`, `rounded-3xl`, `rounded-full`).

### Motion
`[deferred]` — next iteration should record the spring / duration
defaults used by Framer Motion across the app (Intro fade-in,
suggestion chips, IncompleteAnswer fade-in, Backdrop).

## Acceptance criteria
- The Typography section names the Geist family, fallback stack,
  weights, loader settings, and the CSS variable + Tailwind utility
  each family is attached to.
- The doc explicitly lists where the display family is consumed.
- Deferred sections are listed with one-line notes, not omitted.
- The spec is reachable from `.hdd/specs/`.

## Open questions
- ~~Should we host Geist via `next/font/google` (zero-config) or
  self-host via `@vercel/geist` / `geist` package?~~ **Resolved
  2026-05-13**: `next/font/google` for now (no new dep until the font
  is validated visually). Switch to the `geist` package at /hdd.close.
- Do we want a `font-mono` token at all? Nothing in the portfolio uses
  monospace today; defining it pre-emptively may violate "small
  vocabulary > big vocabulary". **Still open** — revisit when something
  actually needs monospace.
- ~~For the display weights: do we actually need 400–700, or is a single
  weight enough for current usage (one h1)?~~ **Resolved 2026-05-13**:
  only `400` is loaded. Only the `<Intro>` h1 uses `font-display` and
  it has no weight modifier. More weights added when a usage needs
  them.

## Functional impact
- portfolio-shell (where the display font lands visually)
- Indirectly: portfolio-adapter (if `<Heading>` ever opts into
  `font-display`)

## Plan
Wire Geist into the portfolio per the Typography section. No new
dependency yet — load via `next/font/google` (same channel as Inter).
The `geist` package gets added on /hdd.close, after the font is
visually validated.

1. Replace `Instrument_Serif` import in `apps/portfolio/app/layout.tsx`
   with `Geist` from `next/font/google`. Single weight `"400"` for now
   — only the `<Intro>` h1 consumes `font-display`, and it uses the
   default weight. More weights added when needed.
2. Update the Tailwind `font-display` fallback stack in
   `tailwind.config.mjs`: drop `ui-serif, Georgia`, use
   `ui-sans-serif, system-ui, sans-serif`.
3. Update this spec's Typography section to reflect the actual loader
   choice (`next/font/google`, weight `["400"]`) and add a note that
   the `geist` package replaces this on closure.
4. Resolve the "Google vs. Vercel-hosted" and "how many weights" open
   questions; keep the `--font-mono` question deferred.

Out of scope:
- Color / Spacing / Motion sections.
- Adapter or playground.
- Adding the `geist` package — deferred to /hdd.close.

## Build log
<!-- Appended by /hdd.build after each iteration -->

### 2026-05-13
- Plan: scaffold a design-system spec, fill only the Typography
  section with actual config (Geist replaces Instrument Serif on
  `--font-display`), stub other token families as `[deferred]`. No
  code changes in this iteration.
- Done:
  - Created `.hdd/specs/2026-05-13-design-system.md`.
  - Typography section names Geist for display, Inter for body, with
    fallback stacks, weights (400/500/600/700), `next/font/google`
    loader settings, and the consumption site (`<Intro>` h1).
  - Color / Spacing & radii / Motion stubbed with one-line notes.
  - Three open questions recorded: Google vs. Vercel-hosted Geist,
    whether to define a mono token at all, and whether we actually
    need four display weights.

### 2026-05-13 (2nd iteration)
- Plan: wire Geist into the portfolio. No new dependency yet — load
  via `next/font/google` (same channel as Inter), single weight `400`.
  Defer the `geist` package to /hdd.close, once the font is visually
  validated. Update the spec to match the actual loader choice and
  resolve the relevant open questions.
- Done:
  - `apps/portfolio/app/layout.tsx`: replaced `Instrument_Serif` with
    `Geist` from `next/font/google`. Kept `--font-display` variable,
    weight `"400"`, `display: "swap"`.
  - `apps/portfolio/tailwind.config.mjs`: dropped `ui-serif, Georgia`
    from the `font-display` fallback; now
    `["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"]`.
  - Spec Typography section updated to reflect the transitional
    loader choice (`next/font/google` → `geist` at closure) and the
    `["400"]` weight set.
  - Resolved two open questions: loader = Google for now, weights =
    just `400`. The `--font-mono` question stays open.
- Verified: `tsc --noEmit` clean on the portfolio. Visual validation
  on the deployed site is still pending — the `geist` package swap is
  blocked on that.

## Closure

### Delivered outcome
A canonical design-tokens doc lives at `.hdd/specs/2026-05-13-design-system.md`,
with the Typography section fully filled in: Geist replaces Instrument
Serif on `--font-display`, wired via `next/font/google` and Tailwind's
`font-display` utility.

#### What was added or changed
- New spec file `.hdd/specs/2026-05-13-design-system.md` recording
  actual token config (not just intent).
- `apps/portfolio/app/layout.tsx` — `Instrument_Serif` swapped for
  `Geist` from `next/font/google`, single weight `"400"`,
  `display: "swap"`, bound to `--font-display`.
- `apps/portfolio/tailwind.config.mjs` — `font-display` fallback stack
  changed from `["var(--font-display)", "ui-serif", "Georgia"]` to
  `["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"]`
  so the system fallback stays non-serif if Geist fails to load.
- Color / Spacing & radii / Motion sections stubbed with one-line
  notes so future iterations don't re-scope the spec.

Key technical choices:
- Loaded Geist via `next/font/google` (no new dependency) instead of
  the canonical `geist` npm package. Trades the variable-axes nicety
  for keeping the dep tree small until the choice is fully validated.
- Loaded only weight `400`. The only `font-display` consumer today
  (`<Intro>` h1) has no weight modifier; more weights get added when a
  usage demands them.

### Deviations from original intent
- The original plan resolved the "loader choice" open question with
  "swap to the `geist` package at closure". At closure time the user
  chose **not** to do the swap yet — visual validation on the deployed
  site is still pending. The swap is captured below as a remaining
  open thread rather than a deviation that needs re-spec'ing.

### Remaining open questions
- Swap `next/font/google` Geist for the canonical `geist` npm package
  (variable axes, Vercel-hosted) once the font is visually validated
  on the deployed site.
- Whether `--font-mono` should exist at all — defer until a usage
  needs monospace.
- Color, Spacing & radii, and Motion sections of this spec are still
  `[deferred]` by design. Each is a candidate for its own /hdd.build
  iteration when its tokens actually need to be locked down.

### References
- Build log entries: 2026-05-13 (scaffold) and 2026-05-13 (2nd
  iteration — wiring).
- Related spec: `.hdd/specs/2026-05-12-truncated-jsx-resilience.md`
  (also touches the portfolio shell, not the design tokens).
- Closure commit: `9ec14f9` — `hdd: close design-system`.
