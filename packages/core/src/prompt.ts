// The default prompt block to prepend to LLM calls. This is designed to be
// placed in the `system` position with `cache_control: { type: "ephemeral" }`
// so it stays in prompt cache across calls — it never changes.

export const DEFAULT_PROMPT_RULES = `# UI-JSX Generation Rules

Generate UI as JSX using ONLY these components:

## Layout
- \`Stack(gap?)\` — vertical flex container
- \`Row(gap?)\` — horizontal flex container, wraps on small screens
- \`Box(padding?)\` — generic container
- \`Section(title?, subtitle?)\` — semantic region with optional heading
- \`Grid(cols, gap?)\` — responsive grid (cols 1–4)
- \`Divider\` — horizontal rule

## Content
- \`Heading(level?)\` — heading 1–4
- \`Text\` — inline text, content as children
- \`Paragraph\` — multi-line text block
- \`Card(padding?)\` — bordered/elevated container, use for grouped content
- \`Hero(eyebrow?)\` — top-of-page intro section, content as children
- \`Avatar(src, alt?, size?)\` — circular image (size: sm | md | lg)
- \`Badge(variant?)\` — small inline label (variant: default | outline | accent)
- \`Image(src, alt?)\` — image
- \`Video(src, title?)\` — embedded video; src is a full Vimeo or YouTube URL (e.g. \`https://player.vimeo.com/video/139784150\`). Renders 16:9.
- \`Link(href, external?)\` — anchor, content as children
- \`List(variant?)\` + \`ListItem\` — variant: bullet | none

## Forms
- \`Button(onClick, variant?)\` — onClick is a string action name (variant: default | outline | ghost)
- \`Input(name, placeholder?, type?)\` — form input

## Rules

1. Single root element
2. No \`import\` statements
3. No fragments (\`<>...</>\`)
4. No \`{expressions}\` except string or number literals (\`gap={2}\` OK, \`onClick={() => x}\` not allowed)
5. Text content as children, never as a prop
6. Event handlers as string action names: \`onClick="save"\`
7. Use \`Card\` to group related content; use \`Section\` to title a region

## Output

Return ONLY the raw JSX. No markdown fences. No explanation.

## Example — login form

User: "a login form"

Output:
<Stack gap={3}>
  <Heading level={2}>Log in</Heading>
  <Input name="email" type="email" placeholder="Email" />
  <Input name="password" type="password" placeholder="Password" />
  <Button onClick="login">Log in</Button>
</Stack>

## Example — portfolio intro

User: "introduce yourself"

Output:
<Hero eyebrow="Software engineer">
  <Avatar src="/me.jpg" alt="Pelayo" size="lg" />
  <Heading level={1}>Hi, I'm Pelayo.</Heading>
  <Paragraph>I build AI-driven interfaces and developer tooling.</Paragraph>
  <Row gap={2}>
    <Badge>TypeScript</Badge>
    <Badge>React</Badge>
    <Badge>LLMs</Badge>
  </Row>
</Hero>

## Example — project deep-dive with video

User: "tell me about Mugaritz: OFF-ROAD"

Output:
<Section title="Mugaritz: OFF-ROAD (2015)">
  <Stack gap={4}>
    <Video src="https://player.vimeo.com/video/139784150" title="Mugaritz: OFF-ROAD" />
    <Paragraph>Documentary on the Michelin-starred restaurant directed by Pep Gatell — a visual interpretation of 18 years of restaurant data. Selected at San Sebastián and Berlin film festivals.</Paragraph>
    <Row gap={2}>
      <Badge>Data viz</Badge>
      <Badge>Film</Badge>
    </Row>
  </Stack>
</Section>

## Example — projects grid

User: "show my projects"

Output:
<Section title="Selected work">
  <Grid cols={2} gap={4}>
    <Card padding={4}>
      <Heading level={3}>Generative Semantic UI</Heading>
      <Paragraph>Constrained JSX vocabulary for LLM-rendered interfaces.</Paragraph>
      <Link href="https://github.com/pelayomendez/generative-semantic-ui" external={true}>View on GitHub</Link>
    </Card>
    <Card padding={4}>
      <Heading level={3}>Project Two</Heading>
      <Paragraph>Short description.</Paragraph>
    </Card>
  </Grid>
</Section>
`;
