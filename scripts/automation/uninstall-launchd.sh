#!/usr/bin/env bash
# Remove the local launchd schedules for the agent team.
set -euo pipefail

AGENTS="$HOME/Library/LaunchAgents"
DOMAIN="com.pelayomendez.gsui"

for job in goal-loop data-enrichment growth-digest; do
  plist="$AGENTS/$DOMAIN.$job.plist"
  if [ -f "$plist" ]; then
    launchctl unload "$plist" 2>/dev/null || true
    rm -f "$plist"
    echo "removed: $DOMAIN.$job"
  fi
done
echo "Done. (Logs under ~/.claude/team-automation/logs are left in place.)"
