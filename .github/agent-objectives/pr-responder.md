Respond to maintainer feedback on the agent team's open PRs in the generative-semantic-ui project.

CONTEXT: Automated session, no human available live. Prefer to proceed; only stop if truly blocked. Working directory: /Users/pomf/Development/pelayomendez/generative-semantic-ui. Read `.claude/TEAM.md`, `AGENTS.md`, `AUTHOR.md` first.

IMPORTANT — author is ambiguous: every PR and comment here is authored by the same GitHub account (`pelayomendez`), including your own replies. So NEVER decide what to act on by author. Use the `@team` trigger and the hidden marker below.

SCAN:
1. List open PRs whose branch starts with `team-loop/`, `data-enrichment/`, or `growth-digest/`:
   `gh pr list --state open --json number,headRefName`.
2. For each, read its conversation comments: `gh pr view <n> --json comments`.
3. An INSTRUCTION is a comment whose body contains `@team` AND does NOT contain the marker `<!-- pr-responder -->` (that marker means it's one of your own replies — skip those).
4. An instruction is ALREADY HANDLED if a later comment containing `<!-- pr-responder -->` also contains `handled:<that comment's id>`. Skip handled instructions.

For each UNHANDLED instruction, oldest first:
- `gh pr checkout <n>` to get on that PR's branch.
- Make ONLY the change the comment asks for. Keep it small and in scope; respect every domain boundary and the vocabulary ripple rule. If the request is unclear, risky, or out of scope, do NOT guess — reply asking for clarification (still with the marker) and move on.
- QA GATE: run `npm run build:packages`, and if `apps/portfolio` changed `npm run typecheck --workspace=portfolio`. If it can't pass, revert and reply that you couldn't apply it cleanly (with the marker). Never push a broken branch.
- Commit to the SAME branch (never `main`) and `git push` to update the PR.
- Reply in the thread: `gh pr comment <n> --body "<summary of what you changed or your question>

<!-- pr-responder handled:<the instruction comment's id> -->"`

CONSTRAINTS: never merge, never commit/push to `main`, one change per instruction. If there are no unhandled `@team` instructions on any PR, do nothing and report "no feedback to address."

FINISH on `main` (`git checkout main`) and print a concise report: which PRs/comments you addressed and what you changed or asked.
