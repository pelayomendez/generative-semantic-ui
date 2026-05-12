# Functional spec: Vocabulary

> domain: vocabulary
> source of truth: `packages/core/src/prompt.ts`
> last updated: 2026-05-12

## Purpose
Defines the closed set of components a language model is allowed to emit.
This is the contract between the model and the compiler. Anything outside
this set fails to render — by design.

## Current vocabulary

Layout
- `Stack(gap?)`, `Row(gap?)`, `Box(padding?)`
- `Section(title?, subtitle?)`, `Grid(cols, gap?)`, `Divider`

Content
- `Heading(level?)`, `Text`, `Paragraph`
- `Card(padding?)`, `Hero(eyebrow?)`
- `Avatar(src, alt?, size?)`, `Badge(variant?)`, `Image(src, alt?)`
- `Video(src, title?)` — Vimeo or YouTube embed at 16:9
- `Link(href, external?)`, `List(variant?)` + `ListItem`

Forms
- `Button(onClick, variant?)`, `Input(name, placeholder?, type?)`

## Hard rules (enforced by the compiler)
- Exactly one root element per response.
- No `import` statements.
- No fragments.
- Expressions in props are limited to literal string, number or boolean.
- No expressions in children at all (literals as text only).
- No spread props.
- Unknown tags raise a compile error surfaced to the user.

## When to add a primitive
1. Existing primitives genuinely cannot express the use case (not just
   "would be nicer with X").
2. The new name is semantic (intent-shaped), not visual.
3. It can be sensibly implemented in BOTH the shadcn adapter and the html
   adapter without crazy dependencies.
4. The portfolio app has a concrete plan to use it.
5. There is a system-prompt example showing canonical use.

## When to refuse a primitive
- It encodes a specific layout the model could compose from `Stack`/`Row`/
  `Grid` (e.g. `TwoColumnLayout`).
- It encodes a domain concept rather than a UI shape (e.g. `ProjectCard`,
  `Testimonial`).
- It requires arbitrary expressions or runtime data binding.

## Ripple checklist for vocabulary changes
- [ ] `packages/core/src/prompt.ts` — rule + example
- [ ] `packages/adapter-shadcn/src/index.tsx` — component + registry entry
- [ ] `packages/adapter-html/src/index.tsx` — component + registry entry
- [ ] `apps/portfolio/lib/adapter/registry.tsx` — component + registry entry
- [ ] `playground/lib/examples.ts` — at least one example using it
- [ ] Rebuild all three packages (`npm run build:packages`)
- [ ] Typecheck and build both apps
