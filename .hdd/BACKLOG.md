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
- [ ] On the deployed portfolio, clicking the site name/title in the header returns the visitor to the initial landing state (intro + suggestion chips + empty, focused input), as if freshly loaded. <!-- App Developer; shell-only (apps/portfolio/app/page.tsx — reset current/draft/error/loading). No vocabulary impact. Quick win. -->
- [ ] On the deployed portfolio, clicking an interactive Card sends a follow-up prompt to the chat and renders the generated answer (generated cards become navigation). <!-- DSL Specialist (lead) + App Developer. VOCABULARY RIPPLE — give it its OWN SPEC first, not a drive-by. PO approach A: allow `onClick` on Card + a literal prompt-carrying prop, dispatched via the existing actions payload (dispatchAction already takes one); portfolio registers an `ask` action wired to Page's ask(). Ripple together: prompt.ts + shadcn + html + portfolio adapters + a playground example. Lock the prompt-prop name in the spec; keep it semantic; apply uniformly to Button too. -->
- [ ] Ensure `playground/lib/examples.ts` exercises every vocabulary primitive at least once; add examples for any that are missing.
- [ ] Portfolio polish: the Designer picks one small storytelling/layout improvement and the team ships it.
- [ ] Library: add a "write your own adapter in ~50 LOC" example to `packages/core`'s README.
- [ ] Honest-DD: add a short section to README linking `honest-dd` as the spec workflow behind `.hdd/`.

<!-- A ready-made spec also exists locally but untracked:
     .hdd/specs/2026-05-26-card-glass-variant.md — commit it and add a line here
     to queue the Card `glass` variant. -->

## Done
<!-- delivered goals move here with their PR link -->
- [x] Add a short "Agent team & automation" section to README.md (2026-06-24, branch `team-loop/2026-06-24`).
