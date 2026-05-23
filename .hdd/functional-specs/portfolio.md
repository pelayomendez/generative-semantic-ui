# Functional spec: Portfolio app

> domain: portfolio
> location: `apps/portfolio/`
> deployed: https://pelayomendez-portfolio.vercel.app
> last updated: 2026-05-23 (visual refresh)

## Purpose
A chat-driven portfolio for Pelayo Méndez. The visitor asks a question;
the page renders the answer as generative-semantic-ui JSX, compiled
through a Framer-Motion-powered adapter with Pelayo's brand styling. The
portfolio doubles as the canonical real-world demo of this package.

## Stage layout
- Top brand bar (z-20) with name, headline and external links.
- Backdrop canvas (z-0) — bouncing-balls animation echoing pelayomendez.dev.
- Stage area (z-10) — either the landing intro or the current answer.
- Bottom fade (z-20 on chat) — softens long content above the input.
- Chat input form (z-30) — fixed, draggable, anchored centre on landing,
  bottom on chat.

## Single-answer model
- One question at a time. The current answer replaces the previous render.
- Above each answer: a tiny italic `› question` breadcrumb so visitors
  remember what they asked.
- No scroll-back conversation history. The chat input is the only place
  the user's text lives.

## Chat input behaviour
- Centered on landing (intro above, suggestion chips below — both inside
  the form so the whole group auto-centres).
- Bottom-docked on chat (`bottom-6`, horizontally auto-centred).
- Draggable via `useDragControls` — drag fires only when the user grabs
  the form chrome or the grip pill, not when typing in the textarea or
  pressing the send button.
- Drag is constrained to the `main` element (i.e. viewport while on
  landing, slightly larger when the chat has scrollable content).
- Position swap on `hasStarted` is currently an instant className change.
  The pre-bug morph animation has been removed because Framer's `layout`
  prop fought with Tailwind translates and left the input mis-positioned.

## Dataset rules (LLM behaviour)
- The system prompt at `apps/portfolio/app/api/generate/route.ts` ships
  the entire dataset as JSON.
- The model may use only facts from the dataset. No invention.
- The model must NOT emit `{variable}` template references — text gets
  inlined verbatim.
- Answers must be a single root element. The route's `ensureSingleRoot`
  auto-wraps multi-root output in a `<Stack gap={8}>`.
- Project deep-dive (when asked about a specific project) renders the
  Vimeo `Video` inside a `<Section>` with summary, badge row and role
  line.
- "Selected work" / project listings render a `<Grid cols={2}>` of plain
  `Card`s — NO videos in the grid cells.
- Shape steering combines those prose rules with **literal-JSX
  few-shot examples** at `apps/portfolio/lib/few-shots.ts` (one per
  mode: `homeSample` / `aboutSample` / `gallerySample` /
  `detailSample`). The prose says *when* to use each shape; the
  few-shots show *what* the shape looks like. Both ship in every
  request; the few-shots add ~550 tokens to the prompt. See spec
  `.hdd/specs/2026-05-23-generative-layout-steering.md`.

## Brand identity
- Source of truth: `apps/portfolio/designs/DESIGN.md` ("Semantic Lab"
  / "Hyper-Minimalist Lab" — see spec
  `.hdd/specs/2026-05-22-design-system-from-designs-folder.md`).
- Surface `#faf9fe` background, foreground `#1a1b1f`, accent `#ff3b30`
  "Process Red" (reserved for status indicators + micro-interactions —
  never large surfaces).
- Display family: **Inter** (weight 600) on `font-display`. Body / data
  family: **JetBrains Mono** (weights 400/500) on `font-sans` and
  `font-mono` — the monospaced body is intentional, reinforcing the
  "Lab" aesthetic.
- Active palette is the ~12-token subset of the full M3 set documented
  in `designs/DESIGN.md`. Add a token to globals only when a usage
  demands it.
- Radii scale: `sm 0.25rem`, `DEFAULT 0.5rem`, `md 0.75rem`, `lg 1rem`,
  `xl 1.5rem`, `full 9999px`. Soft-Modern: inputs are pill-shaped,
  cards are 1–1.5rem rounded.
- **Visual language** (per spec
  `.hdd/specs/2026-05-23-adapter-visual-refresh.md`):
  - **Cards are opaque** (`bg-card`) with hairline borders and a
    `-4px y-lift` on hover; the cover image inside a Card zooms
    `scale-105` over 700ms on group hover. Glassmorphism is **not**
    applied to Cards — it's reserved for the floating chat input in
    the shell (separate future spec). `<Input>` in the adapter
    matches Card (opaque + hairline). No shadows anywhere in the
    adapter.
    (Corrected 2026-05-23 — the previous adapter-visual-refresh
    closure documented Cards as glass; that was wrong against
    `designs/gallery/code.html` and was reverted in spec
    `2026-05-23-card-and-badge-design-alignment.md`.)
  - **Hairline borders**: a new `--border-hairline` CSS variable
    (`rgba(0,0,0,0.05)` light / `rgba(255,255,255,0.05)` dark)
    exposed as the Tailwind colour `hair`. Used by Card, Input,
    Avatar ring, Badge outline, Button outline, Video frame, Divider.
  - **Hover**: 1.02× scale only — no y-lift, no shadow change, no
    accent shimmer.
  - **Accent (Process Red `#ff3b30`)** is reserved for status /
    `<Badge variant="accent">`. Link / List markers / Hero eyebrow
    use foreground tones instead.
- Generative aesthetic — the canvas backdrop is always animating;
  entrance variants stagger. (Backdrop itself is unchanged in this
  spec — reactive-backdrop work is a future spec.)
- Dark mode is `[deferred]` — placeholder values live in
  `globals.css :root .dark`; a dedicated rebrand spec is the next
  step for the dark palette.

## Rate limiting
- 12 requests per hour per IP. Implemented in
  `apps/portfolio/lib/rate-limit.ts`. In-memory map; resets on cold start.
- MISTRAL_API_KEY is server-only, set via Vercel env (production and
  development).

## Deployment
- Linked to GitHub via the Vercel project `pelayomendez-portfolio` in the
  `pelayomendezs-projects` team.
- Auto-deploys from `main`. NO commits/pushes without explicit user
  authorization. Pushes are deploys.
