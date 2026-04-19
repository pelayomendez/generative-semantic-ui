// The default prompt block to prepend to LLM calls. This is designed to be
// placed in the `system` position with `cache_control: { type: "ephemeral" }`
// so it stays in prompt cache across calls — it never changes.

export const DEFAULT_PROMPT_RULES = `# UI-JSX Generation Rules

Generate UI as JSX using ONLY these components:

- \`Stack(gap?)\` — vertical flex container
- \`Row(gap?)\` — horizontal flex container
- \`Box(padding?)\` — generic container
- \`Text\` — inline text, content as children
- \`Heading(level?)\` — heading 1–4
- \`Button(onClick)\` — onClick is a string action name
- \`Input(name, placeholder?, type?)\` — form input
- \`Image(src, alt?)\` — image
- \`Divider\` — horizontal rule

## Rules

1. Single root element
2. No \`import\` statements
3. No fragments (\`<>...</>\`)
4. No \`{expressions}\` except string or number literals (\`gap={2}\` OK, \`onClick={() => x}\` not allowed)
5. Text content as children, never as a prop
6. Event handlers as string action names: \`onClick="save"\`

## Output

Return ONLY the raw JSX. No markdown fences. No explanation.

## Example

User: "a login form"

Output:
<Stack gap={3}>
  <Heading level={2}>Log in</Heading>
  <Input name="email" type="email" placeholder="Email" />
  <Input name="password" type="password" placeholder="Password" />
  <Button onClick="login">Log in</Button>
</Stack>
`;
