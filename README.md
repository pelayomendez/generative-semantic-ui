# Generative Semantic UI

> **It's like HTML for AI agents.**

A closed JSX vocabulary for LLM-generated UI, compiled at runtime (or build-time) to your component library of choice. ~4× smaller output, prompt-cache friendly, library-agnostic.

```jsx
<Stack gap={3}>
  <Heading level={2}>Perfil</Heading>
  <Input name="firstName" placeholder="Nombre" />
  <Input name="lastName" placeholder="Apellidos" />
  <Button onClick="saveProfile">Guardar</Button>
</Stack>
```

The agent emits **that**. You adapt it to shadcn / plain HTML / anything by installing an adapter package — or write your own in ~50 LOC.

## Packages

| Package | What it is |
|---|---|
| [`@generative-semantic-ui/core`](packages/core) | `compile()`, actions, prompt rules. The brain. |
| [`@generative-semantic-ui/html`](packages/adapter-html) | Zero-dep adapter. Inline styles. `npm i` and go. |
| [`@generative-semantic-ui/shadcn`](packages/adapter-shadcn) | shadcn-style adapter with bundled Radix primitives. Needs Tailwind. |

Install the batteries-included combo:

```bash
npm install @generative-semantic-ui/core @generative-semantic-ui/shadcn
```

Then:

```tsx
import { compile } from "@generative-semantic-ui/core";
import { registry } from "@generative-semantic-ui/shadcn";
import "@generative-semantic-ui/shadcn/styles.css";

const element = compile(jsxFromAgent, registry);
```

## Playground (hosted)

Type a prompt → agent emits semantic JSX → adapter renders it. Two modes:

- **Shared demo key** (rate-limited): just click Generate.
- **Bring your own Mistral key**: paste it once, stored in localStorage, unlimited use. Get a free one at [console.mistral.ai](https://console.mistral.ai/).

Source: [playground/](playground). Dev:

```bash
npm install
npm run build:core && npm run build:html && npm run build:shadcn
npm run dev:playground     # http://localhost:3001
```

## Local demo

rsbuild demo with 4 fixtures, `runtime`/`generated` toggle, `shadcn`/`html` adapter switch:

```bash
npm install
npm run build:core && npm run build:html && npm run build:shadcn
npm run dev:demo           # http://localhost:3000
```

## Read the article

[**ARTICLE.md**](ARTICLE.md) — the problem, the insight, token economics, comparisons with v0 / Thesys C1 / Vercel AI SDK, and when to use (or not use) this pattern.

## License

MIT © [Pelayo Méndez](https://github.com/pelayomendez)
