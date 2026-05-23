# Spec: Adapter visual refresh

> status: closed
> created: 2026-05-23
> updated: 2026-05-23 (closed)

## Summary
Tokens are wired (closed design-system spec) and prompt steering is in
place (closed generative-layout-steering spec). What's still missing is
the *visual language* the tokens were chosen to express. The portfolio
adapter components still render in a generic "modern card" style:
`bg-card/60`, `shadow-sm`, solid grey borders, `y: -2` hover lift,
accent on Link hover. `designs/DESIGN.md` prose calls for something
quite different — heavy glassmorphism, 1px hairline outlines at 5%
black, no shadows, 1.02× hover scale, accent reserved for status
indicators only.

This spec applies the DESIGN.md visual principles to the existing
adapter components. Same vocabulary, same registry shape — only the
internal CSS / motion behaviour changes.

## Why
- A glass card with the new palette looks subtly but materially
  different from a shadow card with the same palette. The token spec
  picked the colours; this spec puts them in the container they were
  picked for.
- Each visual misalignment compounds when generated UI fills the page
  (a grid of cards, a row of badges, a hero + section + section).
- This is the smallest move that visibly closes the gap between
  "rendered chat output" and "the design references". Shell refresh
  (backdrop, chat input) and per-screen reconciliation are layered on
  top of this.

## Requested outcome
- The portfolio adapter components match DESIGN.md visual principles:
  - **Glassmorphism** on floating surfaces (Card, Input):
    `rgba(255,255,255,0.7)` background, ~20px backdrop blur, 1px
    hairline outline at 5% black, **no shadows**.
  - **Hover**: 1.02× scale, no y-lift, no shadow change.
  - **Hairline borders** replace solid grey borders where used
    decoratively (Card outline, Divider, List separators).
  - **Accent restricted to status / badge-accent only**: Link hover
    and Button rings stop using accent; they use foreground colours.
  - The "breath" principle (DESIGN.md: 128px between top-level
    sections) becomes the default for top-level `<Stack>` / `<Section>`
    when callers don't specify `gap`.
- No new vocabulary primitives. Registry exports the same 20
  components.
- No new tokens added to the active set — visual changes use existing
  CSS variables + Tailwind utility classes.

## Users affected
- Portfolio visitors (rendered chat output looks closer to the
  designs).
- Pelayo (closer to the visual goal in DESIGN.md without touching the
  shell or the chat behaviour).
- Future LLM agents emitting JSX through this adapter (no behaviour
  change at the JSX level — same props, same vocabulary).

## Functional expectations
- Card renders as a glass surface (semi-transparent white, 20px
  backdrop blur, hairline border at 5% black), no `shadow-*` class.
- Card hover applies `scale: 1.02` only — no `y: -2` translate, no
  shadow.
- Input retains pill shape; gets heavier glass (matching Card's
  treatment).
- Link hover changes the *underline* and foreground tone, not the
  text colour to accent.
- Button "default" variant keeps `bg-primary`; its hover stops adding
  accent ring / glow.
- Badge `accent` variant keeps the accent colour — that's the
  surviving accent usage in the adapter.
- Divider, List separators: rendered with hairline (5% black) instead
  of `border-border/60`.
- Section title's typography is honoured per the new tokens — no
  weight / size change in this spec.

## Acceptance criteria
- Visiting the deployed portfolio, a project Card renders with
  visible glassmorphism (not the current subtle `backdrop-blur-sm`).
  Hover scales to 1.02× without lifting.
- No `shadow-*` Tailwind class remains anywhere in
  `apps/portfolio/lib/adapter/registry.tsx`.
- Accent colour usage in the adapter is restricted to
  `<Badge variant="accent">` and the `--ring` token (if any caller
  still wants a ring) — Link hover no longer turns accent.
- `packages/core/src/prompt.ts` is unchanged.
- The registry export in `apps/portfolio/lib/adapter/registry.tsx`
  lists the same 20 components, same names, same prop shapes.
