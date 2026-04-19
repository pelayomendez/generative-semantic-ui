# Semantic HTML for AI: stop asking LLMs to write React

> A small DSL between the model and your component library reduces LLM output ~4× and makes the system prompt cacheable. Here's the shape of it, what you gain, and why you probably shouldn't let your LLM emit `className="flex flex-col gap-3"`.

---

## The problem

Ask Claude or GPT-4 for "a profile form" and you'll get back something like this:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ProfileForm({ onSave, onCancel }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl font-semibold">Perfil</h2>
      <div className="flex flex-col gap-1">
        <Label htmlFor="firstName">Nombre</Label>
        <Input
          id="firstName"
          name="firstName"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      {/* ... 40 more lines */}
    </div>
  );
}
```

Roughly **1,100 characters, ~275 tokens**, every call. Imports, `useState`, event handlers, `className` strings, `htmlFor` wiring — all regenerated each time the user asks for a slightly different form.

There's also a second problem: that output is **locked to shadcn/ui**. Switch to MUI and the model has to re-learn a new set of components, prop names, and conventions. Your system prompt balloons, the cache cold-starts, and you pay the token tax forever.

The fix isn't a better model. It's a smaller language.

## The insight: treat UI as a DSL

Give the LLM a closed, semantic vocabulary — `Stack`, `Row`, `Button`, `Input`, `Heading` — and tell it that's the whole world. It doesn't need to know your UI library exists. Then put a tiny runtime between the model and your app that maps semantic tags to real components.

The same profile form becomes:

```jsx
<Stack gap={3}>
  <Heading level={2}>Perfil</Heading>
  <Input name="firstName" placeholder="Nombre" />
  <Input name="lastName" placeholder="Apellidos" />
  <Input name="address" placeholder="Dirección" />
  <Row gap={2}>
    <Button onClick="cancelProfile">Cancelar</Button>
    <Button onClick="saveProfile">Guardar</Button>
  </Row>
</Stack>
```

**~270 characters, ~70 tokens.** About **4× smaller**, and every token is meaningful — no imports, no hooks, no handlers, no classNames. The model focuses on intent, not plumbing.

This is what semantic HTML was supposed to be, except HTML never went small enough and got swallowed by Tailwind. Now we build it for a different audience: language models.

## The architecture

```
LLM ──► JSX string ──► compile() ──► registry lookup ──► React element
                                              │
                                              ▼
                           adapter to shadcn / MUI / Chakra / ...
                                              │
                          Button onClick="save" → dispatchAction("save")
