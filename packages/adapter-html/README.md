# @generative-semantic-ui/html

> Zero-dependency plain-HTML adapter for [`@generative-semantic-ui/core`](../core). No CSS framework, no setup — install and render.

## Install

```bash
npm install @generative-semantic-ui/core @generative-semantic-ui/html
```

## Use

```tsx
import { compile } from "@generative-semantic-ui/core";
import { registry } from "@generative-semantic-ui/html";

const jsx = `<Stack gap={3}><Heading>Hi</Heading><Button onClick="hi">Click</Button></Stack>`;
const element = compile(jsx, registry);
```

That's it. Styled with inline `style={}` on a 4px spacing scale.

## What's in the registry

`Stack`, `Row`, `Box`, `Text`, `Heading`, `Button`, `Input`, `Image`, `Divider`.

See [`@generative-semantic-ui/core`](../core/README.md) for the vocabulary + generation rules to send to your agent.

## When to use

- Quick prototypes and demos
- Environments without Tailwind / shadcn / any design system
- Testing the pattern before committing to a UI library

For production apps with shadcn, use [`@generative-semantic-ui/shadcn`](../adapter-shadcn). For other libs, write a registry — it's ~50 LOC, see [this file as the template](./src/index.tsx).

## License

MIT
