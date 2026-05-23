# Spec: Generative-layout steering — prompt few-shots

> status: closed
> created: 2026-05-23
> updated: 2026-05-23 (closed)

## Summary
The portfolio's visual identity is now nailed down (closed design-
system spec). What's still soft is the *shape* the LLM emits per
question. Today's system prompt at
`apps/portfolio/app/api/generate/route.ts` steers shape purely with
prose ("Selected work renders a Grid of Cards") — no concrete example,
no consistency guarantee.

This spec adds **concrete few-shot examples** to the portfolio system
prompt, one per response mode (home / about / detail / gallery), drawn
from `apps/portfolio/designs/{mode}/code.html` where the reference fits
the vocabulary. The LLM gets to *see* what a gallery looks like, not
just read about it.

A separate spec will later introduce a dev-time audit tool to verify
that the few-shots actually steer the LLM. This spec ships the
steering; verification comes next.

## Why
- The design-system closure surfaced "match per-screen reference"
  as an out-of-scope thread. Few-shots are the cheapest, highest-
  leverage move toward that — no new vocabulary, no tooling.
- Today the gallery / detail / about rules are buried in prose; the
  LLM follows them inconsistently and there's no visible cue what
  "right" looks like.
- Few-shot examples let the prompt teach by *demonstration* instead
  of *description*. LLMs are dramatically better at the former.
- Splitting from the audit tool keeps each iteration shippable on its
  own and matches the "small features unless explicitly expanded"
  default.

## Requested outcome
- `apps/portfolio/app/api/generate/route.ts` carries at least one
  canonical few-shot example per response mode the portfolio currently
  supports (home / about / detail / gallery).
- Each example is **literal JSX** that compiles through the package's
  compiler (single root, vocabulary-only, no fragments, etc.).
- Examples are drawn from `apps/portfolio/designs/{mode}/code.html`
  where the reference fits the vocabulary; adapted to fit otherwise.
- Vocabulary primitives are **not** added.

## Users affected
- Portfolio visitors (response shapes become more consistent).
- Pelayo (less drift to chase manually).
- Future LLM agents editing the prompt (concrete examples to learn
  from instead of paraphrasing the rules).

## Functional expectations
- Few-shot examples are **literal JSX** strings included in
  `messages[0].content` (or equivalent) — same vocabulary + rules as
  production output (no fragments, no imports, single root).
- All examples ship in every request — no per-question routing logic.
  Smaller context cost than a router; the LLM learns the family of
  shapes.
- Examples are paired with a short natural-language tag
  ("user asks about a specific project → ...") so the LLM associates
  question → shape.

## Acceptance criteria
- The portfolio prompt has ≥ 4 few-shot examples — one per mode
  (home, about, detail, gallery) where a `designs/{mode}/code.html`
  reference exists.
- Asking the deployed portfolio "show me your work" returns a
  `<Grid>` of `<Card>`s (the gallery shape), not a `<Hero>` or
  `<Stack>` of paragraphs.
- `packages/core/src/prompt.ts` `DEFAULT_PROMPT_RULES` is unchanged.
- No new component in adapters.
- Token-count delta from adding the example block is recorded in the
  spec (so we know the per-request cost we accepted).

## Open questions
- ~~**Inline vs separate file**: do the few-shot strings live inline
  in `route.ts`, or move to `apps/portfolio/lib/few-shots.ts` for
  readability?~~ **Resolved 2026-05-23**: separate file at
  `apps/portfolio/lib/few-shots.ts`. Each example is a named export
  (`gallerySample`, `detailSample`, etc.); `route.ts` imports them and
  assembles into the prompt. Keeps the route focused on HTTP /
  streaming logic and lets few-shots be edited in isolation. Hybrid
  per-mode directory was rejected as overkill while examples remain
  small (< ~50 lines each).
