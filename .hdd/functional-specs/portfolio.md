# Functional spec: Portfolio app

> domain: portfolio
> location: `apps/portfolio/`
> deployed: https://pelayomendez-portfolio.vercel.app
> last updated: 2026-05-12

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

## Brand identity
- White background, dark-red accent `#c40f07` (from pelayomendez.dev).
- Display: Instrument Serif (`font-display`). Body: Inter (`font-sans`).
- Generative aesthetic — the canvas backdrop is always animating; entrance
  variants stagger.

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