- `.hdd/functional-specs/portfolio.md` Brand identity section
  reflects the visual rules now in code (glass, hairline, scale-hover,
  accent for status).

## Open questions
- ~~**Hover model**: 1.02× scale only (DESIGN.md literal), or 1.02×
  scale + retain a subtle lift?~~ **Resolved 2026-05-23**: 1.02×
  scale only. No lift, no border change. Matches DESIGN.md literal
  ("rather than lifting with a shadow") and reinforces the flat-lab
  aesthetic. Accepts that the affordance feels slightly lighter than
  the current lift.
- ~~**Hairline border**: hardcode `border-black/5` everywhere, or
  introduce a new `--border-hairline` CSS variable so the rule lives
  in `globals.css`?~~ **Resolved 2026-05-23**: new
  `--border-hairline` CSS variable. Default `rgba(0,0,0,0.05)` in
  `:root`; dark-mode value `rgba(255,255,255,0.05)` in `.dark`
  placeholder. Components reference it via a Tailwind arbitrary value
  (`border-[var(--border-hairline)]`) or, if it's worth the cycle, a
  named Tailwind colour in `tailwind.config.mjs` (e.g. `border-hair`).
  Matches the hex-CSS-var pattern from the token spec.
- ~~**128px section gap default**: enforce as the default in
  `<Section>` / top-level `<Stack>`, or leave callers responsible for
  passing `gap={32}` (32 × 4px = 128px) on a case-by-case basis?~~
  **Resolved 2026-05-23**: leave it to the caller. Section / Stack
  defaults are untouched. The LLM (steered by the existing prose +
  few-shots) decides when "breath" applies. Smaller change, no
  surprise compaction regressions. The few-shots can be tuned later
  if responses look cramped.
- ~~**Process Red dot pattern**: DESIGN.md describes a 8px pulsating
  circle for "Live / Processing" status.~~ **Resolved 2026-05-23**:
  defer to a future spec. The portfolio rarely needs a "live"
  indicator today; reach for it when a real use case appears.
- ~~**Dark-mode visual rules**: do we apply the same glass / hairline
  / no-shadow rules to dark mode placeholders?~~ **Resolved
  2026-05-23**: skip. Dark mode stays as the existing placeholder
  block from the token spec, still flagged `[deferred]`. Picking
  dark-appropriate visual values now would either get overridden by
  the dark-mode rebrand spec or lock in choices that haven't been
  designed. The `--border-hairline` CSS variable does still need
  *some* dark value in `.dark` (so the variable resolves); use
  `rgba(255,255,255,0.05)` as a sensible placeholder.

