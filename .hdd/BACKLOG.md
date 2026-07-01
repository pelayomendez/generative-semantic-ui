# Team backlog

The goal queue for the **team goal-loop**, run by scheduled day/night turns
(Claude Desktop scheduled tasks; see `.claude/TEAM.md`). Each round works the
**top unchecked item**, delivers it on a branch, and opens a PR. The Product
Owner appends new candidate goals here after each delivery.
**You steer the loop by editing this file** — reorder, add, or remove items;
check `[x]` to retire one.

Only one goal is in flight at a time: while a `team-loop/*` PR is open and
awaiting your review, the loop holds. Merging (or closing) it releases the next.

Goals span the connected body of work — the portfolio, the
generative-semantic-ui library, and Honest-DD.

## Queue
<!-- top item = next goal. Keep each line a one-sentence observable outcome. -->
- [ ] Asymmetric layout in the DSL: a `<Grid>` child can carry a column weight/span so a row can be ~8/4 (prose↔meta) or an asymmetric bento — unblocks the full `designs/detail/` fidelity that the even `cols={2}` split approximates today. <!-- DSL Specialist, SPEC-FIRST, VOCABULARY CHANGE → ripples to prompt + all adapters + playground examples. Smallest viable: a `span?: 1|2|3` (or `weight`) prop on a grid child, mapped to col-span in each adapter. Then update the portfolio project-detail few-shot/route to use 8/4. -->
- [ ] The project-detail hero + supporting media adopt the design's monochrome treatment — a subtle grayscale that restores colour on hover — matching the `designs/detail/` "clean-room lab" aesthetic. <!-- App Developer, portfolio adapter only (Image/Video in apps/portfolio/lib/adapter/registry.tsx). Pure styling; no new vocabulary, no core ripple. Builds on the just-shipped glass-framed media. -->
- [ ] The "selected work" gallery cards share the project-detail glass-framing language so gallery and detail views read as one system. <!-- Designer + App Developer, portfolio adapter only (Card in apps/portfolio/lib/adapter/registry.tsx). Harmonise the card cover/surface with the new glass Image frame; no new vocabulary, no core ripple. -->
- [ ] The portfolio speaks in a clearly-defined, consistent FIRST-PERSON voice — Pelayo's: creative-coder + literary, warm, precise, a little poetic; never corporate or hypey — codified so generated answers don't drift in tone. <!-- PO defines it, App Developer applies it. Distil a short, explicit VOICE guide (tone, person, do/don't, sample phrasings — sourced from AUTHOR.md) into a single committed source (e.g. apps/portfolio/lib/voice.ts) and inject it into the portfolio system prompt (apps/portfolio/app/api/generate/route.ts); make the few-shots (apps/portfolio/lib/few-shots.ts) exemplify it. No core ripple — portfolio system-prompt only. -->
- [ ] On the deployed portfolio, follow-ups are CONTEXT-AWARE: after "tell me about you", saying "tell me more" continues from the previous answer, and each answer offers 1–3 contextual next-step prompts the visitor can click to go deeper. <!-- App Developer + system-prompts. (a) Carry recent history: page.tsx keeps the last ~2 turns and posts them to /api/generate; route.ts includes them so "tell me more" resolves against context (reuses the breadcrumbs history stack). (b) The generated answer ends with contextual follow-up Buttons/Cards via the shipped `onClick="ask"` + literal-prompt contract — no new vocabulary. Mind Mistral token cost: cap history to ~2 turns. No core ripple. -->
- [ ] Ensure `playground/lib/examples.ts` exercises every vocabulary primitive at least once; add examples for any that are missing.
- [ ] Portfolio polish: the Designer picks one small storytelling/layout improvement and the team ships it.
- [ ] Library: add a "write your own adapter in ~50 LOC" example to `packages/core`'s README.
- [ ] Honest-DD: add a short section to README linking `honest-dd` as the spec workflow behind `.hdd/`.
- [ ] On the deployed portfolio, an interactive Card shows a subtle affordance cue (e.g. a small "Ask ↗" hint that reveals on hover) so visitors discover cards are clickable — today only the cursor/hover signals it. <!-- App Developer only. NO core ripple — portfolio adapter Card in apps/portfolio/lib/adapter/registry.tsx (the new `interactive` branch). Keep the cue inside the existing motion.div; no new prop, infer from `onClick` presence. -->
- [ ] Library: document the `onClick`+`prompt` navigation contract (Card/Button dispatch an action with a literal prompt payload) in `packages/core`'s README, with a tiny "host registers an `ask` action" snippet. <!-- DSL Specialist. Docs only; mirror the wiring in apps/portfolio/app/page.tsx. -->
- [ ] On the deployed portfolio, answers are shareable/bookmarkable: the current step syncs to the URL (e.g. `?ask=…`) and the browser Back button walks the breadcrumb trail one step at a time. <!-- App Developer, portfolio-shell only: apps/portfolio/app/page.tsx — push a history entry per `ask`, restore from `popstate`/initial query, reuse the existing history stack + goTo. Pairs with the just-shipped breadcrumb trail. No core ripple. -->
- [ ] On narrow screens, a long breadcrumb trail collapses its middle steps to `Home › … › current` (the `…` expands on tap) so the trail never wraps past one line. <!-- App Developer, portfolio-shell only: the Breadcrumbs component in apps/portfolio/app/page.tsx. Pure presentational refinement of the shipped trail. No core ripple. -->
- [ ] Library: add a "building navigable LLM UIs" recipe to `packages/core`'s README — the `registerAction("ask", …)` + host-side history-stack/breadcrumb pattern that turns generated cards into a navigable trail. <!-- DSL Specialist, docs only. Distils the portfolio's page.tsx wiring into a reusable recipe; complements the onClick+prompt contract doc. -->
- [ ] A repo detail answer turns a `published: "npm: <pkg>"` field into a clickable npm `<Link external={true}>` (https://www.npmjs.com/package/<pkg>) alongside the GitHub link — today it's inert text. <!-- App Developer + system-prompts. Tighten the just-shipped specific-repo rule in apps/portfolio/app/api/generate/route.ts + repoDetailSample in lib/few-shots.ts to parse the `npm: ` prefix into a package link. No core ripple. -->
- [ ] Library: generalise the media-safety fix into the shared contract — add one line to `DEFAULT_PROMPT_RULES` stating a `<Video>`/`<Image>` src must belong to the entry being rendered, never borrowed/invented. <!-- DSL Specialist, packages/core/src/prompt.ts. Prompt rules only; no new vocabulary, no adapter ripple. Lifts the portfolio's repo-media fix up to the library contract. -->
- [ ] After drilling into a single project or repo, the detail view ends with a "← Back to all work" affordance (a `<Button>`/`<Card>` with `onClick="ask"` + a literal "show your work"/"your open source" prompt) so a visitor can resurface without the breadcrumb. <!-- App Developer + system-prompts, portfolio only. Reuses the shipped onClick+prompt contract; no new vocabulary, no core ripple. -->
- [ ] Link-rot is caught automatically, not by a manual goal: fold a media + external-link HEAD-check into the daily `portfolio-data-enrichment` task so dataset 404s are flagged in its PR. <!-- App Developer + automation. Extend `.github/agent-objectives/portfolio-data-enrichment.md` to HEAD-check `pelayomendez.dev/img` images, local /public assets, and openSource `href`s; remember GitHub 404≠broken for PRIVATE repos (confirm with `gh api repos/...`), Vimeo 403 / LinkedIn 999 are bot-blocks not breakage. No core ripple. -->
<!-- delivered 2026-06-30 (pm): media-URL integrity re-verify (all resolve; flagged 3 private-repo links) → branch team-loop/2026-06-30-pm -->
<!-- delivered 2026-06-30: project-detail design-reference fidelity → branch team-loop/2026-06-30; spec .hdd/specs/2026-06-30-project-detail-fidelity.md -->
<!-- delivered 2026-06-28: clicking an interactive Card sends a follow-up prompt → spec .hdd/specs/2026-06-28-interactive-card-prompt.md -->
<!-- delivered 2026-06-29 (pm): repo/project detail media isolation (no fabricated video) → branch team-loop/2026-06-29-pm -->
<!-- delivered 2026-06-28 (pm): breadcrumb / history trail → branch team-loop/2026-06-28-pm -->

<!-- A ready-made spec also exists locally but untracked:
     .hdd/specs/2026-05-26-card-glass-variant.md — commit it and add a line here
     to queue the Card `glass` variant. -->

## Done
<!-- delivered goals move here with their PR link -->
- [x] Add a short "Agent team & automation" section to README.md (2026-06-24, branch `team-loop/2026-06-24`).
- [x] Title click resets the portfolio to its initial landing state (2026-06-26, branch `team-loop/2026-06-26`).
- [x] Clicking an interactive Card sends a follow-up prompt to the chat and renders the answer — generated cards become navigation (2026-06-28, branch `team-loop/2026-06-28`; spec `.hdd/specs/2026-06-28-interactive-card-prompt.md`).
- [x] A breadcrumb / history trail shows the path taken across card-driven drill-downs and lets the visitor click any prior step to return to it (2026-06-28, branch `team-loop/2026-06-28-pm`).
- [x] FIX: a detail view shows ONLY its own entry's media — repos drill into a text + tags + GitHub-link card (no video/image), projects render only their OWN `video`/`images[]`; the model can no longer fabricate another entry's Vimeo video (2026-06-29, branch `team-loop/2026-06-29-pm`). Added `repoDetailSample` few-shot + a specific-repo rule + a closed-dataset-covers-MEDIA hard rule in `apps/portfolio/app/api/generate/route.ts`.
- [x] A PROJECT detail answer matches the `designs/detail/` reference — hero media (own `<Video>`/`images[0]`), title with year · location, a prose↔meta split surfacing **collaborators** (never rendered before) + role + tags, supporting `images[1..]` in a glass-framed grid (2026-06-30, branch `team-loop/2026-06-30`; spec `.hdd/specs/2026-06-30-project-detail-fidelity.md`). Portfolio-only: `detailSample` few-shot, glass-framed standalone `<Image>` + decoupled `<Card>` cover + `level={4}` label styling in the adapter, and the specific-project route rule. True 8/4 asymmetry + bento deferred to the new asymmetric-layout vocabulary goal.
- [x] Verify every dataset media URL resolves (2026-06-30, branch `team-loop/2026-06-30-pm`). Re-verified: 22 remote `pelayomendez.dev/img` images = HTTP 200, 16 local `/public` assets present (15 `/projects/*` + `/portrait.jpg`), 15 Vimeo IDs unique & well-formed. No media 404 — dataset unchanged. Separately flagged (queued, not fixed — product decision): 3 `openSource` `href`s point to PRIVATE repos (`articlelang-studio`, `thamyris-judgment`, `fablechat`) → visitor 404; LinkedIn 999 / Vimeo 403 are bot-blocks, not breakage.
- [x] No visitor-facing 404 from openSource links (2026-07-01). The 3 PRIVATE repos (`articlelang-studio`, `thamyris-judgment`, `fablechat`) had their 404-ing `href` swapped for `private: true` in `portfolio.ts`; the repo-detail route rule now omits the GitHub link for a private entry. Reversible — publish a repo, then restore its `href` + drop the flag.
