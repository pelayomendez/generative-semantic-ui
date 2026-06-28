/team Advance the team's goal backlog by exactly one goal.

CONTEXT: You are an automated loop step (a MORNING or PM turn) inside an open Claude Code session. Prefer to proceed without asking — only stop if truly blocked. Read `AGENTS.md`, `AUTHOR.md`, and `.claude/TEAM.md` first. Repo: /Users/pomf/Development/pelayomendez/generative-semantic-ui

CONCURRENCY (up to 2 goals in flight):
- `git -C <repo> fetch origin`. `gh pr list --state open --json number,headRefName,title` — if 2 or more `team-loop/*` PRs are already open, STOP (review queue full).
- Otherwise pick the goal: the FIRST unchecked `- [ ]` item in `origin/main`'s `.hdd/BACKLOG.md` Queue that is NOT already addressed by an open team-loop PR (compare item text to PR titles). Skip already-claimed goals so the morning and PM turns never build the same thing.
- If there is no unclaimed goal, have the PO propose 3 new goals into the Queue and open a PR with just that backlog change.

WORKTREE ISOLATION (so the two turns never collide in the shared checkout):
- Pick your branch: `team-loop/<today's date>` (MORNING turn) or `team-loop/<today's date>-pm` (PM turn).
- `WT="$HOME/.cache/gsui-wt/<branch>"; git -C <repo> worktree add -B <branch> "$WT" origin/main`.
- `ln -sfn <repo>/node_modules "$WT/node_modules"` so the QA gate's tools resolve (only run `npm ci` in "$WT" if a tool is still missing).
- Do ALL work inside "$WT" — never modify the main checkout's working tree.
- When done (success OR abort): `git -C <repo> worktree remove --force "$WT"`.

DELIVER via the full `/team` lifecycle (PO + Designer → Technical Planning, with DSL Specialist if core/vocabulary is involved → Implementation → QA Guard). Respect every domain boundary and the vocabulary RIPPLE rule (a vocabulary change updates prompt + all adapters + playground examples together). Write a proper `.hdd/specs/*` spec first if it's a vocabulary change. Keep the change SMALL and focused — one goal, no scope creep.

QA GATE (hard): `npm run build:packages` and, if `apps/portfolio` changed, `npm run typecheck --workspace=portfolio`. If it cannot pass cleanly, revert and STOP — never leave a broken branch.

CLOSE + GIT: in `.hdd/BACKLOG.md` move the delivered goal to Done and append the PO's 2–3 next candidates. Commit (NEVER to `main`), push the branch, open a PR `gh pr create --base main --assignee @me`. Verify `gh pr view <n> --json mergeable,mergeStateStatus`; if CONFLICTING (e.g. backlog overlaps the other open PR), merge `origin/main` and resolve only the trivial conflict, else close the PR with a note.

FINISH: a concise report — goal worked, files changed, QA result, PR link + mergeable status, next goals queued.