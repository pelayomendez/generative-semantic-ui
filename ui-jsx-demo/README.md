# ui-jsx-demo

A working demo of the **ui-jsx** pattern — "semantic HTML for AI." An LLM emits JSX using a closed, library-agnostic vocabulary (`Stack`, `Button`, `Input`…); a tiny runtime parses the string, validates it, and renders it through a component registry that maps to whatever UI library you actually use. Here the registry wraps **shadcn/ui** + Tailwind, but the LLM never learns that.

- **Bundler:** rsbuild (React 19 + TS)
- **UI library:** shadcn/ui + Tailwind v3
- **Parser:** `@babel/parser`
- **LLM:** mocked via [src/fixtures.ts](src/fixtures.ts) — no API key needed

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Click the `login` / `settings` / `transform` buttons to swap fixtures. Open the browser console and click a shadcn button — you'll see `login fired`, `save fired`, etc.

## How the flow works

```
User prompt  ──►  LLM (or fixture)  ──►  JSX string
                                            │
                                            ▼
                               compile(jsx) — parse + validate
                                            │
                                            ▼
                               registry[tag] — maps to shadcn
                                            │
                                            ▼
                               React element → rendered
                                            │
                          Button onClick="save"
                                            │
                                            ▼
                               dispatchAction("save")  ──► registered handler
```

### 1. The LLM emits a JSX string

The LLM is only ever told about the vocabulary in [src/ui-jsx/prompt.md](src/ui-jsx/prompt.md). It must return raw JSX — no imports, no fragments, no expressions beyond string/number literals, event handlers as string names. Example:

```jsx
<Stack gap={3}>
  <Heading level={2}>Log in</Heading>
  <Input name="email" type="email" placeholder="Email" />
  <Button onClick="login">Log in</Button>
</Stack>
```

In this demo the "LLM call" is just a lookup in [src/fixtures.ts](src/fixtures.ts). Swap that for a real `callLLM()` later — the rest of the pipeline doesn't change.

### 2. `compile()` parses + validates

[src/ui-jsx/compile.tsx](src/ui-jsx/compile.tsx) wraps the string in a fragment, runs it through `@babel/parser` with the JSX plugin, then walks the AST. It rejects anything dangerous or off-vocabulary:

- Unknown tags (`<Foo />`) → `Unknown component: <Foo>`
- Multiple root elements → `Expected exactly 1 root element`
- Fragments, spread props, or non-literal `{expressions}` → thrown
- Only string/number/boolean literal props are allowed

The result is a plain React element, safe to render.

### 3. The registry maps semantic names → shadcn

[src/ui-jsx/components.tsx](src/ui-jsx/components.tsx) is the only file that knows about shadcn. It exports a `registry` object that `compile()` looks up by tag name:

```tsx
export const Button = ({ onClick, children }) => (
  <ShadcnButton onClick={() => dispatchAction(onClick)}>{children}</ShadcnButton>
);

export const Input = ({ name, placeholder, type }) => (
  <ShadcnInput name={name} placeholder={placeholder} type={type} />
);

export const registry = { Stack, Row, Box, Text, Heading, Button, Input, Image, Divider };
```

Swap shadcn for MUI, Chakra, or plain HTML and this is the only file you touch. The prompt, compiler, fixtures, and calling code stay the same.

### 4. Actions are strings, dispatched at runtime

LLMs can't emit real function references, so `onClick` is a **string name** that gets looked up in an action registry at click time. [src/ui-jsx/actions.ts](src/ui-jsx/actions.ts) holds a `Map<string, Handler>`; [src/App.tsx](src/App.tsx) registers handlers at startup:

```tsx
registerAction("login",  () => console.log("login fired"));
registerAction("save",   () => console.log("save fired"));
registerAction("cancel", () => console.log("cancel fired"));
registerAction("apply",  () => console.log("apply fired"));
```

When the rendered shadcn Button fires, `dispatchAction("login")` runs the registered handler. Unregistered names log a warning — they don't crash the app.

## Working with this flow

### Add a new fixture (simulate a new prompt)

Edit [src/fixtures.ts](src/fixtures.ts), add a key, put raw JSX in it. It will show up as a new tab button in the UI automatically.

### Add a new action

1. In [src/App.tsx](src/App.tsx): `registerAction("delete", () => { /* ... */ });`
2. In a fixture or LLM output: `<Button onClick="delete">Delete</Button>`

### Add a new semantic component

Say you want `<Card>`:

1. Add it to [src/ui-jsx/components.tsx](src/ui-jsx/components.tsx) with a shadcn implementation, and include it in the `registry` export.
2. Add it to the vocabulary section of [src/ui-jsx/prompt.md](src/ui-jsx/prompt.md) so the LLM knows it exists.

That's it — `compile()` picks up new registry entries automatically.

### Swap the UI library

Rewrite [src/ui-jsx/components.tsx](src/ui-jsx/components.tsx) against MUI/Chakra/headless-ui/etc. Keep the exported names and prop signatures identical. Nothing else changes.

### Plug in a real LLM

Replace the fixture lookup in [src/App.tsx](src/App.tsx) with:

```tsx
import { PROMPT_RULES } from "./ui-jsx/prompt"; // or import prompt.md as a string

const jsx = await callClaude(`${userPrompt}\n\n${PROMPT_RULES}`);
const element = compile(jsx);
```

Wrap the render in an error boundary so bad LLM output fails loudly without taking down the page.

## Try it break it

To see validation in action, edit a fixture to include:

- `<Foo />` → `Unknown component: <Foo>`
- `<><Stack/></>` → `Expected exactly 1 root element`
- `<Button onClick={() => alert(1)}>x</Button>` → `Disallowed expression in prop "onClick"`

All three render cleanly as red error messages instead of crashing the app.

## File map

```
src/
├── ui-jsx/
│   ├── compile.tsx       # JSX string → React element (validation + render)
│   ├── components.tsx    # Semantic registry → shadcn adapter (the only lib-aware file)
│   ├── actions.ts        # String action name → handler dispatch
│   └── prompt.md         # Rules fed to the LLM
├── components/ui/        # shadcn primitives (button, input)
├── lib/utils.ts          # cn() helper
├── fixtures.ts           # Mocked LLM outputs
├── App.tsx               # Fixture switcher + action registration
├── index.tsx             # React entry point
└── index.css             # Tailwind directives + shadcn tokens
```

## Scripts

```bash
npm run dev       # rsbuild dev server
npm run build     # production build to ./dist
npm run preview   # serve the production build
```
