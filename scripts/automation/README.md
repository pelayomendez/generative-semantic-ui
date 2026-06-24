# Local team automation (launchd)

Runs the agent team **on this machine** via the logged-in Claude CLI — no
`ANTHROPIC_API_KEY` needed. macOS `launchd` schedules it (survives reboots,
runs unattended; unlike Claude Code's built-in cron it doesn't need the app
open). Each run opens a **branch + PR** for review; it never pushes `main`.

## Install
```bash
scripts/automation/install-launchd.sh     # generate plists + load them
```
This creates `~/Library/LaunchAgents/com.pelayomendez.gsui.*.plist` (machine-
specific, not committed) and loads them.

## Schedule (local time)
| Job | When | Does |
|---|---|---|
| `goal-loop` | daily 06:41 | next goal from `.hdd/BACKLOG.md` → PR (one in flight at a time) |
| `data-enrichment` | daily 07:17 | curate `apps/portfolio/lib/data/` → PR |
| `growth-digest` | Mon 08:23 | drafts under `growth/` → PR |

## Run by hand
```bash
bash scripts/automation/run-team.sh goal-loop          # or data-enrichment / growth-digest
launchctl start com.pelayomendez.gsui.goal-loop        # fire the scheduled job now
```

## Logs
`~/.claude/team-automation/logs/<job>.log` (runner) and `<job>.launchd.log` (launchd).

## Remove
```bash
scripts/automation/uninstall-launchd.sh
```

## Requirements / notes
- Node ≥18 via nvm (the runner auto-picks the newest v22/v20/v18), `gh`
  authenticated, and `claude` logged in.
- The Mac must be **awake** at the scheduled time. launchd runs missed jobs at
  next wake only if the machine was asleep at the exact time and `launchd`
  catches up — don't rely on overnight runs if the Mac is shut down. Adjust
  times in `install-launchd.sh` to when the machine is typically on.
- Auth: runs use your Claude **login session**. If a launchd run can't
  authenticate, open the app / run `claude` once interactively to refresh it.
