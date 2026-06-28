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
- [ ] On the deployed portfolio, project/repo detail answers render the project's secondary `images[]` (beyond the cover) per the `designs/detail/` reference, and every dataset media URL is verified to resolve. <!-- App Developer + Designer. (a) DATA INTEGRITY: HEAD-check the ~18 remote `pelayomendez.dev/img` images + covers; flag/fix any 404. (Verified 2026-06-28: all local /projects/* + /portrait present; sampled remote = 200; Vimeo embed URLs can't be curl-checked — 403 ≠ broken — so just sanity-check IDs.) (b) ENHANCE: surface `images[1..]` in the detail view via the portfolio few-shots (detailSample in apps/portfolio/lib/few-shots.ts) + adapter Image/Grid styling, echoing apps/portfolio/designs/detail/. Pairs with the editorial-detail goal. No core ripple. -->
- [ ] The portfolio speaks in a clearly-defined, consistent FIRST-PERSON voice — Pelayo's: creative-coder + literary, warm, precise, a little poetic; never corporate or hypey — codified so generated answers don't drift in tone. <!-- PO defines it, App Developer applies it. Distil a short, explicit VOICE guide (tone, person, do/don't, sample phrasings — sourced from AUTHOR.md) into a single committed source (e.g. apps/portfolio/lib/voice.ts) and inject it into the portfolio system prompt (apps/portfolio/app/api/generate/route.ts); make the few-shots (apps/portfolio/lib/few-shots.ts) exemplify it. No core ripple — portfolio system-prompt only. -->
- [ ] On the deployed portfolio, follow-ups are CONTEXT-AWARE: after "tell me about you", saying "tell me more" continues from the previous answer, and each answer offers 1–3 contextual next-step prompts the visitor can click to go deeper. <!-- App Developer + system-prompts. (a) Carry recent history: page.tsx keeps the last ~2 turns and posts them to /api/generate; route.ts includes them so "tell me more" resolves against context (reuses the breadcrumbs history stack). (b) The generated answer ends with contextual follow-up Buttons/Cards via the shipped `onClick="ask"` + literal-prompt contract — no new vocabulary. Mind Mistral token cost: cap history to ~2 turns. No core ripple. -->
- [ ] Ensure `playground/lib/examples.ts` exercises every vocabulary primitive at least once; add examples for any that are missing.
- [ ] Portfolio polish: the Designer picks one small storytelling/layout improvement and the team ships it.
- [ ] Library: add a "write your own adapter in ~50 LOC" example to `packages/core`'s README.
- [ ] Honest-DD: add a short section to README linking `honest-dd` as the spec workflow behind `.hdd/`.
- [ ] On the deployed portfolio, asking about a specific project/repository renders an editorial detail view — hero media, title with year/location, a split of summary prose and structured metadata (role, collaborators, tags), and supporting media — echoing `apps/portfolio/designs/detail/`. <!-- Designer + App Developer. NO core ripple: do it via the portfolio system prompt few-shots (detailSample/reposSample in apps/portfolio/lib/few-shots.ts + the specific-project/repos rules in app/api/generate/route.ts) + portfolio adapter styling (Card/Image/Section/Grid/Badge in lib/adapter/registry.tsx). Surface collaborators + secondary images[] + repo href/published — all already in the dataset, invent nothing. Reference: apps/portfolio/designs/detail/{code.html,screen.png} + designs/DESIGN.md. Defer true asymmetric bento / spec-table primitive (that WOULD be a vocabulary change → escalate to DSL Specialist separately). -->
- [ ] On the deployed portfolio, an interactive Card shows a subtle affordance cue (e.g. a small "Ask ↗" hint that reveals on hover) so visitors discover cards are clickable — today only the cursor/hover signals it. <!-- App Developer only. NO core ripple — portfolio adapter Card in apps/portfolio/lib/adapter/registry.tsx (the new `interactive` branch). Keep the cue inside the existing motion.div; no new prop, infer from `onClick` presence. -->
- [ ] Library: document the `onClick`+`prompt` navigation contract (Card/Button dispatch an action with a literal prompt payload) in `packages/core`'s README, with a tiny "host registers an `ask` action" snippet. <!-- DSL Specialist. Docs only; mirror the wiring in apps/portfolio/app/page.tsx. -->
- [ ] On the deployed portfolio, answers are shareable/bookmarkable: the current step syncs to the URL (e.g. `?ask=…`) and the browser Back button walks the breadcrumb trail one step at a time. <!-- App Developer, portfolio-shell only: apps/portfolio/app/page.tsx — push a history entry per `ask`, restore from `popstate`/initial query, reuse the existing history stack + goTo. Pairs with the just-shipped breadcrumb trail. No core ripple. -->
- [ ] On narrow screens, a long breadcrumb trail collapses its middle steps to `Home › … › current` (the `…` expands on tap) so the trail never wraps past one line. <!-- App Developer, portfolio-shell only: the Breadcrumbs component in apps/portfolio/app/page.tsx. Pure presentational refinement of the shipped trail. No core ripple. -->
- [ ] Library: add a "building navigable LLM UIs" recipe to `packages/core`'s README — the `registerAction("ask", …)` + host-side history-stack/breadcrumb pattern that turns generated cards into a navigable trail. <!-- DSL Specialist, docs only. Distils the portfolio's page.tsx wiring into a reusable recipe; complements the onClick+prompt contract doc. -->
<!-- delivered 2026-06-28: clicking an interactive Card sends a follow-up prompt → spec .hdd/specs/2026-06-28-interactive-card-prompt.md -->
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
