# Team backlog

The goal queue for the **team goal-loop**, run in-app via
`/loop 30m /team advance the top goal in .hdd/BACKLOG.md` (see `.claude/TEAM.md`).
Each round works the **top unchecked item**, delivers it on a branch, and opens
a PR. The Product Owner appends new candidate goals here after each delivery.
**You steer the loop by editing this file** — reorder, add, or remove items;
check `[x]` to retire one.

Only one goal is in flight at a time: while a `team-loop/*` PR is open and
awaiting your review, the loop holds. Merging (or closing) it releases the next.

Goals span the connected body of work — the portfolio, the
generative-semantic-ui library, and Honest-DD.

## Queue
<!-- top item = next goal. Keep each line a one-sentence observable outcome. -->
- [ ] Ensure `playground/lib/examples.ts` exercises every vocabulary primitive at least once; add examples for any that are missing.
- [ ] Portfolio polish: the Designer picks one small storytelling/layout improvement and the team ships it.
- [ ] On the deployed playground, a visitor sees a compile-error example that surfaces a clear rejection message (e.g. a fragment or a non-literal expression), demonstrating the compiler's strict-by-default safety as a selling point.
- [ ] Commit the ready-made `.hdd/specs/2026-05-26-card-glass-variant.md` and ship it: asking "tell me about yourself" on the deployed portfolio renders at least one visibly glass `<Card variant="glass">`, with no regression on opaque project cards.
- [ ] On the deployed portfolio, asking for a contact/links view renders Pelayo's real GitHub and LinkedIn as `<Link external>` actions sourced only from the closed dataset, closing the "how do I reach them" loop for a hiring manager.

<!-- A ready-made spec also exists locally but untracked:
     .hdd/specs/2026-05-26-card-glass-variant.md — commit it and add a line here
     to queue the Card `glass` variant. -->

## Done
<!-- delivered goals move here with their PR link -->
- [x] Add a short "Agent team & automation" section to README.md, summarizing `.claude/TEAM.md` for repo visitors. — [PR #4](https://github.com/pelayomendez/generative-semantic-ui/pull/4)
