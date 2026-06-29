# Growth ideas — generative navigation, the GenUI spectrum & building in public (2026-06-29)

Net-new transferable ideas for this week, drawn from current (2026) generative-UI
writing, devtool landing-page research, and conversational-UX work. Filtered
through this repo's constraints: small semantic vocabulary, generative aesthetic,
library-agnostic core, minimal deps. Drafts only.

Distinct from the 2026-06-24 digest (which covered: lead-with-demo, code-as-
storytelling, signature motion, featured projects with try-it links). No overlap
intended here.

## 1. Place the library on the "generative UI spectrum" — and own the strict end
Source: [The Generative UI Spectrum — Medium (May 2026)](https://medium.com/@mail2mhossain/the-generative-ui-spectrum-controlled-declarative-and-open-ended-ai-interfaces-explained-2663335cdbdb)
and [CopilotKit — Developer's Guide to Generative UI in 2026](https://www.copilotkit.ai/blog/the-developer-s-guide-to-generative-ui-in-2026).

**Insight:** the field has settled on a three-way frame — *controlled* (agent picks
from pre-built components + data), *declarative* (agent emits a schema/vocabulary,
renderer interprets), *open-ended* (agent emits raw HTML/iframes). The tradeoff is
stated plainly: safety and consistency require *closing* the vocabulary; flexibility
requires opening it. Open-ended is non-deterministic and unsafe by design.

**Apply here:** this is the missing vocabulary for explaining the project to a 2026
audience that now has a mental model to slot it into. It sits exactly at the
*declarative* point — the LLM emits an allow-listed semantic schema (Card, Hero,
Section…), and the compiler interprets it into real React via adapters. That's the
one-sentence positioning: "declarative generative UI with a strict, library-agnostic
contract." No new code, no new deps — just naming where it lives so the safety story
(single root, literals only, no arbitrary JSX) reads as a deliberate design choice
rather than a limitation. Fits the "semantic, not visual" and "library-agnostic core"
principles directly.

## 2. Generated UI as navigation = path-based breadcrumbs, not site breadcrumbs
Source: [Pencil & Paper — Breadcrumbs UX](https://www.pencilandpaper.io/articles/breadcrumbs-ux)
and [Eleken — UX Breadcrumbs in 2026](https://www.eleken.co/blog-posts/breadcrumbs-ux).

**Insight:** there are two breadcrumb species. *Hierarchy* breadcrumbs show where a
page sits in a tree; *path-based* breadcrumbs show the route a user actually took —
their "intellectual journey" through an exploratory space. Path-based is the right
model for "heavily interactive experiences" and is explicitly called out as emerging
in AI conversation interfaces, "where showing the entire path of reasoning adds
transparency."

**Apply here:** this is precisely what shipped (PR #15) — but the framing matters. The
breadcrumb trail across card-driven navigation (PR #10's clickable cards) is *not* a
sitemap; the portfolio has no fixed pages. It's a path-based trail over a generated,
exploratory surface. That's a genuinely uncommon thing to have built and is worth
naming as such: a breadcrumb that records a *conversation's* path, not a hierarchy.
Constraint check: it's already implemented, no new deps; the only opportunity is to
make sure the trail reads as "where you've been" (truncate/collapse the middle on
narrow widths, per the mobile-overflow caution both sources raise) rather than as a
static menu.

## 3. The conversation-history failure mode is the problem this navigation solves
Source: [Anthropic claude-code issue #37273 — context compaction removes scrollable history](https://github.com/anthropics/claude-code/issues/37273)
and [Fuselab — Chatbot UI Patterns 2026](https://fuselabcreative.com/chatbot-interface-design-guide/).

**Insight:** a recurring, current pain in chat UIs is that users lose the thread —
either the session resets, or context compaction silently deletes scrollable history,
so people can't return to "what was said / what was decided." The 2026 expectation is
that users can scroll back, resume, and re-enter earlier branches.

**Apply here:** the connected feature set (clickable cards → follow-up prompt, the
breadcrumb trail, and click-the-name → reset to landing, PRs #8/9/10/15) is, read
together, a direct answer to this failure mode. The portfolio turns *generated output
itself* into the navigation surface — so the "thread" is never lost in a scrollback;
it's a reversible, clickable path. This is a substance angle for posts: not "look,
breadcrumbs," but "chat UIs lose your place; here the generated UI *is* the map." No
code implication — it reframes what's already shipped as solving a named, current
problem.

## 4. Devtool landing pages: "live product embed" hero + problem-first copy
Source: [Evil Martians — We studied 100 devtool landing pages (what works)](https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025).

**Insight:** ranked hero strategies — animated product UI and *live product embeds*
beat static screenshots and feature lists; a live embed is "a power move if you can
pull it off" for narrow-scope tools. On copy: generic feature lists are weakest;
*problem-oriented storytelling that surfaces a pain point* is strongest. "No salesy BS;
clever and simple wins." For OSS specifically: "open source users are users, too" —
GitHub metrics and community signals belong in the trust section.

**Apply here:** the portfolio already is a live embed (the chat generates real UI), so
that box is checked — the transferable move is the *copy*. Open the playground/portfolio
with the pain point, not the mechanism: lead with "AI can write code but can't safely
render UI" (problem-first), then show the live surface answering it. Within constraints,
no redesign needed — this is hero/intro copy, not a new dependency. Pairs with idea #1:
the spectrum framing supplies the "why strict" half of the problem statement.

## 5. Building in public via the changelog of merged PRs (a green-light signal)
Source: [Evil Martians — devtool landing pages](https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025)
(the "narrow horizontal block of recent changelog entries signals we're alive, we're
shipping") and [BuildPilot — Building in Public guide (2026)](https://trybuildpilot.com/412-building-in-public-guide-developers-2026).

**Insight:** buyers/visitors do due diligence on whether a tool is *alive* before they
commit. An empty feed is a red flag; a steady drumbeat of shipped changes is a green
light. Building in public — sharing the wins and the process — is now the default
indie/small-team motion, and transparency about *how* something is built builds more
trust than polish.

**Apply here:** the differentiator is unusually strong and now *true*: this repo is
maintained by an autonomous Claude Code agent team (PO, designer, DSL specialist, QA,
plus an independent adversarial reviewer; worktree isolation; pulls goals from a backlog
and opens PRs). With several merged PRs (#8–#15), the "build in public" story is real
and specific, not aspirational. The transferable move is to treat the merged-PR stream
*as* the changelog/proof — point at concrete PRs ("clickable cards," "breadcrumb trail")
rather than claiming velocity. Constraint check: minimal-deps friendly — the "changelog"
is just the Git history that already exists; no tooling to add. This is the strongest
net-new build-in-public material this week.

## Next steps (PO)

Three candidate goals for the connected body of work (portfolio / library / Honest-DD), each scoped to the smallest change that delivers the outcome. The recent loop has driven hard on navigation (clickable cards, breadcrumbs, name-reset) and detail-view fidelity — the story is now *navigable* but the **thesis itself** ("this UI is generated live by a tiny DSL") is still implicit, and the connected projects (library, HDD) aren't yet legible from the showcase.

- **[Recommended] Portfolio — make the live-generation thesis legible in the first 3 seconds.** Seed chips already exist (`apps/portfolio/app/page.tsx:22`), but nothing tells a hiring manager *why the UI moves the way it does*. Add a single, quiet first-screen line near the input — e.g. "Every answer below is real UI, generated live from a ~15-word semantic vocabulary" — that fades once a conversation starts. *Why now:* navigation is solved, so the next leverage is comprehension; the medium is the message and right now a visitor can miss that the whole page is the demo. *Acceptance:* on the deployed landing state, before typing, a visitor sees one sentence framing the page as generated UI; after the first answer renders it is gone; no new vocabulary primitive, portfolio-shell only.

- **Library — document the navigable-UI contract so the DSL reads as a real product, not just a portfolio trick.** The `onClick`+literal-`prompt` action contract and the host-side history/breadcrumb pattern now power the portfolio but are undocumented in `packages/core`'s README (two queued backlog items, lines 27 and 30). Fold them into one concise recipe with a ~50-LOC "register an `ask` action" snippet. *Why now:* the portfolio just proved the pattern; capturing it turns shipped behaviour into adoptable library value and reinforces the library-agnostic-core principle (host owns the action, core stays unaware). *Acceptance:* `packages/core/README.md` gains a "navigable LLM UIs" section showing `registerAction("ask", …)` + a minimal history-stack snippet; docs only, no code or vocabulary change.

- **Honest-DD — surface HDD as the method behind this very repo.** It exists in the dataset (`apps/portfolio/lib/data/portfolio.ts:329`) and drives `.hdd/`, but nothing connects "this site was built spec-first with my own tool" for a visitor. Add a short README section (backlog line 26) linking `honest-dd` as the spec workflow behind `.hdd/`, framed as "the portfolio you're reading was built this way." *Why now:* it ties the three threads (DSL, portfolio, HDD) into one self-referential story — strong positioning signal, near-zero maintenance. *Acceptance:* root `README.md` gains a brief Honest-DD section pointing at `.hdd/` and the published package; docs only.

Deliberately **out of scope** for all three: any new vocabulary primitive, the queued Card `glass` variant (separate ready spec at `.hdd/specs/2026-05-26-card-glass-variant.md`), and the backdrop "pulse on generation" idea (a nice-to-have that touches the hand-rolled Canvas and risks scope creep against limited bandwidth).
