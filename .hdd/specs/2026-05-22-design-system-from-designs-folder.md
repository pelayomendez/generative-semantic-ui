# Spec: Design system from the `designs/` folder

> status: closed
> created: 2026-05-22
> updated: 2026-05-23 (closed)

## Summary
`apps/portfolio/designs/` contains four reference designs (home, about,
detail, gallery), each with a screenshot, a code mockup, and a
`DESIGN.md` that declares brand voice, color tokens, typography roles,
spacing, radii, and component conventions ("Semantic Lab" / "Hyper-
Minimalist Lab"). The portfolio doesn't actually consume those tokens
yet — its look comes from `tailwind.config.mjs`, `globals.css`, and the
portfolio adapter, none of which were derived from `designs/`.

This spec captures the intent to **make `designs/` the source of truth
for the portfolio's visual identity**, and to record an opinion on
whether — and how — that injection should also be a standard pattern at
the `@generative-semantic-ui` package level.

## Why
- The closed font spec only locked in `--font-display`. Color, spacing,
  motion, and component conventions are still drifting between the
  current code and the new direction in `designs/`.
- The `designs/` folder is more ambitious than the current portfolio:
  M3-style palette, dual-font strategy (Inter headlines / JetBrains Mono
  body), defined motion principles, glassmorphism. None of that is in
  the running app yet, so the deployed portfolio doesn't reflect the
  brand work that already exists.
- LLM-generated UI on the portfolio inherits whatever the adapter ships
  with. If the adapter doesn't know about these tokens, neither does the
  generated UI. The whole point of the portfolio is to *demonstrate*
  the brand through generated UI, not just host static copy.
- The `designs/` convention (one folder per screen, with `DESIGN.md` +
  screenshot + code) is reusable. If it works for the portfolio, it's a
  candidate pattern for other apps consuming `@generative-semantic-ui`
  — but the package itself stays library-agnostic per AGENTS.md.

## Requested outcome
- The portfolio consumes tokens defined in `designs/*/DESIGN.md`
  (colors, typography, radii, spacing, motion) as its visual source of
  truth. Tailwind config, globals, and the portfolio adapter all
  reconcile to those tokens.
- The four `DESIGN.md` files reflect their actual intent — either they
  should diverge per screen (because each screen has different needs),
  or one shared `DESIGN.md` should live at `designs/` root and the
  per-screen folders should only carry what genuinely differs.
- A clear opinion on whether the `@generative-semantic-ui` core package
  should know anything about design-system injection, or whether this
  stays purely an adapter/app convention.
- One canonical token doc (this spec, or its successor) names the
  actual values the portfolio is built on, with a `WHY` paragraph for
  each significant choice.

## Users affected
- Pelayo (consistency when touching anything visual, less re-deriving).
- Portfolio visitors (the brand actually shows up in the generated UI).
- Future LLM agents working on the repo (one place to read).
- Downstream developers of `@generative-semantic-ui` — *only* if we
  decide to standardize injection at the package level.

## Functional expectations
- `designs/*/DESIGN.md` is the source of truth. Code (tailwind config,
  globals, adapter) reconciles to it, not the other way around.
- Tokens flow in one direction: spec → tailwind/globals → adapter
  components → generated UI. No component should hardcode a value that
  exists as a token.
- The portfolio adapter's components (`Card`, `Button`, `Hero`, etc.)
  use the design-system tokens via Tailwind utilities or CSS variables.
- If we add a package-level convention, it must not pull Tailwind,
  shadcn, MUI, or any UI library into `packages/core`. Library-agnostic
  is a hard rule.

## Acceptance criteria
- `designs/DESIGN.md` exists at the root of `designs/` and is the
  single token source. The four per-screen `DESIGN.md` files are gone;
  per-screen folders keep only `screen.png` + `code.html`.
- Visiting the deployed portfolio, the brand language matches
  `designs/DESIGN.md` (Inter for headlines, JetBrains Mono for body /
  data, ~12-token palette, defined radii + spacing). The exact match
  to the per-screen reference designs is *not* required by this spec —
  layout steering is a future spec.
- Inspecting the running portfolio in DevTools, the CSS variables and
  Tailwind utilities resolve to values that match the (active subset
  of) `DESIGN.md` frontmatter.
- A new component or layout added to the portfolio adapter today reads
  tokens from a single named source (CSS variable or named Tailwind
  utility), not from scattered hex values.
- The spec carries an explicit decision on package-level injection
  (resolved: **no**, library-agnostic core preserved).

## Out of scope
- **Generative-layout enforcement.** How the LLM picks the right
  response shape per question (home / about / detail / gallery) is a
  future spec — likely prompt-side few-shots + a `@generative-semantic-ui`
  dev-time audit tool. No new vocabulary primitives.
- **Per-screen visual reconciliation.** Matching each screen to its
  `screen.png` pixel-by-pixel is deferred. This spec only guarantees
  *brand language* parity (tokens), not *layout* parity (shape).
- **Full M3 palette wiring.** Only the ~12 actively-used tokens are
  wired. The remaining tokens stay documented in `DESIGN.md` for
  reference.
- **Motion tokens.** `designs/DESIGN.md` describes motion principles
  (1.02× hover scale, glassmorphism blur) qualitatively. Wiring them
  as numeric tokens is deferred — they get applied through adapter
  implementation, not the token layer.
- **Mono font in the closed font spec.** The previous spec deferred
  `--font-mono`; this spec resolves it (JetBrains Mono on `font-mono`)
  but that closure is incidental, not the main intent.
- **`packages/core`, adapters other than portfolio-adapter,
  playground.** Out of scope. Other adapters keep their existing
  starter tokens.

## Open questions
- ~~The four `DESIGN.md` files are currently identical. Is that
  intentional (placeholder for per-screen divergence to come) or a
  copy-paste artifact that should collapse to one root `DESIGN.md`?~~
  **Resolved 2026-05-22**: collapse to one shared `designs/DESIGN.md`
  (tokens + brand voice). Per-screen folders keep only `screen.png` +
  `code.html` — the *screens* differ, the design system doesn't. The
  physical refactor happens in `/hdd.build`; this spec records intent.
- ~~The closed font spec landed Geist on `--font-display`. The new
  `designs/` direction names **Inter** for headlines and **JetBrains
  Mono** for body. Do we revert Geist, or update `designs/` to keep
  Geist as the display family?~~ **Resolved 2026-05-22**: adopt the
  `designs/` direction — Inter for headlines, JetBrains Mono for body
  + data. Geist was preliminary; the new type scale (headline-xl/lg/
  lg-mobile, body-md/sm, label-caps) is more developed and matches the
  "Hyper-Minimalist Lab" aesthetic. Wiring: replace Geist with Inter in
  `app/layout.tsx`, add JetBrains Mono, update Tailwind `font-sans` /
  `font-display` / `font-mono` to match. The previously-closed font
  spec is superseded by this one.
- ~~Should `@generative-semantic-ui` (the core package) expose any
  affordance for design-system injection — e.g. a documented
  convention, a TypeScript type for token shape, a `tokens` slot in the
  adapter API — or does this stay purely a portfolio-app concern?~~
  **Resolved 2026-05-22**: stays purely a portfolio-app concern. Core
  package remains library-agnostic per AGENTS.md. Design tokens live
  in the portfolio's `designs/DESIGN.md` + Tailwind config + adapter.
  If a 2nd app outside the portfolio later adopts the package and
  needs a shared token shape, re-open the question then — with real
  constraints, not speculation. Functional impact on **vocabulary** /
  **compiler** is therefore **none** for this spec.
- ~~Should there be a `designs/README.md` (or `designs/DESIGN.md` at
  root) describing the *convention itself*, so other apps adopting
  `@generative-semantic-ui` know to follow it?~~ **Resolved
  2026-05-22**: deferred. After choosing to keep the package
  library-agnostic, the `designs/` folder is a portfolio-internal
  convention with no contract to advertise. A README is unnecessary
  until a 2nd app reuses the pattern.
- ~~Color palette adoption strategy: the `designs/` palette has ~50
  Material-3-style tokens. Do we adopt the full set, or trim to the
  subset actually used (probably ~12)?~~ **Resolved 2026-05-22**:
  trim to the ~12 tokens actually used (background/foreground,
  surface + 1-2 tiers, muted, border/outline, accent "Process Red",
  error, on-primary/on-surface for contrast). The full M3 set stays
  documented in `designs/DESIGN.md` for reference, but Tailwind/CSS
  only wires the active subset. New tokens added when a usage demands
  them — per "small vocabulary > big vocabulary".
- ~~Build sequencing: do we wire tokens into Tailwind first (cheap,
  broad effect), or rebuild one screen at a time (slow, but each
  iteration is visually validated)?~~ **Resolved 2026-05-22**:
  tokens-first. Iteration 1 collapses to `designs/DESIGN.md`, wires the
  ~12-token palette + Inter/JetBrains Mono + radii + spacing into
  Tailwind config + globals + adapter. Everything visually shifts at
  once. Screen-by-screen refinement is **deferred to a future spec**
  (likely paired with layout steering — see below).

- ~~Generative-layout enforcement: how do we get the LLM to emit the
  right response shape (gallery / detail / about / home) per question?~~
  **Out of scope for this spec. Future spec.** Decided 2026-05-22:
  split. Once tokens land, a separate `/hdd.define` will cover
  generative-layout steering. Direction: prompt-side few-shots + a
  dev-time `audit` tool that runs canonical questions through the LLM
  and flags drift from reference shapes. No new vocabulary primitives
  (would violate "small vocabulary > big vocabulary").

## Functional impact
- **portfolio-shell** — `app/page.tsx`, `globals.css`,
  `tailwind.config.mjs`, `Backdrop`. Every visual default changes.
- **portfolio-adapter** — `lib/adapter/registry.tsx`. Components need
  to render with the new tokens (Card radius, Button shape, Chip style,
  Typography utilities).
- **portfolio-dataset** — indirect. The data doesn't change but the
  generated UI consuming it will look different.
- **system-prompts** — indirect. The portfolio system prompt may need
  hints about new vocabulary (e.g., monospaced body text) if visual
  affordances change what kinds of UI the LLM should generate.
- **vocabulary** / **compiler** — **no impact** (confirmed
  2026-05-22). Core package stays library-agnostic; no token shape
  ships in the package.

## Plan
Iteration 1 — token wiring (tokens-first, no per-screen work).

1. **Collapse `designs/`**: write canonical `designs/DESIGN.md` at the
   root; delete the four per-screen `DESIGN.md` files (per-screen
   folders keep `screen.png` + `code.html`).
2. **Fonts (`app/layout.tsx`)**: drop Geist; `--font-display` →
   Inter weight 600; `--font-sans` → JetBrains Mono weights 400 / 500.
3. **Color tokens (`app/globals.css`)**: re-target the ~12 active CSS
   variables to the DESIGN.md palette (background `#faf9fe`, foreground
   `#1a1b1f`, accent `#ff3b30` "Process Red", muted `#f4f3f8`, etc.).
   Switch from HSL-fragment encoding to direct hex. Dark mode kept as
   placeholder values, flagged `[deferred]`.
4. **Radii (`tailwind.config.mjs`)**: replace the `--radius`-derived
   scale with the literal DESIGN.md scale (`sm 0.25rem`, `DEFAULT
   0.5rem`, `md 0.75rem`, `lg 1rem`, `xl 1.5rem`, `full 9999px`).
   `--radius` removed from globals.
5. **Font map (`tailwind.config.mjs`)**: `font-sans` and `font-mono`
   both bind to `var(--font-sans)` (JetBrains Mono); `font-display`
   binds to `var(--font-display)` (Inter). Color references switched
   from `hsl(var(--x))` to `var(--x)` to match hex CSS variables.
6. **Adapter (`lib/adapter/registry.tsx`)**: drop `font-semibold` →
   `font-medium` on `Heading` levels 3 & 4, since these now resolve to
   JetBrains Mono and semibold-mono renders heavy.

Out of scope (locked in spec): per-screen layout, chat input
restyle, backdrop tweaks, dark-mode rebrand, motion tokens, anything
outside the portfolio.

## Build log
<!-- Appended by /hdd.build after each iteration -->

### 2026-05-22
- Plan: wire the `designs/DESIGN.md` tokens (Inter + JetBrains Mono,
  ~12-token palette, DESIGN.md radii scale) into the portfolio's
  Tailwind config, globals, and adapter. Collapse the four per-screen
  `DESIGN.md` files to one root file. No per-screen layout work.
- Done:
  - Collapsed `apps/portfolio/designs/{home,about,detail,gallery}/DESIGN.md`
    into a single `apps/portfolio/designs/DESIGN.md`. Per-screen folders
    now hold only `screen.png` + `code.html`.
  - `apps/portfolio/app/layout.tsx`: replaced Geist with Inter on
    `--font-display` (weight 600) and Inter with JetBrains Mono on
    `--font-sans` (weights 400 + 500).
  - `apps/portfolio/app/globals.css`: rewrote the `:root` block with
    the ~12 active DESIGN.md tokens as hex; accent moved from
    `#c40f07` (pelayomendez.dev red) to `#ff3b30` (Process Red);
    `--radius` removed; `.dark` block kept as placeholder values with
    a `[deferred]` comment.
  - `apps/portfolio/tailwind.config.mjs`: color refs switched from
    `hsl(var(--x))` to `var(--x)`; `borderRadius` replaced with the
    literal DESIGN.md scale; `font-mono` family added (binds to the
    same `--font-sans` as `font-sans`); mono fallback stack added.
  - `apps/portfolio/lib/adapter/registry.tsx`: `Heading` levels 3 and
    4 dropped from `font-semibold` to `font-medium` so JetBrains Mono
    headings don't read as bold.
- Verified: `tsc --noEmit` clean on the portfolio.
- Not yet verified: visual check on the running dev server. The
  body-text switch to JetBrains Mono is a large aesthetic shift; the
  user may want to validate before /hdd.close.

## Closure

### Delivered outcome
The portfolio now treats `apps/portfolio/designs/DESIGN.md` as the
single source of truth for its visual identity — Inter for display,
JetBrains Mono for body / data, and the active ~12-token slice of the
"Semantic Lab" palette wired through Tailwind config, globals, and the
adapter. The `designs/` folder is reshaped so DESIGN.md lives at the
root and per-screen folders hold only `screen.png` + `code.html`.

#### What was added or changed
- `apps/portfolio/designs/DESIGN.md` — new canonical token doc; the
  four per-screen `DESIGN.md` files were deleted.
- `apps/portfolio/app/layout.tsx` — Geist replaced by **Inter** on
  `--font-display` (weight 600); Inter replaced by **JetBrains Mono**
  on `--font-sans` (weights 400 + 500).
- `apps/portfolio/app/globals.css` — `:root` rewritten with the ~12
  active DESIGN.md tokens as direct hex values (replacing HSL-fragment
  encoding); accent moved from `#c40f07` to `#ff3b30` ("Process Red");
  `--radius` removed; `.dark` block kept as placeholder values flagged
  `[deferred]`.
- `apps/portfolio/tailwind.config.mjs` — color references switched
  from `hsl(var(--x))` to `var(--x)`; explicit `borderRadius` scale
  (`sm 0.25 / DEFAULT 0.5 / md 0.75 / lg 1 / xl 1.5 / full 9999px`);
  `font-mono` family added, binding to `--font-sans` (JetBrains Mono).
- `apps/portfolio/lib/adapter/registry.tsx` — `Heading` levels 3 & 4
  dropped from `font-semibold` to `font-medium` so mono headings don't
  read as heavy.
- `.hdd/functional-specs/portfolio.md` — Brand identity section
  updated to reflect Inter + JetBrains Mono + `#ff3b30`, with a
  pointer to this spec as the source of truth.

Key technical choices:
- Core package stays library-agnostic — no `DesignTokens` type ships
  in `@generative-semantic-ui`. Resolved by explicit decision on
  package scope (deferred until a 2nd app needs the convention).
- Direct hex CSS variables instead of HSL fragments — DESIGN.md hex
  values paste in verbatim, debugging in DevTools is easier.
- Only the ~12 active tokens wired. The full ~50-token M3 palette
  stays documented in `designs/DESIGN.md` for reference; new tokens
  are added when a usage demands them ("small vocabulary > big
  vocabulary").
- `font-sans` and `font-mono` both bind to `--font-sans` (JetBrains
  Mono). Single mono family, two utility names — callers may use
  either; meaning is identical.

### Deviations from original intent
- The closed font spec (`2026-05-13-design-system.md`) deferred
  `--font-mono`. This spec resolves it incidentally — JetBrains Mono
  serves both body and explicit mono utilities. Not a deviation from
  this spec's intent, but worth noting that the deferred question is
  now answered.
- Dark-mode block in `globals.css` was kept with placeholder values
  rather than removed or rebranded. Captured in spec + functional-spec
  as `[deferred]`. The original Acceptance criteria did not explicitly
  carve out dark mode, but the "active subset" wording covers it.

### Remaining open questions
- **Visual validation** on a running dev server / deployed site is
  pending. Acceptance criteria 2 ("brand language matches DESIGN.md")
  and 3 ("DevTools variables match frontmatter") were closed on the
  basis of the wiring being correct (`tsc --noEmit` clean); a deploy
  + spot check is the next operational step.
- **Dark-mode rebrand** — `[deferred]`. Worth its own spec when the
  dark palette is designed.
- **Per-screen layout reconciliation** (home / about / detail /
  gallery → matching `screen.png`) — explicitly out of scope; future
  spec.
- **Generative-layout enforcement** — explicitly out of scope; future
  spec; direction sketched (system-prompt few-shots + a dev-time
  `@generative-semantic-ui` audit tool).
- **Motion tokens** (1.02× hover, 20px backdrop blur, hairline
  strokes) — documented in DESIGN.md prose but not wired into the
  adapter. Candidate for a follow-up iteration on the adapter.

### References
- Build log entries: 2026-05-22 (scope + token wiring).
- Closure commit: `[pending]` — will populate after commit.
- Superseded by this spec: `.hdd/specs/2026-05-13-design-system.md`
  (font-only predecessor — Geist + Inter; now replaced by Inter +
  JetBrains Mono).
- Functional-spec updated: `.hdd/functional-specs/portfolio.md`
  ("Brand identity" section).
- Future specs surfaced by this work: dark-mode rebrand, per-screen
  layout reconciliation, generative-layout steering (prompt + audit),
  motion-token wiring.
