---
name: ui-jsx
description: Generate React UI as constrained JSX from a closed semantic component vocabulary, then compile to React elements at runtime. Use when the user wants LLM-generated UI panels, dynamic forms, AI-driven interfaces, or any runtime-generated React tree. Works with any underlying UI library (MUI, Chakra, shadcn, plain HTML) via an adapter layer.
---

# UI-JSX Skill

Generate UI as JSX strings using a closed **semantic vocabulary** — think "semantic HTML for AI." The LLM never learns your UI library; it speaks semantic names (`Stack`, `Button`, `Input`) and your registry adapts those to whatever lib you actually use.

## Architecture

```
LLM emits JSX string  →  compile() parses + validates  →  React renders via registry
                                                                    │
                                                                    └─ adapts to MUI/Chakra/shadcn/etc
```

## Vocabulary

The default semantic set:

- `Stack(gap?)` — vertical flex container
- `Row(gap?)` — horizontal flex container
- `Box(padding?)` — generic container
- `Text` — inline text, content as children
- `Heading(level?)` — heading 1–4
- `Button(onClick)` — onClick is a string action name
- `Input(name, placeholder?, type?)` — form input
- `Image(src, alt?)` — image
- `Divider` — horizontal rule

Add more as needed, but keep names library-agnostic.

## Generation rules (sent to the LLM)

1. Use ONLY components from the vocabulary above
2. Single root element
3. No `import` statements, no fragments
4. No `{expressions}` except string/number literals
5. Text as children, never as a prop
6. Event handlers are string action names, not functions
7. Output raw JSX only — no markdown fences, no prose

## Files

- `prompt.md` — the instruction block to prepend to LLM calls
- `components.tsx` — the registry (your adapter to a UI lib)
- `compile.tsx` — JSX string → React element
- `actions.ts` — action dispatcher for string-named handlers

## Setup

1. Copy `components.tsx`, `compile.tsx`, `actions.ts` into your app
2. `npm i @babel/parser`
3. Wire up an action handler: `registerAction("save", () => {...})`
4. Call `compile(jsxString)` with LLM output

## Usage

```tsx
import { compile } from "./ui-jsx/compile";
import { PROMPT_RULES } from "./ui-jsx/prompt";

const jsx = await callLLM(`${userPrompt}\n\n${PROMPT_RULES}`);
return compile(jsx);
```

## Adapting to a UI library

`components.tsx` is the only file that changes when you swap libs. Same JSX, same prompt, same compiler — different visuals.

```tsx
// MUI adapter
export const Stack = ({ gap = 2, children }) => (
  <MuiStack spacing={gap}>{children}</MuiStack>
);

// shadcn adapter
export const Stack = ({ gap = 2, children }) => (
  <div className={`flex flex-col gap-${gap}`}>{children}</div>
);
```

## Safety

- `compile()` rejects unknown tags, expressions, imports, fragments
- Wrap render in an error boundary
- Bad LLM output fails loudly, never renders garbage
