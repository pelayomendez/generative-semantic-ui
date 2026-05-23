---
description: Finalize a spec and record the outcome
argument-hint: "<spec name or path>"
allowed-tools: Task, Agent
---

## Command: /hdd.close [spec-path]

Delegate to the `hdd-close` agent (defined in `.claude/agents/hdd.close.md`).

The agent runs on the model configured in `.hdd/config.json` (`models.claude.close`) so it stays pinned even if your main session uses a different model.

Invoke the `hdd-close` subagent and pass the following arguments verbatim:

```
$ARGUMENTS
```

Do not perform the closure work yourself — the agent owns the full flow (resolving the spec, filling the Closure section, optionally committing). Your only job is to spawn it.
