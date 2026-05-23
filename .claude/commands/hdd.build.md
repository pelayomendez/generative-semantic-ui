---
description: Evolve a spec — refine intent and build toward the outcome
argument-hint: "<spec name or path> [optional refinement]"
allowed-tools: Task, Agent
---

## Command: /hdd.build [spec-path] [optional refinement]

Delegate to the `hdd-build` agent (defined in `.claude/agents/hdd.build.md`).

The agent runs on the model configured in `.hdd/config.json` (`models.claude.build`) so it stays pinned even if your main session uses a different model.

Invoke the `hdd-build` subagent and pass the following arguments verbatim:

```
$ARGUMENTS
```

Do not perform the build work yourself — the agent owns the full flow (resolving the spec, presenting a plan, waiting for approval, updating the spec, appending a build log entry, etc.). Your only job is to spawn it.
