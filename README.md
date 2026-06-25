# Generative Semantic UI

> **It's like HTML for AI agents.**

[![core](https://img.shields.io/npm/v/%40generative-semantic-ui%2Fcore?label=%40generative-semantic-ui%2Fcore&color=blue)](https://www.npmjs.com/package/@generative-semantic-ui/core)
[![html](https://img.shields.io/npm/v/%40generative-semantic-ui%2Fhtml?label=%2Fhtml&color=blue)](https://www.npmjs.com/package/@generative-semantic-ui/html)
[![shadcn](https://img.shields.io/npm/v/%40generative-semantic-ui%2Fshadcn?label=%2Fshadcn&color=blue)](https://www.npmjs.com/package/@generative-semantic-ui/shadcn)
[![playground](https://img.shields.io/badge/playground-live-success)](https://generative-semantic-ui.vercel.app)
[![MIT](https://img.shields.io/badge/license-MIT-green)](#license)

A closed JSX vocabulary for LLM-generated UI, compiled at runtime (or build-time) to your component library of choice. ~4× smaller output, prompt-cache friendly, library-agnostic.

**→ Try the [live playground](https://generative-semantic-ui.vercel.app) ·  Read [the article](ARTICLE.md)**

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

| Package | Version | What it is |
|---|---|---|
| [`@generative-semantic-ui/core`](packages/core) | [![v](https://img.shields.io/npm/v/%40generative-semantic-ui%2Fcore?label=%20&color=blue)](https://www.npmjs.com/package/@generative-semantic-ui/core) | `compile()`, actions, prompt rules. The brain. |
| [`@generative-semantic-ui/html`](packages/adapter-html) | [![v](https://img.shields.io/npm/v/%40generative-semantic-ui%2Fhtml?label=%20&color=blue)](https://www.npmjs.com/package/@generative-semantic-ui/html) | Zero-dep adapter. Inline styles. `npm i` and go. |
| [`@generative-semantic-ui/shadcn`](packages/adapter-shadcn) | [![v](https://img.shields.io/npm/v/%40generative-semantic-ui%2Fshadcn?label=%20&color=blue)](https://www.npmjs.com/package/@generative-semantic-ui/shadcn) | shadcn-style adapter with bundled Radix primitives. Needs Tailwind. |

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

👉 **https://generative-semantic-ui.vercel.app**

Type a prompt → agent emits semantic JSX → adapter renders it. Two modes:

- **Shared demo key** (rate-limited 5/IP/hour): just click Generate.
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

## Agent team & automation

This repo is partly operated by a local **Orchestrator–Worker agent team** (6
worker agents + an orchestrator), invoked via the `/team` command. Workers cover
scope (Product Owner), design, the portfolio app, the DSL/compiler, QA, and
growth — each confined to its own domain, so vocabulary changes ripple through
every adapter, the prompt, and the playground together.

Between hands-on sessions, the team runs autonomously as **Claude Desktop
scheduled tasks**: a continuous goal loop picks the top item from
[`.hdd/BACKLOG.md`](.hdd/BACKLOG.md), delivers it through the full lifecycle, and
opens a PR — one goal in flight at a time. The tasks **never push `main`** (pushes
deploy) and **never publish** anywhere; every change lands as a PR for review.
Steer the work by editing the backlog.

Full operating manual: [`.claude/TEAM.md`](.claude/TEAM.md).

## License

MIT © [Pelayo Méndez](https://github.com/pelayomendez)
