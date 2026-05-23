---
description: Create or redefine intent for a feature
argument-hint: "[Short feature description] [--branch branch-name]"
allowed-tools: Task, Agent
---

## Command: /hdd.define [short request] [--branch branch-name]

Delegate to the `hdd-define` agent (defined in `.claude/agents/hdd.define.md`).

The agent runs on the model configured in `.hdd/config.json` (`models.claude.define`) so it stays pinned even if your main session uses a different model.

Invoke the `hdd-define` subagent and pass the following arguments verbatim:

```
$ARGUMENTS
```

Do not perform the spec work yourself — the agent owns the full define flow (reading AGENTS.md/AUTHOR.md, resolving the spec, walking through open questions one at a time, etc.). Your only job is to spawn it.
