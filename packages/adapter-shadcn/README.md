# @generative-semantic-ui/shadcn

> Self-contained shadcn/ui-style adapter for [`@generative-semantic-ui/core`](../core). Ships Button and Input primitives built on Radix + `class-variance-authority`; styled with Tailwind.

## Install

```bash
npm install @generative-semantic-ui/core @generative-semantic-ui/shadcn
```

Requires Tailwind v3+ in your app.

## Setup

**1. Import the design tokens** in your app root (`main.tsx` / `index.tsx`):

```ts
import "@generative-semantic-ui/shadcn/styles.css";
```

**2. Register the package in your Tailwind content glob** so its utility classes get emitted:

```js
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@generative-semantic-ui/shadcn/dist/**/*.{js,cjs}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  safelist: [{ pattern: /^gap-\d+$/ }, { pattern: /^p-\d+$/ }],
};
```

**3. Use the registry**:

```tsx
import { compile } from "@generative-semantic-ui/core";
import { registry } from "@generative-semantic-ui/shadcn";

const element = compile(jsxFromAgent, registry);
```

## What's in the registry

`Stack`, `Row`, `Box`, `Text`, `Heading`, `Button`, `Input`, `Image`, `Divider`.

Also exports `ButtonPrimitive` and `InputPrimitive` if you want to compose your own adapters.

## Differences from canonical shadcn/ui

This package bundles Button and Input rather than asking you to `npx shadcn add button input`. If you already have shadcn installed locally, writing your own thin registry adapter that imports from your `@/components/ui/*` is also 50 LOC — see [`src/index.tsx`](./src/index.tsx) as a template.

## License

MIT
