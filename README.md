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

The agent emits **that**. You adapt it to shadcn / MUI / Chakra / plain HTML via a ~60 line registry. Swap libraries by rewriting a single file.

## Packages

- [`@generative-semantic-ui/core`](packages/core) — `compile()`, action dispatcher, prompt rules.

## Demo

Live demo with 4 fixtures and a `runtime` vs `build-time generated` toggle:

```bash
npm install
npm run build:core
npm run dev:demo
```

Open [http://localhost:3000](http://localhost:3000).

## Read the article

[**ARTICLE.md**](ARTICLE.md) — the problem, the insight, token economics, comparisons with v0 / Thesys C1 / Vercel AI SDK, and when to use (or not use) this pattern.

## License

MIT © [Pelayo Méndez](https://github.com/pelayomendez)
