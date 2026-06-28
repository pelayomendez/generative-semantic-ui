Independently, adversarially review the agent team's open PRs in the generative-semantic-ui project. Working repo: /Users/pomf/Development/pelayomendez/generative-semantic-ui

CONTEXT: You are the INDEPENDENT reviewer (use the `team-reviewer` agent). You did NOT write this code — assume it is BROKEN until proven. Read `AGENTS.md`, `AUTHOR.md`, `.claude/TEAM.md` first. You may run commands and fetch the web, but you NEVER edit code, push, merge, or close PRs — you only comment a verdict.

SELECT: `git -C <repo> fetch origin`. For each OPEN PR whose branch starts with `team-loop/` (`gh pr list --state open --json number,headRefName,title,headRefOid`):
- Skip it if it already has a conversation comment containing `<!-- pr-reviewer` whose `commit:<sha>` matches the PR's current head SHA (already reviewed, unchanged).

REVIEW (in an ISOLATED WORKTREE — never touch the main checkout):
- `WT="$HOME/.cache/gsui-wt/review-<pr-number>"; git -C <repo> worktree add --detach "$WT"; cd "$WT"; gh pr checkout <n>`.
- `ln -sfn <repo>/node_modules "$WT/node_modules"` so the build tools resolve (run `npm ci` in "$WT" only if a tool is still missing).
- Verify by ACTING, pasting real output:
  1. `npm run build:packages` (+ `npm run typecheck --workspace=portfolio` if apps/portfolio changed). Fail ⇒ REJECT.
  2. If the PR references a `.hdd/specs/*` spec, check the diff against EACH acceptance criterion.
  3. Get the Vercel preview URL (vercel bot comment / `gh pr view`), `WebFetch` it, confirm it loads and reflects the change.
  4. Ripple completeness for any vocabulary change (prompt + all 3 adapters + playground example). Partial ⇒ REJECT.
- Clean up: `cd <repo>; git worktree remove --force "$WT"`.

VERDICT: `gh pr comment <n> --body "<PASS or REJECT + each concrete reason>\n\n<!-- pr-reviewer verdict:PASS|REJECT commit:<head sha> -->"`. PASS only if every check holds; otherwise REJECT with reasons. NEVER merge/push/close — the human decides; your verdict just informs them.

FINISH: a concise report — each PR number, verdict, and the key reasons.