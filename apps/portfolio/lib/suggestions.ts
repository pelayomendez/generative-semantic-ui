// The landing chips. Each prompt has a pre-rendered answer in lib/canned.ts
// (regenerate with `npm run canned`), so a chip click never hits the model
// or the rate limit.
export const SUGGESTIONS = [
  "What AI tools have you built?",
  "How do you make AI agents safe to run?",
  "Tell me about Generative Semantic UI",
  "Introduce yourself",
  "Show me your creative work",
  "How do I get in touch?",
] as const;
