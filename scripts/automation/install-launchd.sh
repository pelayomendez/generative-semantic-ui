#!/usr/bin/env bash
# Install (or refresh) the local launchd schedules that run the agent team on
# this machine. Generates per-job plists in ~/Library/LaunchAgents pointing at
# run-team.sh, then loads them. Machine-specific — the plists are NOT committed.
#
#   scripts/automation/install-launchd.sh         # install/refresh all
#   scripts/automation/uninstall-launchd.sh       # remove them
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNNER="$REPO/scripts/automation/run-team.sh"
AGENTS="$HOME/Library/LaunchAgents"
LOG_DIR="$HOME/.claude/team-automation/logs"
DOMAIN="com.pelayomendez.gsui"
chmod +x "$RUNNER"
mkdir -p "$AGENTS" "$LOG_DIR"

# job | hour | minute | weekday(blank = daily). Off-minute on purpose.
JOBS=(
  "goal-loop|6|41|"
  "data-enrichment|7|17|"
  "growth-digest|8|23|1"   # Monday
)

write_plist() {
  local job="$1" hour="$2" min="$3" weekday="$4"
  local label="$DOMAIN.$job"
  local plist="$AGENTS/$label.plist"
  local cal="    <key>Hour</key><integer>$hour</integer>
    <key>Minute</key><integer>$min</integer>"
  [ -n "$weekday" ] && cal="$cal
    <key>Weekday</key><integer>$weekday</integer>"

  cat >"$plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$label</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$RUNNER</string>
    <string>$job</string>
  </array>
  <key>WorkingDirectory</key><string>$REPO</string>
  <key>StartCalendarInterval</key>
  <dict>
$cal
  </dict>
  <key>RunAtLoad</key><false/>
  <key>ProcessType</key><string>Background</string>
  <key>StandardOutPath</key><string>$LOG_DIR/$job.launchd.log</string>
  <key>StandardErrorPath</key><string>$LOG_DIR/$job.launchd.log</string>
</dict>
</plist>
EOF

  launchctl unload "$plist" 2>/dev/null || true
  launchctl load "$plist"
  echo "loaded: $label  (run-team.sh $job @ ${hour}:$(printf '%02d' "$min")${weekday:+ weekday=$weekday})"
}

for spec in "${JOBS[@]}"; do
  IFS='|' read -r job hour min weekday <<<"$spec"
  write_plist "$job" "$hour" "$min" "$weekday"
done

echo ""
echo "Installed. Logs: $LOG_DIR"
echo "Test a job now:  bash $RUNNER goal-loop"
echo "Or fire via launchd:  launchctl start $DOMAIN.goal-loop"