```

Four pieces:

**1. The prompt.** About 300 tokens declaring the vocabulary and the generation rules ("single root, no imports, no fragments, event handlers as string names"). This is the **only** thing the model knows. It never mentions your UI library.

**2. `compile()`.** Parses the JSX string (via `@babel/parser`), validates it against the registry, and emits React elements. Rejects unknown tags, multiple roots, fragments, spread props, and any non-literal expression. Bad LLM output fails loudly.

**3. The registry.** A map from semantic name → real component. This is the only library-aware file:

```tsx
const registry = {
  Stack: ({ gap, children }) => <div className={`flex flex-col gap-${gap}`}>{children}</div>,
  Button: ({ onClick, children }) => <ShadcnButton onClick={() => dispatchAction(onClick)}>{children}</ShadcnButton>,
  // ...
};
```

Swap shadcn for MUI: rewrite this file, nothing else changes. Same prompt, same compiler, same fixtures.

**4. Action dispatch.** LLMs can't emit real function references, so `onClick` is a string. Handlers live in an action registry; the button wraps the real click with `dispatchAction("save")`.

That's the whole pattern. The [open-source `@semantic-html-ai/core`](packages/core) is <200 LOC.

## Token economics

Three wins stack on top of each other.

### 1. The output shrinks

| Component | Tokens (raw shadcn) | Tokens (ui-jsx) | Ratio |
|---|---:|---:|---:|
| Login form | ~180 | ~50 | 3.6× |
| Profile form | ~275 | ~70 | 3.9× |
| Settings panel | ~320 | ~85 | 3.8× |

~4× fewer output tokens per component. At Anthropic's Claude Sonnet pricing (~$15/M output), a generative-UI app doing 10k renders/day saves real money.

### 2. The prompt gets cacheable

The system-level rules never change between calls — the vocabulary is fixed. That's exactly what `cache_control: { type: "ephemeral" }` is for:

```ts
await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  system: [{
    type: "text",
    text: DEFAULT_PROMPT_RULES,            // ~300 tokens, inmutable
    cache_control: { type: "ephemeral" },  // cached
  }],
  messages: [{ role: "user", content: userPrompt }],
});
```

With caching:
- First call: pay 1.25× for the cached prefix (write cost)
- Every call within 5 min: pay 0.1× for that prefix (read cost)

For 100 calls in 5 minutes with a 300-token system prompt:
- **Without cache:** 30,000 input tokens billed
- **With cache:** 3,075 input tokens billed (~90% savings on the cacheable portion)

The savings compound. The bigger your vocabulary (if you extend it), the more you save.

### 3. Library-agnostic system prompt

If your prompt says "use shadcn's `Button` with `variant='destructive'`," and later you want to swap to MUI, you have to rewrite the prompt. Every existing cache gets invalidated. Users pay cold-cache tokens for days.

With the semantic DSL, the prompt doesn't mention any UI library. Swapping adapters is a code change, not a prompt change. The cache survives refactors.

## Two render paths, one source of truth

Same DSL, two deployment models:

**Runtime compile** — parse in the browser and render live:

```tsx
const jsx = await callLLM(`${userPrompt}\n\n${DEFAULT_PROMPT_RULES}`);
const element = compile(jsx, registry);
```

Use for: copilots, AI-native editors, adaptive UI per user, anything where the LLM needs to respond in the moment. Ships `@babel/parser` (~30KB gzipped) to the client.

**Build-time generate** — transpile the DSL into real `.tsx` files ahead of time:

```bash
npm run generate
# → src/components/generated/ProfileForm.tsx  (real shadcn code)
# → src/components/generated/LoginForm.tsx
```

Use for: scaffolding dashboards, CRUD admin panels, landing pages. Zero runtime cost, typed, diffable in git, editable by hand afterwards. The generator is another ~150 LOC that walks the same AST and emits TSX text instead of React elements.

Both paths use **the same vocabulary, the same prompt, the same LLM output**. That's the point: the DSL is the stable interface, everything else is a backend.

## How this compares

| Tool | Approach | DSL? | Output format | Token-efficient? | Library-agnostic? |
|---|---|---|---|---|---|
| **Vercel v0** | AI → shadcn code | No | Full React source | No (verbose) | No (shadcn + Next) |
| **Thesys C1** | Hosted API | Yes (proprietary) | JSON | Yes | Vendor-locked |
| **Vercel AI SDK `generateObject`** | Schema-driven | Zod schema | JSON → React | Medium | Yes, but JSON not JSX |
| **Assistant-UI / CopilotKit** | Chat harness + tool calls | No | React components | N/A | Tied to harness |
| **Bolt / Lovable / Cursor** | Whole-app gen | No | Full project | No | No |
| **`@semantic-html-ai/core`** | Open DSL + adapters | Yes, open | JSX string | Yes (~4× smaller) | Yes |

The closest prior art is **Thesys C1**, which ships a proprietary generative-UI DSL and a hosted render API. The ui-jsx pattern is the same core idea as open source, JSX instead of JSON, and bring-your-own-model.

The closest **philosophy** is the Vercel AI SDK's `generateObject` with Zod schemas — but JSON is a worse medium for UI than JSX. LLMs are *native* JSX writers (it's all over their training data); asking them to emit deeply-nested JSON with library-specific keys fights that training. JSX is less tokens and more natural.

## When to use this

Good fit:
- **AI copilots** that generate forms, panels, or settings on demand.
- **3D/design tool sidebars** where the UI adapts to the selected object (our original use case).
- **Internal tools** where non-engineers describe what they need.
- **Email/PDF layouts** (semantic DSL → printable output is a different adapter).
- **Multi-tenant apps** with per-tenant design systems (same prompt, different adapter).

Bad fit:
- **Static marketing pages** — just write them.
- **Highly interactive UIs** with complex client state, animation, or charts that don't fit the vocabulary. The DSL can be extended, but each extension costs prompt tokens.
- **Apps where the UI is the product** (Figma, Linear). You want full control, not a semantic abstraction.

The rule of thumb: if the UI is **scaffolding around data** (forms, panels, lists), the DSL wins. If the UI **is** the product, skip it.

## Try it

```bash
git clone https://github.com/semantic-html-ai/semantic-html-ai
cd semantic-html-ai
npm install
npm run build:core
npm run dev:demo
```

Open [http://localhost:3000](http://localhost:3000). Pick a fixture, toggle between `runtime` and `generated` modes — same output, two render paths. Click a button, watch the console.

Install the core:

```bash
npm install @semantic-html-ai/core
```

See [packages/core/README.md](packages/core/README.md) for API, or [ui-jsx-demo/src/ui-jsx/components.tsx](ui-jsx-demo/src/ui-jsx/components.tsx) for a complete shadcn adapter.

## What's next

- **More adapters.** MUI, Chakra, HeadlessUI, react-aria, plain HTML, react-native. Each is a single file.
- **Streaming compile.** Render partial JSX as the LLM streams tokens, using `partial-json`-style tolerant parsing.
- **Extended vocabularies.** `Card`, `Tabs`, `Dialog`, `Select`, `Switch`. The registry scales linearly in code; the prompt scales logarithmically if you group them well.
- **Type-safe props.** A registry-driven type generator so `compile()` rejects malformed props at parse time, not render.
- **Server components.** React Server Components adapter — the LLM emits semantic JSX, the server renders shadcn, streams HTML.

Contributions welcome. Start with an adapter: pick your favorite component library, port the 9 vocabulary entries, open a PR.

---

*The pattern is simple enough that writing it down takes longer than implementing it. That's usually a good sign.*