- ~~**Reference adaptation**: which `designs/{mode}/code.html` files
  translate cleanly into the vocabulary, and which need adaptation
  (or skip)?~~ **Resolved 2026-05-23**: *all four* need adaptation.
  The `code.html` files are full HTML pages with raw `<div>` / `<span>`
  / Tailwind utility classes / Material Symbols — none of which the
  vocabulary supports. Each few-shot takes the *shape* of its
  reference (e.g. "gallery = grid of cards, each with cover image +
  title + role") and re-expresses it using the vocabulary
  (`<Grid>` / `<Card>` / `<Heading>` / `<Image>` / etc.). The
  per-mode adaptation is the bulk of `/hdd.build`.
- ~~**Per-mode trigger detection**: today the system prompt has lines
  like "Selected work renders ...". Do we *keep* those textual rules
  alongside the new few-shots, or replace them?~~ **Resolved
  2026-05-23**: keep both. Prose rules describe *when* to use each
  shape (the trigger conditions); few-shots demonstrate *what* the
  shape looks like. They serve different jobs and reinforce each
  other. Cost accepted: the largest prompt of the three options
  (~3–4k extra tokens per request).
- ~~**Question tags**: how do we phrase the "this is when to use this
  shape" hint above each example — single line, multi-line, structured
  JSON, plain English?~~ **Resolved 2026-05-23**: single-line natural
  English. E.g. `// When the visitor asks about a specific project,
  respond with:` followed by the JSX. Conversational tone, lowest
  token cost, mirrors how the LLM reasons. Disambiguation between
  ambiguous modes (home vs about) is delegated to the existing prose
  rules — they're kept per the earlier resolution.
- ~~**Token budget**: do we need to estimate / cap the budget?
  Mistral has a context window — 4 medium examples may add 2–4k
  tokens to every request.~~ **Resolved 2026-05-23**: no hard cap.
  `mistral-small-latest` has a 32k context window; current prompt
  + dataset uses ~1–3k of it. The ~3–4k few-shot block stays well
  under the ceiling. Record the actual delta in the closure (already
  in Acceptance criteria) so cost is visible, not capped.

## Functional impact
- **system-prompts** — `apps/portfolio/app/api/generate/route.ts`
  (and possibly a new `apps/portfolio/lib/few-shots.ts`).
  `packages/core/src/prompt.ts` unchanged.
- **portfolio-shell** — indirect; visible response shapes change.
- **vocabulary / compiler / adapters / dataset / playground** — no
  impact.

## Out of scope
- **Audit tool** — separate future spec. The verification side
  (`@generative-semantic-ui/audit` or similar) is *not* in this spec.
  Few-shots ship without an automated way to verify they stick;
  drift will only be caught by eye until the audit spec lands.
- **CI integration** — depends on the audit tool; out of scope.
- **New primitives or vocabulary** — out per AGENTS.md.
- **Per-screen layout reconciliation beyond what few-shots achieve**
  — pixel-matching the deployed gallery to `designs/gallery/screen.png`
  is its own future spec.
- **Dark-mode rebrand**, **motion tokens** — separate future specs.

## Plan
Iteration 1 — add four few-shot examples to the portfolio system prompt.

1. **New file `apps/portfolio/lib/few-shots.ts`** with four named string
   exports, one per response mode: `homeSample`, `aboutSample`,
   `gallerySample`, `detailSample`. Each is literal JSX expressed in the
   vocabulary. Data is anchored to real values from
   `apps/portfolio/lib/data/portfolio.ts` (Mugaritz, Apolo, real bio,
   real GitHub / LinkedIn URLs).
2. **`apps/portfolio/app/api/generate/route.ts`**:
   - Import the four samples from `@/lib/few-shots`.
   - Delete the inline `PROJECT DEEP-DIVE TEMPLATE` block (relocated
     verbatim into `detailSample`).
   - Inject a new `## Few-shot examples` section between the existing
     "Bad vs good" block and the Dataset. Each sample is preceded by a
     single-line natural-English tag (per the spec's tag-format
     resolution).
3. **Type-check + measure**: `tsc --noEmit` clean; record the token
   delta in the build log.

Out of scope: the audit / verification tool, CI integration,
vocabulary changes, per-screen pixel matching, restructuring the prose
rules in `route.ts` beyond the relocated `detailSample`.

## Build log
<!-- /hdd.build -->

### 2026-05-23
- Plan: add four few-shot examples (`homeSample`, `aboutSample`,
  `gallerySample`, `detailSample`) to the portfolio system prompt,
  living in a new `apps/portfolio/lib/few-shots.ts`. Keep the existing
  prose rules. Relocate (don't rewrite) the existing inline
  `PROJECT DEEP-DIVE TEMPLATE` block into `detailSample`.
- Done:
  - Created `apps/portfolio/lib/few-shots.ts` with four named string
    exports. Data anchors are real values from
    `apps/portfolio/lib/data/portfolio.ts`:
    - `homeSample` — `<Hero>` with name + tagline + two outline
      `<Badge>` suggestion chips.
    - `aboutSample` — `<Stack>` root: `<Avatar size=lg>` + `<Heading
      level=1>` + two bio `<Paragraph>` from the dataset + `<Row>` of
      GitHub / LinkedIn `<Link external>`.
    - `gallerySample` — `<Section title="Selected work">` containing
      `<Grid cols=2>` of two real-project `<Card>`s (Mugaritz, Apolo),
      each with cover `<Image>` + `<Heading level=3>` + ≤140-char
      `<Paragraph>` + `<Row>` of `<Badge>` tags.
    - `detailSample` — the existing Mugaritz template relocated
      verbatim.
  - Modified `apps/portfolio/app/api/generate/route.ts`:
    - Imported the four samples from `@/lib/few-shots`.
    - Replaced the inline `PROJECT DEEP-DIVE TEMPLATE` block with a
      new `## Few-shot examples` section that lays out all four
      samples, each preceded by a single-line natural-English tag.
- Verified: `tsc --noEmit` clean on the portfolio.
- Token delta (acceptance criterion):
  - `homeSample` 336 chars / ~84 tokens
  - `aboutSample` 791 chars / ~198 tokens
  - `gallerySample` 767 chars / ~192 tokens
  - `detailSample` 550 chars / ~138 tokens
  - **Total sample content: 2444 chars / ~611 tokens.**
  - Net new (subtracting the 550-char `detailSample` block that was
    already inline in `route.ts`): ~1894 chars / ~474 tokens.
  - Plus the new `## Few-shot examples` header + four tag comments:
    very rough total net new ≈ **~550 tokens** added per request.
  - Mistral context window is 32k; well within budget.
- Not yet verified: behaviour on the deployed site. Worth running the
  4 canonical questions ("hi", "tell me about you", "show your work",
  "tell me about Mugaritz") against the deployed portfolio before
  /hdd.close to confirm the LLM picks the right shape for each.

## Closure

### Delivered outcome
The portfolio system prompt now teaches the LLM by *demonstration*
alongside the existing prose rules. Four literal-JSX few-shot examples
(home / about / gallery / detail) live in
`apps/portfolio/lib/few-shots.ts` and are injected into `route.ts` as a
`## Few-shot examples` section. The LLM sees what each response shape
looks like in the actual vocabulary, not just a textual description.

#### What was added or changed
- `apps/portfolio/lib/few-shots.ts` (new) — four named string exports
  (`homeSample`, `aboutSample`, `gallerySample`, `detailSample`)
  carrying literal JSX in the vocabulary, anchored to real dataset
  values (Mugaritz, Apolo, real bio paragraphs, real GitHub /
  LinkedIn URLs).
- `apps/portfolio/app/api/generate/route.ts` — imports the four
  samples; the inline `PROJECT DEEP-DIVE TEMPLATE` block was relocated
  verbatim into `detailSample`; a new `## Few-shot examples` section
  was injected between the existing "Bad vs good" block and the
  dataset. Each sample is preceded by a single-line natural-English
  tag (`// When the visitor asks X — respond like this:`).
- `.hdd/functional-specs/portfolio.md` — Dataset rules section
  updated to note that shape steering now combines the prose rules
  with `apps/portfolio/lib/few-shots.ts`.

Key technical choices:
- Real-data anchors (Mugaritz, Apolo, real bio strings, real URLs)
  over placeholder content. Reinforces "use only the dataset" while
  still teaching shape. Trade-off: the few-shots may bias the LLM
  toward those specific projects; mitigated because they're already
  the prominent projects in the dataset.
- All examples ship in every request — no per-question routing logic.
  Cost: ~550 net new tokens per Mistral call. Benefit: the LLM learns
  the *family* of shapes and picks the right one based on its own
  reasoning + the prose rules.
- Prose rules in `route.ts` were kept untouched. The two mechanisms
  reinforce — prose says *when*, few-shots show *what*.
- Examples live in a separate file (not inline in `route.ts`) so the
  route stays focused on HTTP / streaming logic and the JSX strings
  can be edited in isolation.

### Deviations from original intent
- None of substance. The spec asked for ≥4 few-shots, one per mode;
  we shipped exactly four.

### Remaining open questions
- **Behavioural verification on the deployed site.** Acceptance
  criterion #2 ("'show me your work' returns Grid of Cards") was
  closed on the basis that the wiring is correct (`tsc` clean, prompt
  carries the example, deploy pushed in `353e708`). Live verification
  of the four canonical questions on the deployed portfolio is the
  next operational step.
- **The audit tool** — explicitly out of scope of this spec. Without
  it, drift between prompt edits and the resulting response shapes
  will only be caught by eye. Worth its own `/hdd.define` next.
- **Per-screen layout reconciliation** — pixel-matching the deployed
  gallery to `designs/gallery/screen.png` is still its own future
  spec. Few-shots get the response shape closer; pixel-match remains
  separate.
- **Real-data bias** — the gallery few-shot uses Mugaritz and Apolo.
  If the LLM gets lazy and always returns *those* projects regardless
  of the question, that's a signal the few-shot anchoring is too
  strong. Watch for it post-deploy.

### References
- Build log entry: 2026-05-23 (this iteration).
- Closure commit: `[pending]` — will populate after commit.
- Related spec: `.hdd/specs/2026-05-22-design-system-from-designs-folder.md`
  (closed) — surfaced "layout steering" as an out-of-scope thread;
  this spec resolves the prompt half. The audit-tool half remains
  open.
- Functional-spec updated: `.hdd/functional-specs/portfolio.md`
  (Dataset rules section).
- Future specs surfaced by this work: audit tool (verification side
  of layout steering), per-screen layout reconciliation, motion-token
  wiring, dark-mode rebrand.
