# Growth ideas — detail views, data honesty & provenance as craft (2026-07-06)

Net-new transferable ideas for this week, drawn from detail-page / case-study
design writing, provenance & anti-hallucination research, and link-rot studies.
Filtered through this repo's constraints: small semantic vocabulary, generative
aesthetic, library-agnostic core, minimal deps, closed dataset (the LLM may only
render what's true). Drafts only.

Distinct from the two prior digests. Off-limits (already covered): lead-with-demo,
code-as-storytelling, signature motion, featured-projects-with-try-it (06-24); the
generative-UI spectrum, generated-UI-as-navigation, path-based breadcrumbs, devtool
landing hero/problem-first copy, build-in-public / merged-PRs-as-changelog (06-29).
This week leans on the detail surface and the data-honesty story instead.

Grounded in what shipped this week: a rich project-detail view matching
`designs/detail/` (PR #21), detail-view media isolation so a repo gets NO fabricated
video (PR #20), and weekly dataset enrichment + re-verification that media URLs
actually resolve (PRs #22/#23).

## 1. The closed dataset is a provenance story — say "only renders what's true" out loud
Source: [Examining the Impact of Provenance-Enabled Media on Trust and Accuracy Perceptions (arXiv 2303.12118)](https://arxiv.org/pdf/2303.12118)
and [Tool Receipts, Not Zero-Knowledge Proofs: Practical Hallucination Detection for AI Agents (arXiv 2603.10060)](https://arxiv.org/pdf/2603.10060).

**Insight:** the trust research has moved past "was this AI-generated?" toward
*provenance and grounding as the trust signal* — surfacing that a claim is backed by
an observed source (a "receipt") rather than inferred/ungrounded materially changes
whether users trust it. Epistemic transparency — showing *how the system knows what it
claims* — is now framed as the right abstraction for human-AI trust.

**Apply here:** the portfolio already enforces this in the strongest possible way, and
it's under-told. The system prompt's hard rule literally reads "Use ONLY facts that
appear in the dataset" and "**The closed-dataset rule covers MEDIA too**" — an entry
with no `video`/`images` gets NO `<Video>` and NO `<Image>`
(`apps/portfolio/app/api/generate/route.ts:35-36`). This is a chat UI where the model
*cannot* hallucinate a project, a collaborator, a date, or a video, because the
renderer only knows the closed dataset in `apps/portfolio/lib/data/portfolio.ts`. That
is a genuine, demonstrable anti-hallucination guarantee — a provenance property baked
into the architecture, not a disclaimer bolted on. No code needed; the move is to name
it as the trust story it already is. Fits "strict by default" and "closed dataset"
directly.

## 2. Detail-view media discipline: absence is a design decision, not a gap
Source: [Progressive Disclosure — Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/).

**Insight:** progressive disclosure is about *what you deliberately withhold* —
"initially show only the most important options; offer the larger set upon request,"
and defer anything non-essential. The corollary the article stresses: the split
between shown and deferred must be *correct and deliberate*. Missing content should
read as an intentional choice, never as a broken slot.

**Apply here:** this is exactly the discipline PR #20 (media isolation) enforced — a
repo detail view emits *no* hero media rather than borrowing another entry's video to
fill the frame. The detail spec even encodes the fallback ladder: use the project's
own `video`; else its own `images[0]`; else "omit the hero"
(`route.ts:42`). That "else omit" is the progressive-disclosure principle applied to
truth: an empty media slot is worse than no slot, and a *fabricated* one is worst of
all. The transferable idea is to treat this as a stated design value — "the detail
view shows only the media that genuinely exists for that entry" — rather than an
implementation footnote. Within constraints: already shipped, no deps, no vocabulary
change; it's a framing.

## 3. Link/URL verification is craft, and worth a small automated cadence
Source: [Link Rot: 66.5% of Links Are Dead — Analyze.ai study](https://www.tryanalyze.ai/blog/link-rot-study)
and [How to Monitor Broken Links — Semonto (2026)](https://semonto.com/blog/how-to-monitor-broken-links-12-seo-best-practices-2026).

**Insight:** link rot is *structural*, not exceptional — ~66.5% of backlinks studied
were dead, social links decay ~30% within two years, and 38% of 2013 webpages were
gone by 2023. The recurring best-practice conclusion: verification is *ongoing
maintenance on a cadence*, not a one-time task. A site with dead media/links reads as
abandoned; a site whose links resolve reads as maintained and credible.

**Apply here:** this is precisely what PRs #22/#23 did — the weekly enrichment run
*re-verifies that dataset media URLs actually resolve* rather than trusting them to
stay alive. On a closed-dataset portfolio where every `images[]`/`video` is a hard
promise the model will render, a rotted URL becomes a visibly broken generated card.
So verification isn't SEO hygiene here — it's protecting the honesty guarantee from
idea #1 (an unreachable URL is a quiet lie). The transferable insight: fold link
verification into the *same recurring loop* that enriches the data, so freshness and
integrity move together. Constraint check: already part of the scheduled agent
automation; no new tooling or deps. The story to tell is "the dataset is
re-verified weekly, not just added to."

## 4. A detail page earns depth with a prose↔metadata split, not more media
Source: [Progressive Disclosure — Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/)
(the "don't exceed two disclosure levels; make the primary/secondary split correct"
guidance), read alongside the shipped `designs/detail/` layout.

**Insight:** strong project-detail / case-study pages don't dump everything at one
depth — they separate the *narrative* (what it was, why it mattered) from the
*metadata* (role, collaborators, tags, tech) so a reader can skim the facts or read
the story, at one glance. NN/g's warning against deep nesting matters: a detail page
is the *one* place to go deep, so it should be legible in a single level, not a maze.

**Apply here:** PR #21's detail view already encodes this — a `<Grid cols={2}>` whose
first cell is the prose (`<Paragraph>` of the summary) and second cell is stacked
metadata blocks (Role / Collaborators / Tags), with the hero media above and a
supporting-image grid below (`route.ts:42`). The transferable observation for content:
the vocabulary is small enough (`Section`, `Stack`, `Grid`, `Heading level={4}` as the
label-caps, `Badge`) that a *rich, legible* case-study surface falls out of composition
— no bespoke "CaseStudy" primitive was added. That's a "small vocabulary > big
vocabulary" proof point worth naming: the detail view is composed, not special-cased.
Constraint check: no new primitive; `Heading level={4}` already doubles as the metadata
label style (`registry.tsx:214-216`).

## 5. Provenance-by-construction beats a disclosure badge
Source: [System and method for policy-constrained symbolic rendering of AI outputs (USPTO 12464027)](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12464027)
and [Disclosure By Design (arXiv 2603.16874)](https://arxiv.org/pdf/2603.16874).

**Insight:** the emerging distinction in the trust literature is between *disclosure*
(a label saying "AI generated") and *design* (a system that structurally can't emit
ungrounded output). Policy-constrained symbolic rendering — the model emits a
constrained symbolic form that a renderer interprets against an allow-list — is being
described as a way to *bound* what AI output can claim, rather than labelling it after
the fact. This is the exact shape of a semantic-vocabulary compiler.

**Apply here:** this is the sharpest positioning available and it's net-new: the whole
library *is* policy-constrained symbolic rendering. The model doesn't emit HTML it can
put anything into; it emits a closed vocabulary that the compiler resolves against a
registry, rejecting anything unsafe (single root, literals only, no arbitrary JSX).
Combined with the closed dataset, the portfolio is a working demonstration that "the
model can't say something untrue *because the medium won't carry it*." That's a much
stronger claim than a trust badge — it's provenance by construction. Fits "library-
agnostic core" and "strict by default." No code; it's the highest-order framing that
ties the compiler's safety story to the 2026 trust conversation.

## Next steps (PO)

Three candidate goals for the connected body of work (portfolio / library / Honest-DD), each scoped to the smallest change that delivers the outcome. This week the loop pushed on the *detail surface and data integrity* — rich detail view (PR #21), media isolation so a repo gets no fabricated video (PR #20), and weekly URL re-verification (PRs #22/#23). The mechanism is now genuinely honest by construction; the gap is that **the honesty guarantee is invisible to the visitor and untold in the library**. The leverage this week is to make provenance legible, not to build more.

Carry-forward note: last week's recommended goal — a first-screen line framing the page as generated UI — **did not ship** (confirmed: `apps/portfolio/app/page.tsx` still opens with placeholder "Ask me anything…" and no framing copy). It stays valid, but the goals below are net-new and grounded in this week's honesty work; the framing line is better folded into #1 than repeated verbatim, since the strongest first-screen message is now *"generated live AND can't lie"*, not just "generated live."

- **[Recommended] Portfolio — say the honesty guarantee out loud in one quiet first-screen line (digest ideas #1 + #5).** The architecture already enforces "the model can only render what's true" — closed dataset, media covered by the same rule (`apps/portfolio/app/api/generate/route.ts:35-36`), compiler rejects anything off-vocabulary — but a visitor has no way to know it. Add a single fading landing-state line near the input that states both halves at once, e.g. "Everything below is real UI, generated live from a small semantic vocabulary — and grounded only in facts that actually exist, never invented." This also discharges last week's unshipped thesis line. *Why now:* the media-isolation + re-verification work (PRs #20/#22/#23) just made the guarantee airtight, so it's finally a claim you can make without hedging; provenance-by-construction is the sharpest 2026 positioning and it's currently silent. *Acceptance:* on the deployed landing state, before typing, a visitor sees one sentence naming the page as generated-and-grounded UI; it fades once a conversation starts; portfolio-shell only, no new vocabulary primitive, no dependency, no dataset change.

- **Library — add a "Provenance & safety" framing to the core README that names what the compiler already guarantees (digest #5).** The README's `## Safety` section (`packages/core/README.md:100-102`) describes the mechanism ("rejects anything off-vocabulary") but not the *property* it delivers: policy-constrained symbolic rendering — the model emits a closed vocabulary a renderer resolves against an allow-list, so it structurally cannot emit ungrounded output. Reframe/extend that section to state the property, tying the compiler's strictness to the trust conversation (disclosure-by-design, not a disclosure badge). *Why now:* the portfolio is now a working proof of this exact claim, so the library can assert it truthfully instead of aspirationally; it converts a shipped architectural fact into adoptable positioning. *Acceptance:* `packages/core/README.md` gains a short paragraph under Safety framing the compiler as provenance-by-construction (constrained symbolic rendering over an allow-list); docs only, no code, no vocabulary change.

- **Honest-DD — surface HDD + the weekly re-verification cadence as the method behind the repo's own integrity (digest #3, carry-forward from last week).** Still unshipped: the root README has no Honest-DD section (confirmed) and nothing connects "this site was built spec-first, and its data is re-verified weekly, using my own tooling." Add a brief root README section linking `honest-dd` as the spec workflow behind `.hdd/` and naming the scheduled re-verification loop as the integrity practice that keeps a closed dataset from quietly rotting. *Why now:* PRs #22/#23 turned "verify links once" into a *recurring* discipline — link rot is structural (~66.5% dead), so a maintained-on-a-cadence dataset is itself a credibility signal worth claiming, and it ties the three threads (DSL, portfolio, HDD) into one self-referential story. *Acceptance:* root `README.md` gains a short Honest-DD section pointing at `.hdd/` + the published package and naming the weekly dataset re-verification cadence; docs only.

Deliberately **out of scope** for all three: any new vocabulary primitive (the detail view proved a rich case-study surface composes from the existing set — do not add a `CaseStudy`/`Timeline` primitive); the queued Card `glass` variant (separate ready spec at `.hdd/specs/2026-05-26-card-glass-variant.md`); any change to the closed dataset's contents or the media fallback ladder (already correct per PR #20); and any backdrop/motion work — the honesty story is told in copy and docs this week, not in the Canvas.
