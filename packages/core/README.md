# @generative-semantic-ui/core

> **It's like HTML for AI agents** — a closed JSX vocabulary for LLM-generated UI, compiled to your component library of choice.

Agents don't need to know what shadcn is. They emit JSX against a small, library-agnostic vocabulary (`Stack`, `Button`, `Input`…); you adapt it to shadcn/ui, MUI, Chakra, plain HTML, anything. Output is ~4× smaller than raw framework code, the prompt is ~300 tokens (perfect for `cache_control`), and swapping libraries means touching one file.

## Install

```bash
npm install @generative-semantic-ui/core
```

Peer dependency: React ≥ 18.

## Quick start

```tsx
import { compile, registerAction, dispatchAction, DEFAULT_PROMPT_RULES } from "@generative-semantic-ui/core";

// 1. Define your registry (the only library-aware part)
const registry = {
  Stack: ({ gap = 2, children }) => (
    <div className={`flex flex-col gap-${gap}`}>{children}</div>
  ),
  Button: ({ onClick, children }) => (
    <ShadcnButton onClick={() => dispatchAction(onClick)}>{children}</ShadcnButton>
  ),
  // ...
};

// 2. Register action handlers
registerAction("save", () => saveProfile());

// 3. Ask the agent for UI
const jsx = await callClaude({
  system: [{ type: "text", text: DEFAULT_PROMPT_RULES, cache_control: { type: "ephemeral" } }],
  messages: [{ role: "user", content: "a profile form with name, surname, address" }],
});

// 4. Render
const element = compile(jsx, registry);
```

## API

### `compile(jsx, registry): ReactElement`

Parses a JSX string and renders it via the registry. Throws on:

- Unknown tags
- Multiple roots
- `<>fragments</>`
- Spread props (`{...foo}`)
- Non-literal expressions (`onClick={() => x}`)

### `registerAction(name, handler)` / `dispatchAction(name, payload?)`

String-named action dispatcher. Agents emit `onClick="save"`; your registry's `Button` wraps the real click with `dispatchAction("save")`.

### `DEFAULT_PROMPT_RULES`

The default vocabulary + generation rules as a string. Designed to be cached with `cache_control: { type: "ephemeral" }` — it never changes between calls.

## Vocabulary

Default: `Stack`, `Row`, `Box`, `Text`, `Heading`, `Button`, `Input`, `Image`, `Divider`.

Add more by extending the registry and writing your own prompt block.

## Why

Agents trained on public code emit verbose, library-specific output — imports, className soup, closures. That's expensive per call and hard to cache. A closed semantic DSL gives you:

- **~4× fewer output tokens** per component
- **A system prompt that never changes** → `cache_control` stays warm
- **Library portability** — swap shadcn ↔ MUI by rewriting one file
- **Runtime OR build-time** — same DSL, two render paths

## Safety

`compile()` rejects anything off-vocabulary. Wrap the render in an error boundary; malformed agent output fails loudly instead of rendering garbage.

## License

MIT
