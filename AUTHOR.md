# Author Profile

## Name
Pelayo Méndez

## Role
Creative software developer & lead at GFT Technologies. Freelance creative
coder. Lecturer at EINA and ELISAVA in Barcelona.

## Background
A decade of creative coding for theatre, opera, festivals and live events
(La Fura dels Baus, Sonar, Singapore Night Festival, San Sebastián, Berlinale),
with a Communication Sciences and Literary Theory background. Now focused
on AI-driven interfaces and developer tooling — bringing the same generative
sensibility to the way humans and language models share a screen.

Comfortable with TypeScript, React, Next.js, Node, openFrameworks, Processing,
Pixi.js, WebGL and the surrounding tooling. Comfortable shipping packages,
running monorepos, and working with LLM SDKs (Mistral, Anthropic, Gemini).

## Main goal
Keep `@generative-semantic-ui` a small, semantic, library-agnostic contract
that lets language models render real UI. Use it to ship a personal portfolio
that doubles as the canonical demo. Continue exploring narrative DSLs and
intent-driven dev tooling alongside (ArticleLang, Honest DD).

## What matters most to me
- a small, semantic vocabulary — every new primitive needs a real reason
- library-agnostic core, opinionated adapters
- generative aesthetic — the surface should feel alive
- low maintenance — minimal deps, no premature abstractions
- clarity about tradeoffs before code is written

## My preferred way of working
- describe the outcome first, then design the approach
- small iterative changes, one concern at a time
- plan in plain language before touching code
- surface tradeoffs and ask before refactoring beyond the request
- never commit or push without explicit authorization

## Communication preferences
- terse responses, no narration of internal deliberation
- recommendations with the main tradeoff stated, not finalised plans
- explain WHY when it isn't obvious from the diff
- ask one focused question at a time when intent is unclear

## Constraints
- this is a personal project; bandwidth is limited
- prefer keeping the package's vocabulary tight over adding components
- prefer extending existing patterns over inventing new ones
- avoid new dependencies unless they pay for themselves clearly

## Default assumptions for specs
- optimise for clarity over flexibility
- keep features small unless the user explicitly expands scope
- always state what is in scope AND what is deliberately out
- write acceptance criteria as observable behaviours, not implementation steps

## Domains I usually care about
- vocabulary design (what the LLM may emit)
- compiler safety (strict parsing, single-root JSX, literal-only expressions)
- adapter ergonomics (mapping semantic names to a UI library)
- LLM system prompts (what gets cached vs. what changes per call)
- the generative aesthetic of the portfolio itself

## Notes
- The portfolio app at `apps/portfolio` and the demo at `playground/` are
  both downstream of the same package — changes to the vocabulary always
  ripple to both adapters, both apps and the prompt.
- Deploy is Git → Vercel (two projects). Pushes are deploys.
