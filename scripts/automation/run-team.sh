#!/usr/bin/env bash
# Local team-automation runner. Executes one team objective headless via the
# logged-in Claude CLI (no ANTHROPIC_API_KEY needed), verifies, and opens a PR.
# Designed to be launched by launchd (minimal env) or by hand.
#
#   scripts/automation/run-team.sh <goal-loop|data-enrichment|growth-digest>
#
# Never pushes main; opens a branch + PR for review. See .claude/TEAM.md.
set -euo pipefail

JOB="${1:-}"
[ -n "$JOB" ] || { echo "usage: run-team.sh <goal-loop|data-enrichment|growth-digest>"; exit 2; }

# --- launchd-safe PATH: pick newest installed Node >=18 from nvm, then tools ---
NODE_BIN=""
for major in v22 v20 v18; do
  d="$(ls -d "$HOME"/.nvm/versions/node/${major}* 2>/dev/null | sort -V | tail -1 || true)"
  if [ -n "$d" ]; then NODE_BIN="$d/bin"; break; fi
done
export PATH="${NODE_BIN}:$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO"

LOG_DIR="$HOME/.claude/team-automation/logs"
mkdir -p "$LOG_DIR"
exec >>"$LOG_DIR/$JOB.log" 2>&1
echo ""
echo "===== $(date '+%Y-%m-%d %H:%M:%S') :: $JOB :: start ====="
echo "node: $(command -v node) ($(node -v 2>/dev/null)) | claude: $(command -v claude) | gh: $(command -v gh)"

# --- per-job config ---
case "$JOB" in
  goal-loop)
    OBJ=".github/agent-objectives/team-goal-loop.md"; PREFIX="team-loop"
    SINGLE_FLIGHT=1; VERIFY="npm run build:packages"; ADD_MODE="all" ;;
  data-enrichment)
    OBJ=".github/agent-objectives/portfolio-data-enrichment.md"; PREFIX="data-enrichment"
    SINGLE_FLIGHT=0; VERIFY="npm run typecheck --workspace=portfolio"; ADD_MODE="apps/portfolio/lib/data" ;;
  growth-digest)
    OBJ=".github/agent-objectives/growth-digest.md"; PREFIX="growth-digest"
    SINGLE_FLIGHT=0; VERIFY=":"; ADD_MODE="growth" ;;
  *) echo "unknown job: $JOB"; exit 2 ;;
esac

# --- sync main ---
git checkout main
git pull --ff-only || echo "warn: 'git pull --ff-only' failed; continuing on local main"

# --- single-flight gate (goal loop only): hold while a goal PR awaits review ---
if [ "$SINGLE_FLIGHT" = "1" ]; then
  INFLIGHT="$(gh pr list --state open --json headRefName \
    --jq "[.[] | select(.headRefName | startswith(\"$PREFIX/\"))] | length" 2>/dev/null || echo 0)"
  if [ "${INFLIGHT:-0}" -gt 0 ]; then
    echo "A $PREFIX/* PR is open and awaiting review — holding. Done."
    exit 0
  fi
fi

# --- deps (only if missing) ---
[ -d node_modules ] || npm ci

# --- snapshot pre-existing untracked files so we never sweep them into a PR ---
BEFORE="$(mktemp)"; AFTER="$(mktemp)"
trap 'rm -f "$BEFORE" "$AFTER"' EXIT
git ls-files --others --exclude-standard | sort >"$BEFORE"

# --- run the team headless (logged-in session; no API key) ---
if ! claude -p "$(cat "$OBJ")" --model sonnet --dangerously-skip-permissions --verbose; then
  echo "claude run failed"; exit 1
fi

# --- verify; on failure, revert tracked edits + remove only newly-created files ---
if ! eval "$VERIFY"; then
  echo "verify failed ($VERIFY) — discarding this run's changes"
  git checkout -- . 2>/dev/null || true
  git ls-files --others --exclude-standard | sort >"$AFTER"
  comm -13 "$BEFORE" "$AFTER" | while IFS= read -r f; do [ -n "$f" ] && rm -f "$f"; done
  exit 1
fi

git checkout -- '*.tsbuildinfo' 2>/dev/null || true
git ls-files --others --exclude-standard | sort >"$AFTER"
NEW_UNTRACKED="$(comm -13 "$BEFORE" "$AFTER" || true)"

# --- anything to propose? ---
if git diff --quiet && [ -z "$NEW_UNTRACKED" ]; then
  echo "No changes this run — nothing to propose. Done."
  exit 0
fi

DATE="$(date '+%Y-%m-%d')"
BRANCH="$PREFIX/$DATE"
git config user.name "team-bot"
git config user.email "$(git config user.email || echo actions@local)"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

if [ "$ADD_MODE" = "all" ]; then
  git add -u
  echo "$NEW_UNTRACKED" | while IFS= read -r f; do [ -n "$f" ] && git add -- "$f"; done
else
  git add "$ADD_MODE"
fi

git commit -m "chore(team): $JOB run ($DATE)" || { echo "nothing staged after scoping"; exit 0; }
git push origin "$BRANCH"
gh pr create --base main --head "$BRANCH" \
  --title "Team: $JOB — $DATE" \
  --body "Automated \`$JOB\` run by the local agent team (\`/team\`). Review the diff, then merge to land/deploy. The goal loop holds while a \`team-loop/*\` PR is open.

🤖 Generated locally with [Claude Code](https://claude.com/claude-code)" \
  || echo "warn: 'gh pr create' failed (branch is pushed; open the PR manually)"

git checkout main
echo "===== $(date '+%Y-%m-%d %H:%M:%S') :: $JOB :: done ====="