### Scope decision (resolved upfront)
- ~~**Bundle vs split** with the reactive backdrop?~~ **Resolved
  2026-05-23**: split. This spec ships the adapter restyle only; the
  reactive backdrop ("organic effect that reacts to different
  screens") is the next `/hdd.define`. Reasoning: backdrop work is
  open-ended (organic style, signal routing, implementation) and
  would block the cheap, fast adapter ship.

## Functional impact
- **portfolio-adapter** — `apps/portfolio/lib/adapter/registry.tsx`
  (primary and only file touched).
- **portfolio-shell** — no impact in this spec. The reactive-backdrop
  spec (next) will own shell-level work.
- **vocabulary / compiler / adapter-shadcn / adapter-html /
  portfolio-dataset / playground / system-prompts** — no impact.

## Out of scope
- **Reactive backdrop** ("organic effect that reacts to different
  screens"). Promoted to its own next spec. Includes: organic style
  choice (flow field / gradient blobs / etc.), what "reacts" means
  per mode (palette / motion / full swap), signal routing from page
  to backdrop, implementation (canvas / WebGL / CSS).
- **Chat input restyle** (the input in `page.tsx`, distinct from the
  adapter's `<Input>`). Shell-spec, future.
- **Per-screen reconciliation** (matching `screen.png` exactly). Its
  own future spec, downstream of this one.
- **New vocabulary primitives** (`<StatusDot>`, `<GalleryView>`, etc.).
  Out per AGENTS.md "small vocabulary > big vocabulary".
- **New tokens** added to the active set in `globals.css`. The visual
  changes use existing tokens + Tailwind utilities, optionally a
  single hairline-border CSS variable (open question above).
- **Dark mode rebrand** — separate future spec.
- **Audit tool** — separate future spec.

## Plan
Iteration 1 — apply DESIGN.md visual principles to the existing
adapter components. No new vocabulary, no new tokens beyond a single
`--border-hairline` CSS variable.

1. **`app/globals.css`** — add `--border-hairline: rgba(0,0,0,0.05)`
   to `:root` and `rgba(255,255,255,0.05)` to `.dark`.
2. **`tailwind.config.mjs`** — expose the variable as a named Tailwind
   colour (`hair`) so components can write `border-hair`.
3. **`lib/adapter/registry.tsx`** — surgical edits, no structural
   changes:
   - `Card`: glass surface (`bg-white/70`, `backdrop-blur-[20px]`),
     hairline border, drop `shadow-sm`, drop accent gradient overlay,
     hover `y: -2` → `scale: 1.02`.
   - `Hero`: eyebrow `text-accent` → `text-muted-foreground`.
   - `Avatar`: drop `shadow-lg`, `ring-border` → `ring-hair`.
   - `Badge` (outline): `border-border` → `border-hair`.
   - `Link`: drop `hover:text-accent` and `transition-colors`; keep
     `hover:underline`.
   - `List` (bullet): `marker:text-accent` → `marker:text-foreground/40`.
   - `Button` (outline): `border-border` → `border-hair`.
   - `Input`: drop `shadow-sm`, heavier glass
     (`bg-white/70` + `backdrop-blur-[20px]`), `border-border` →
     `border-hair`. Focus ring untouched.
   - `Video`: drop `shadow-lg`, `border-border/60` → `border-hair`.
   - `Divider`: `border-border/60` → `border-hair`.
4. **`tsc --noEmit`** clean.

Out of scope: reactive backdrop (next spec), chat input restyle,
dark-mode rebrand, Process Red dot pattern, vocabulary changes.

## Build log
<!-- /hdd.build -->

### 2026-05-23
- Plan: apply DESIGN.md visual principles (glassmorphism, hairline
  borders, no shadows, 1.02× hover scale, accent restricted to
  status / badge-accent) to the existing portfolio adapter
  components. Add a single new `--border-hairline` CSS variable,
  expose as a Tailwind colour, no other token changes.
- Done:
  - `apps/portfolio/app/globals.css`: added `--border-hairline` to
    both `:root` (`rgba(0,0,0,0.05)`) and `.dark`
    (`rgba(255,255,255,0.05)`).
  - `apps/portfolio/tailwind.config.mjs`: added
    `hair: "var(--border-hairline)"` under `colors`, enabling
    `border-hair`, `ring-hair`, etc.
  - `apps/portfolio/lib/adapter/registry.tsx`: ten surgical edits
    across `Card`, `Hero`, `Avatar`, `Badge`, `Link`, `List`,
    `Button`, `Input`, `Video`, `Divider`. Card lost its accent
    gradient hover overlay and gained the glass surface; Hero
    eyebrow lost its accent flash; Link / List markers no longer
    use accent. All `shadow-*` removed from adapter components
    (Card, Input, Avatar, Video).
  - Registry export, prop shapes, and vocabulary unchanged.
- Verified: `tsc --noEmit` clean on the portfolio.
- Not yet verified: visual check on the deployed site. The hover
  affordance is now subtler (scale only); eyebrow text is muted;
  card surface is more pronouncedly glass.

## Closure

### Delivered outcome
The portfolio adapter now expresses the DESIGN.md "Hyper-Minimalist
Lab" visual language: glassmorphic surfaces, hairline borders, no
shadows, 1.02× hover scale, and the accent colour reserved for
status / `<Badge variant="accent">` only. The token spec wired the
palette and fonts; this spec puts them in the container DESIGN.md
described.

#### What was added or changed
- `apps/portfolio/app/globals.css` — added a new
  `--border-hairline` CSS variable. Default `rgba(0,0,0,0.05)` in
  `:root`, `rgba(255,255,255,0.05)` in the `.dark` placeholder block.
- `apps/portfolio/tailwind.config.mjs` — exposed the variable as a
  named Tailwind colour (`hair`), enabling utilities like
  `border-hair`, `ring-hair`.
- `apps/portfolio/lib/adapter/registry.tsx` — ten surgical edits, no
  structural changes:
  - **Card**: glass surface (`bg-white/70` + `backdrop-blur-[20px]`)
    + `border-hair`; dropped `shadow-sm`; removed the accent gradient
    hover overlay; `whileHover` swapped from `y: -2` to `scale: 1.02`.
  - **Hero**: eyebrow `text-accent` → `text-muted-foreground`.
  - **Avatar**: dropped `shadow-lg`; `ring-border` → `ring-hair`.
  - **Badge** (outline variant): `border-border` → `border-hair`.
    `accent` variant preserved (the surviving accent usage).
  - **Link**: dropped `hover:text-accent` and `transition-colors`;
    affordance now lives in `hover:underline`.
  - **List** (bullet variant): `marker:text-accent` →
    `marker:text-foreground/40`.
  - **Button** (outline variant): `border-border` → `border-hair`.
  - **Input**: dropped `shadow-sm`; heavier glass (`bg-white/70` +
    `backdrop-blur-[20px]`); `border-border` → `border-hair`. Focus
    ring untouched.
  - **Video** (frame container): dropped `shadow-lg`;
    `border-border/60` → `border-hair`.
  - **Divider**: `border-border/60` → `border-hair`.
- Registry export, prop shapes, and vocabulary are all unchanged.
- `.hdd/functional-specs/portfolio.md` — Brand identity section
  records the new visual rules with a pointer to this spec.

Key technical choices:
- A *single* new CSS variable (`--border-hairline`) carries the
  whole "hairline border" idea. Components reference it via the
  `border-hair` Tailwind utility, not as an arbitrary value, so
  callers don't need to touch the variable name to use the rule.
- Glass surfaces use `bg-white/70` directly (Tailwind utility) rather
  than introducing a `--surface-glass` token. The portfolio is the
  only consumer; the token would be overkill at this stage.
- All `shadow-*` utilities removed from the adapter — none added
  back. The flat-lab aesthetic is enforced by absence.
- Card hover lost both the lift AND the accent gradient shimmer.
  The remaining affordance is 1.02× scale only — accepted risk of
  feeling under-affordant on dense grids; easy to dial up later.

### Deviations from original intent
- None of substance.

### Remaining open questions
- **Behavioural verification on the deployed site.** Acceptance
  criterion #1 (visible glassmorphism + scale-only hover on a project
  Card) was closed on the basis of wiring correctness (`tsc` clean,
  utilities present in the registry). A live deploy + spot-check is
  the next operational step.
- **Hover affordance subtlety.** With no lift and no border change,
  the hover signal is very light. If responses feel "flat-broken" on
  the deployed site, a small refinement (e.g. a subtle brightness
  bump alongside the scale) is an easy follow-up.
- **Reactive backdrop** is now the next `/hdd.define`, per the
  upfront scope split. Will cover the organic effect and per-mode
  reactivity together with the page-level mode signal.
- **Process Red dot pattern, dark-mode visual rebrand,
  chat-input restyle, per-screen reconciliation** — all explicitly
  deferred future specs.

### References
- Build log entry: 2026-05-23 (this iteration).
- Closure commit: `[pending]` — will populate after commit.
- Related closed specs:
  `.hdd/specs/2026-05-22-design-system-from-designs-folder.md`
  (token wiring) and
  `.hdd/specs/2026-05-23-generative-layout-steering.md` (prompt
  few-shots). This spec is the third in the visual-identity arc.
- Functional-spec updated: `.hdd/functional-specs/portfolio.md`
  (Brand identity → Visual language sub-section).
- Future spec teed up: reactive backdrop ("organic effect that reacts
  to different screens").
