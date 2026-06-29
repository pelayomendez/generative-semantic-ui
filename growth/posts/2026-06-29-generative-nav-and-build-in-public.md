# Social post drafts (2026-06-29)

Drafts only — review, edit, post manually. Voice: honest, specific, generative
sensibility; no hype. Grounded in what actually shipped (PRs #8–#15): clickable
generated cards → follow-up prompt (generated UI becomes navigation), a path-based
breadcrumb trail across that navigation, click-the-name → reset to landing, the
autonomous Claude Code agent team, and the Mugaritz film-festival recognition in
the dataset.

Links: live playground https://generative-semantic-ui.vercel.app · repo
https://github.com/pelayomendez/generative-semantic-ui · portfolio
https://www.pelayomendez.dev · npm `honestdd`, `articlelang`.

Net-new angles vs. the 2026-06-24 drafts (don't repeat those): this batch leans on
(a) generated-UI-as-navigation, (b) the generative-UI spectrum framing, and
(c) build-in-public grounded in real merged PRs.

---

## LinkedIn

**A — generated UI as navigation (substance / shipped)**
> A small thing shipped on my portfolio that I keep thinking about: the UI the model
> generates is now the navigation.
>
> Click a generated card and it sends a follow-up prompt — so the next screen is
> generated too. A breadcrumb trail records the path you took (the conversation's
> path, not a sitemap — there are no fixed pages). Click my name and you're back at
> the start.
>
> Most chat UIs lose your place: you scroll back, or context gets compacted and the
> thread just disappears. Here the generated output *is* the map. You can always see
> where you've been and step back into it.
>
> Built on the same closed, semantic JSX vocabulary the whole thing runs on.
> https://www.pelayomendez.dev

**B — where this sits on the generative-UI spectrum (positioning)**
> The generative-UI conversation in 2026 has settled on a spectrum: *controlled*
> (the agent picks from pre-built components), *declarative* (the agent emits an
> allow-listed vocabulary, a renderer interprets it), and *open-ended* (the agent
> emits raw HTML/iframes).
>
> The honest tradeoff: open-ended is flexible but non-deterministic and unsafe;
> closing the vocabulary buys you safety and consistency.
>
> generative-semantic-ui lives squarely at the declarative end on purpose. The model
> emits a small set of semantic tags — Card, Hero, Section — and a compiler turns them
> into real React via adapters. Single root, literals only, no arbitrary JSX. The
> constraints aren't a limitation; they're the product.
> https://generative-semantic-ui.vercel.app

**C — build in public, grounded (career / process)**
> I'll say the quiet part: most of my portfolio's recent changes weren't written by me
> at a keyboard.
>
> The repo is run by a small Claude Code agent team — a PO that pulls goals from a
> backlog, a designer, a DSL specialist, QA, and an independent adversarial reviewer —
> each in its own worktree, opening PRs.
>
> It's not a demo. Real merged PRs this month: clickable generated cards that drive
> navigation, a breadcrumb trail across them, a reset-on-name-click. I review and
> merge; the loop does the rest.
>
> The interesting part isn't "AI writes code." It's watching a team-shaped process
> ship coherent, reviewable increments to a real project.
> https://github.com/pelayomendez/generative-semantic-ui

---

## X / Twitter

**D — generated UI as navigation (hook)**
> Chat UIs keep losing your place — you scroll back, or context compaction eats the
> thread.
>
> On my portfolio the generated UI *is* the navigation:
> – click a generated card → it sends a follow-up prompt
> – a breadcrumb trail records the path you took
> – click my name → back to the start
>
> https://www.pelayomendez.dev

**E — the spectrum framing (technical)**
> Generative UI in 2026, three flavors:
> controlled — agent picks pre-built components
> declarative — agent emits an allow-listed vocabulary, compiler renders it
> open-ended — agent emits raw HTML (flexible, unsafe, non-deterministic)
>
> generative-semantic-ui is the strict declarative one. Closed vocab → real React.
> https://generative-semantic-ui.vercel.app

**F — build in public (proof, not claim)**
> My portfolio's repo is maintained by an autonomous Claude Code agent team — PO,
> designer, DSL specialist, QA, + an adversarial reviewer, each in its own worktree.
>
> It pulls goals from a backlog and opens PRs. Real merged ones this month: clickable
> cards that drive nav, a breadcrumb trail, reset-on-name-click.
>
> I just review and merge.
> https://github.com/pelayomendez/generative-semantic-ui

**G — Honest-DD tie-in (process throughline)**
> The agent team that runs my portfolio doesn't start from a prompt. It starts from an
> intent + a spec, builds toward it, and records what was actually delivered.
>
> That discipline is a tool: Honest-DD. Intent first, code second, honest changelog
> after.
> npm i honestdd

---

## Bluesky

**H — narrative / generative sensibility**
> I spent a decade making generative visuals for opera and live events — surfaces that
> had to feel alive.
>
> Now I point the same instinct at how a language model and a person share a screen.
> On my portfolio, click a generated card and the next view generates too; a trail
> remembers the path you wandered.
>
> The UI isn't retrieved. It's grown, each step, from what you ask.
> https://www.pelayomendez.dev

**I — small + specific**
> A nice detail I shipped: my portfolio dataset now records a film-festival recognition
> at Mugaritz. Closed dataset, semantic vocabulary — the model can only render what's
> actually true, then composes it into a live, navigable surface.
> https://www.pelayomendez.dev

---

## Notes
- B + D pair well as a launch pair (positioning + the concrete shipped feature).
- C and F are the same build-in-public story at two lengths; pick one per platform,
  don't run both on the same network the same week.
- F/G read best back to back (the "what" then the "how/why") if spacing X posts.
- All build-in-public copy points at *named, merged* PRs — keep it that way; if a PR
  reference goes stale, swap it rather than generalising to "lots of PRs."
- I is optional/light — only post if a Mugaritz mention reads as genuine context, not
  a humblebrag.
