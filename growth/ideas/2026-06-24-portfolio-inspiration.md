# Growth ideas — peer portfolio inspiration (2026-06-24)

Transferable ideas from notable creative-developer portfolios and the 2026
landscape. Filtered through this repo's constraints (small semantic vocabulary,
generative aesthetic, library-agnostic core, minimal deps). Drafts only.

## 1. Lead with a live demo, not a skills list
Source: [Best Developer Portfolio Examples 2026 — DEV](https://dev.to/_d7eb1c1703182e3ce1782/best-developer-portfolio-examples-2026-2d8m)
**Insight:** the strongest 2026 portfolios open with a hero + a working demo and
bury the skills list. **Apply here:** the portfolio already *is* a live demo (the
chat generates real UI). Make that legible in the first 3 seconds — a one-line
"type anything; this UI is generated live by the DSL" cue near the input, so a
hiring manager immediately grasps that the medium is the message.

## 2. Code as storytelling / narrative experience
Source: [The Anthology of a Creative Developer — DEV](https://dev.to/nk2552003/the-anthology-of-a-creative-developer-a-2026-portfolio-56jp)
**Insight:** top creative devs frame the site as a narrative that reflects how
they think, not a CV. **Apply here:** lean into the literary-theory background —
a guided "ask me about…" set of seed prompts that walk a visitor through a small
arc (creative coding → AI interfaces → DSLs), each rendering as generated UI.

## 3. WebGL/GSAP cinematography as signature motion
Source: [Muzli — 100 Best Portfolio Websites](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/) (Jordan Delcros, Stas Bondar)
**Insight:** signature motion (Three.js/GSAP) is the differentiator at the top.
**Apply here:** we deliberately avoid heavy deps — but the hand-rolled Canvas
backdrop is the equivalent signature. Idea: make the backdrop *react* to
generation (a subtle pulse when a response renders) so motion reinforces the
"alive" thesis without adding a 3D dependency.

## 4. Featured projects with live demos + tight copy
Source: [Colorlib — 21 Best Developer Portfolios 2026](https://colorlib.com/wp/developer-portfolios/)
**Insight:** each featured project links a live demo and one sharp sentence.
**Apply here:** the `openSource` entries (ArticleLang, HDD, this library) should
each surface a "try it" link where one exists (playground, npm, studio), not just
a GitHub link — turn the showcase into something clickable.

## Next steps (PO)
Candidate goals spanning the connected body of work, recommendation marked:
- **[Recommended] Portfolio:** add a first-screen cue + 3 seed prompts that make
  "this UI is generated live" obvious within 3 seconds (idea #1 + #2). High signal
  for hiring managers, small surface area.
- **Library:** give `openSource`/project cards an optional "try it" link
  (playground/npm/live) so the showcase is clickable (idea #4).
- **HDD:** a short narrative page/section positioning Honest-DD as the method
  behind how this very repo is built (ties the story together).
