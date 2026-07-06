# Social post drafts (2026-07-06)

Drafts only — review, edit, post manually. Voice: honest, specific, generative
sensibility; no hype. Grounded in what actually shipped this week: a rich
project-detail view matching the design (PR #21), detail-view media isolation so a
repo gets NO fabricated video — media only when it genuinely exists (PR #20), and
weekly dataset enrichment + re-verification that media URLs actually resolve (PRs
#22/#23).

Links: live playground https://generative-semantic-ui.vercel.app · repo
https://github.com/pelayomendez/generative-semantic-ui · portfolio
https://www.pelayomendez.dev · npm `honestdd`, `articlelang`.

Net-new angles vs. prior batches (don't repeat those): this week leads on
(a) data honesty / the closed dataset as an anti-hallucination guarantee,
(b) detail-view media discipline (absence as a decision), (c) link-rot / URL
re-verification as craft, and (d) provenance-by-construction. NOT navigation, NOT
the generative-UI spectrum — those were last week.

---

## LinkedIn

**A — the closed dataset as an anti-hallucination guarantee (substance / positioning)**
> My portfolio is a chat that generates its own UI. The obvious worry with that: what
> stops the model inventing a project I never did, a festival I never showed at, a
> video that doesn't exist?
>
> The answer is architectural, not a disclaimer. The model can only render a closed,
> semantic vocabulary, and it's given a closed dataset of what's actually true. The
> hard rule covers media too: an entry with no video and no images gets *no* `<Video>`
> and *no* `<Image>` — it can't borrow one from another project to fill the frame.
>
> So it isn't "trust me, it won't hallucinate." It's "the medium won't carry an
> untrue claim." Provenance by construction.
> https://www.pelayomendez.dev

**B — detail-view media discipline (shipped, this week)**
> Shipped this week: when you drill into a specific project on my portfolio, you get a
> proper detail view — a hero, the story on one side, role/collaborators/tags on the
> other, then a gallery of that project's own images.
>
> The part I care about most is what it *won't* do. If a project has a video, you get
> the video. If not, its first image. If neither, the hero is simply omitted — never a
> borrowed clip, never a stand-in. An empty slot is honest; a fabricated one is a lie.
>
> All of it is composed from the same ~20-tag vocabulary. No bespoke "case study"
> component — the detail surface just falls out of Grid + Stack + Heading + Badge.
> https://www.pelayomendez.dev

**C — link verification as craft (process / dev tooling)**
> Link rot is structural, not exceptional — studies put ~66% of tracked links dead over
> a decade, and a third of social links gone within two years. On a portfolio where a
> language model renders images and video straight from a dataset, a rotted URL isn't
> an SEO footnote — it's a visibly broken card, and quietly, a lie.
>
> So the weekly maintenance loop on this repo doesn't just *add* to the dataset — it
> re-verifies that every media URL still resolves. Freshness and integrity move
> together, on a cadence.
>
> Honesty in an AI interface isn't only "don't invent." It's "keep what you claimed
> true after you shipped it."
> https://github.com/pelayomendez/generative-semantic-ui

---

## X / Twitter

**D — data honesty (hook)**
> My portfolio is a chat that generates its own UI. What stops it inventing a project I
> never did, or a video that doesn't exist?
>
> Closed vocabulary + closed dataset. The rule covers media too: no video/images on an
> entry → the model emits none. It can't borrow one to fill the frame.
>
> Not a disclaimer — the medium won't carry an untrue claim.
> https://www.pelayomendez.dev

**E — detail-view discipline (shipped)**
> Shipped this week: drill into a project on my portfolio and you get a real detail view
> — hero, prose, role/collaborators/tags, image gallery.
>
> Best part is the restraint: video if it exists → else first image → else no hero at
> all. Never a borrowed clip. An empty slot is honest; a fake one isn't.
> https://www.pelayomendez.dev

**F — small vocabulary proof (technical)**
> The project detail view on my portfolio — hero media, prose↔metadata split, image
> gallery — has no bespoke "CaseStudy" component.
>
> It's composed from the same ~20 semantic tags everything else uses: Section, Grid,
> Stack, Heading, Badge. Small vocabulary > big vocabulary.
> https://generative-semantic-ui.vercel.app

**G — link rot / re-verification (craft)**
> ~66% of tracked links go dead over a decade. On a portfolio where an LLM renders media
> straight from a dataset, a dead URL is a broken card — and quietly, a lie.
>
> So the weekly loop doesn't just add data, it re-verifies every media URL still
> resolves. Keeping a claim true after you ship it is part of the honesty.
> https://github.com/pelayomendez/generative-semantic-ui

**H — Honest-DD tie-in (throughline)**
> There's a throughline in everything I'm building: the model states what's true, then
> is held to it. Closed dataset on the portfolio; intent + spec before code with
> Honest-DD; a recorded record of what was actually delivered.
>
> Honesty as a design property, not a vibe.
> npm i honestdd

---

## Bluesky

**I — narrative / generative sensibility**
> For a decade I made generative visuals for opera and live events — every frame grown
> from something real happening on stage, never faked.
>
> My portfolio keeps that rule. It's a chat that generates its own interface, but it can
> only render what's actually true of me — down to refusing to show a video that
> doesn't exist. The surface is alive, but it doesn't lie.
> https://www.pelayomendez.dev

**J — small + specific (shipped)**
> A quiet detail I shipped this week: drill into a project and if it has no video, the
> portfolio doesn't invent one or borrow another project's — it just leaves the hero
> out. Absence, on purpose. Honesty is mostly what you refuse to render.
> https://www.pelayomendez.dev

---

## Notes
- A + B pair as a LinkedIn set: A is the *why* (provenance by construction), B is the
  *what shipped* (the detail view). Space them a few days apart; don't run both same day.
- D + E are the X versions of A + B — pick the platform, don't cross-post verbatim.
- F is the lightest technical note; good as a standalone reply/quote or a low-stakes
  midweek post. Pairs with E (the "what" then "how it's built cheap").
- C and G are the same link-rot story at two lengths — one per network, not both.
- H (Honest-DD) reads best *after* A or D has established the "honesty" frame; it's the
  throughline payoff, weak as a cold open.
- J is optional/light — only if the "absence on purpose" line lands as craft, not as
  making a small thing sound big.
- All "shipped this week" copy points at real PRs (#20 media isolation, #21 detail
  view, #22/#23 verification). If a reference goes stale, swap it rather than
  generalising to "lots of updates."
