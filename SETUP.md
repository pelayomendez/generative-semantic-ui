# Test Project Setup — ui-jsx with shadcn/ui

Build a minimal React test app that demonstrates the `ui-jsx` skill end-to-end. Use **rsbuild** as the bundler (matches the user's existing stack) and **shadcn/ui** as the underlying component library.

## Goal

A running app where:
1. The user types a prompt ("a login form", "a settings panel for a 3D object")
2. A mocked LLM call returns JSX (use a fixture for now — no real API key needed)
3. `compile()` parses the JSX and renders it via shadcn components
4. Clicking buttons fires registered actions that log to the console

## Stack

- **rsbuild** with React + TypeScript template
- **shadcn/ui** + Tailwind for the underlying components
- **@babel/parser** for JSX parsing
- No backend, no real LLM — use a fixtures file with 3–4 sample JSX outputs

## Steps

### 1. Scaffold

```bash
npm create rsbuild@latest ui-jsx-demo -- --template react-ts
cd ui-jsx-demo
npm install
```

### 2. Add Tailwind + shadcn

Follow the shadcn install for Vite-like setups (rsbuild is compatible):
- Install `tailwindcss`, `postcss`, `autoprefixer`
- Configure `tailwind.config.js` with the shadcn preset
- Add the shadcn CLI: `npx shadcn@latest init`
- Add components: `npx shadcn@latest add button input`

### 3. Drop in the skill files

Copy the four files from this skill into `src/ui-jsx/`:
- `components.tsx`
- `compile.tsx`
- `actions.ts`
- `prompt.md` (as a `.ts` constant, see step 4)

### 4. Adapt `components.tsx` to shadcn

Replace the plain HTML implementations with shadcn equivalents. Keep the names and prop signatures identical.

```tsx
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input as ShadcnInput } from "@/components/ui/input";
import { dispatchAction } from "./actions";

export const Stack = ({ gap = 2, children }) => (
  <div className={`flex flex-col gap-${gap}`}>{children}</div>
);

export const Row = ({ gap = 2, children }) => (
  <div className={`flex flex-row gap-${gap}`}>{children}</div>
);

export const Box = ({ padding = 0, children }) => (
  <div className={`p-${padding}`}>{children}</div>
);

export const Text = ({ children }) => <span>{children}</span>;

export const Heading = ({ level = 2, children }) => {
  const Tag = `h${level}`;
  const sizes = { 1: "text-3xl", 2: "text-2xl", 3: "text-xl", 4: "text-lg" };
  return <Tag className={`${sizes[level]} font-semibold`}>{children}</Tag>;
};

export const Button = ({ onClick, children }) => (
  <ShadcnButton onClick={() => dispatchAction(onClick)}>{children}</ShadcnButton>
);

export const Input = ({ name, placeholder, type = "text" }) => (
  <ShadcnInput name={name} placeholder={placeholder} type={type} />
);

export const Image = ({ src, alt = "" }) => <img src={src} alt={alt} />;

export const Divider = () => <hr className="my-2 border-t" />;

export const registry = { Stack, Row, Box, Text, Heading, Button, Input, Image, Divider };
```

### 5. Create fixtures

`src/fixtures.ts`:

```ts
export const FIXTURES: Record<string, string> = {
  login: `
    <Stack gap={3}>
      <Heading level={2}>Log in</Heading>
      <Input name="email" type="email" placeholder="Email" />
      <Input name="password" type="password" placeholder="Password" />
      <Button onClick="login">Log in</Button>
    </Stack>
  `,
  settings: `
    <Stack gap={4}>
      <Heading level={2}>Settings</Heading>
      <Input name="username" placeholder="Username" />
      <Input name="email" placeholder="Email" />
      <Divider />
      <Row gap={2}>
        <Button onClick="cancel">Cancel</Button>
        <Button onClick="save">Save</Button>
      </Row>
    </Stack>
  `,
  transform: `
    <Stack gap={2}>
      <Heading level={3}>Transform</Heading>
      <Input name="x" type="number" placeholder="X" />
      <Input name="y" type="number" placeholder="Y" />
      <Input name="z" type="number" placeholder="Z" />
      <Button onClick="apply">Apply</Button>
    </Stack>
  `,
};
```

### 6. Wire up `App.tsx`

```tsx
import { useState } from "react";
import { compile } from "./ui-jsx/compile";
import { registerAction } from "./ui-jsx/actions";
import { FIXTURES } from "./fixtures";

// Register some demo actions
registerAction("login", () => console.log("login fired"));
registerAction("save", () => console.log("save fired"));
registerAction("cancel", () => console.log("cancel fired"));
registerAction("apply", () => console.log("apply fired"));

export default function App() {
  const [key, setKey] = useState<keyof typeof FIXTURES>("login");
  let rendered: React.ReactNode;
  let error: string | null = null;

  try {
    rendered = compile(FIXTURES[key]);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex gap-2">
        {Object.keys(FIXTURES).map((k) => (
          <button
            key={k}
            onClick={() => setKey(k as any)}
            className="px-3 py-1 border rounded"
          >
            {k}
          </button>
        ))}
      </div>
      <div className="border rounded p-6">
        {error ? <pre className="text-red-600">{error}</pre> : rendered}
      </div>
      <details>
        <summary className="cursor-pointer text-sm text-gray-600">Source JSX</summary>
        <pre className="text-xs bg-gray-50 p-3 mt-2 rounded">{FIXTURES[key]}</pre>
      </details>
    </div>
  );
}
```

### 7. Run it

```bash
npm run dev
```

Click through the fixtures. Verify console logs on button clicks. Try editing a fixture to use an unknown component (`<Foo />`) and confirm the error renders cleanly.

## What success looks like

- All three fixtures render correctly via shadcn components
- Button clicks log the action name to the console
- Invalid JSX shows the error message instead of crashing
- The four skill files are unchanged from the original — only `components.tsx` is adapted

## Next steps (not required for this scaffold)

- Replace fixtures with a real LLM call (Anthropic SDK, prepend `prompt.md` content)
- Add streaming with `partial-json` for progressive render
- Add a domain layer (`TransformPanel`, `MaterialPicker`) on top of the semantic primitives
