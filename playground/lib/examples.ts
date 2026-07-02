export interface Example {
  prompt: string;
  jsx: string;
}

// Precomputed LLM outputs so the playground has something to render
// even when the user has no API key set.
export const EXAMPLES: Example[] = [
  {
    prompt: "a login form",
    jsx: `<Stack gap={3}>
  <Heading level={2}>Log in</Heading>
  <Input name="email" type="email" placeholder="Email" />
  <Input name="password" type="password" placeholder="Password" />
  <Button onClick="login">Log in</Button>
</Stack>`,
  },
  {
    prompt: "a profile form with name, surname, address",
    jsx: `<Stack gap={3}>
  <Heading level={2}>Profile</Heading>
  <Input name="firstName" placeholder="First name" />
  <Input name="lastName" placeholder="Last name" />
  <Input name="address" placeholder="Address" />
  <Row gap={2}>
    <Button onClick="cancel">Cancel</Button>
    <Button onClick="save">Save</Button>
  </Row>
</Stack>`,
  },
  {
    prompt: "a form to buy a plane ticket",
    jsx: `<Stack gap={3}>
  <Heading level={2}>Book a flight</Heading>
  <Row gap={2}>
    <Input name="from" placeholder="From (e.g. MAD)" />
    <Input name="to" placeholder="To (e.g. JFK)" />
  </Row>
  <Row gap={2}>
    <Input name="departure" type="date" placeholder="Departure" />
    <Input name="return" type="date" placeholder="Return" />
  </Row>
  <Input name="passengers" type="number" placeholder="Passengers" />
  <Divider />
  <Row gap={2}>
    <Button onClick="cancelBooking">Cancel</Button>
    <Button onClick="searchFlights">Search flights</Button>
  </Row>
</Stack>`,
  },
  {
    prompt: "a settings panel with username, email, save and cancel",
    jsx: `<Stack gap={4}>
  <Heading level={2}>Settings</Heading>
  <Input name="username" placeholder="Username" />
  <Input name="email" placeholder="Email" />
  <Divider />
  <Row gap={2}>
    <Button onClick="cancel">Cancel</Button>
    <Button onClick="save">Save</Button>
  </Row>
</Stack>`,
  },
  {
    prompt: "a profile card for a software engineer",
    jsx: `<Card padding={6}>
  <Stack gap={3}>
    <Row gap={3}>
      <Avatar src="https://i.pravatar.cc/120?img=12" size="md" />
      <Stack gap={1}>
        <Heading level={3}>Ada Lovelace</Heading>
        <Text>Software engineer · London</Text>
      </Stack>
    </Row>
    <Paragraph>Works on compilers, formal methods and developer tooling. Currently writing a book on programming as poetry.</Paragraph>
    <Row gap={2}>
      <Badge>TypeScript</Badge>
      <Badge>Rust</Badge>
      <Badge variant="accent">Hiring</Badge>
    </Row>
    <Row gap={2}>
      <Button onClick="message">Message</Button>
      <Button onClick="follow" variant="outline">Follow</Button>
    </Row>
  </Stack>
</Card>`,
  },
  {
    prompt: "a grid of selected work — three projects",
    jsx: `<Section title="Selected work" subtitle="A few things I've shipped lately.">
  <Grid cols={3} gap={4}>
    <Card padding={5}>
      <Heading level={3}>Generative Semantic UI</Heading>
      <Paragraph>A constrained JSX vocabulary that lets language models render real UI.</Paragraph>
      <Row gap={2}>
        <Badge>TypeScript</Badge>
        <Badge>LLMs</Badge>
      </Row>
    </Card>
    <Card padding={5}>
      <Heading level={3}>ArticleLang</Heading>
      <Paragraph>A DSL for writing article specs that compile to prompts and prose.</Paragraph>
      <Row gap={2}>
        <Badge>DSL</Badge>
        <Badge>Compiler</Badge>
      </Row>
    </Card>
    <Card padding={5}>
      <Heading level={3}>Honest DD</Heading>
      <Paragraph>Intent-driven development with integrated specs — a counter to AI tools that ship before you've thought.</Paragraph>
      <Row gap={2}>
        <Badge>DX</Badge>
        <Badge>npm</Badge>
      </Row>
    </Card>
  </Grid>
</Section>`,
  },
  {
    prompt: "an asymmetric project detail — wide prose, narrow meta",
    jsx: `<Section title="Generative Semantic UI">
  <Grid cols={3} gap={6}>
    <Stack gap={3} span={2}>
      <Heading level={3}>Overview</Heading>
      <Paragraph>A constrained JSX vocabulary and a compiler that turns LLM output into real React elements — safely, and portable across UI libraries via adapters.</Paragraph>
    </Stack>
    <Stack gap={4}>
      <Stack gap={2}>
        <Heading level={4}>Role</Heading>
        <Paragraph>Author & maintainer</Paragraph>
      </Stack>
      <Stack gap={2}>
        <Heading level={4}>Stack</Heading>
        <Row gap={2}>
          <Badge>TypeScript</Badge>
          <Badge>React</Badge>
        </Row>
      </Stack>
    </Stack>
  </Grid>
</Section>`,
  },
  {
    prompt: "clickable project cards that ask a follow-up when tapped",
    jsx: `<Section title="Selected work" subtitle="Tap a card to dive in.">
  <Grid cols={2} gap={4}>
    <Card padding={5} onClick="ask" prompt="Tell me about Generative Semantic UI">
      <Heading level={3}>Generative Semantic UI</Heading>
      <Paragraph>A constrained JSX vocabulary that lets language models render real UI.</Paragraph>
      <Row gap={2}>
        <Badge>TypeScript</Badge>
        <Badge>LLMs</Badge>
      </Row>
    </Card>
    <Card padding={5} onClick="ask" prompt="Tell me about Honest DD">
      <Heading level={3}>Honest DD</Heading>
      <Paragraph>Intent-driven development with integrated specs.</Paragraph>
      <Row gap={2}>
        <Badge>DX</Badge>
        <Badge>npm</Badge>
      </Row>
    </Card>
  </Grid>
</Section>`,
  },
  {
    prompt: "a project deep-dive with a video",
    jsx: `<Section title="Mugaritz: OFF-ROAD (2015)">
  <Stack gap={4}>
    <Video src="https://player.vimeo.com/video/139784150" title="Mugaritz: OFF-ROAD" />
    <Paragraph>Documentary on the Michelin-starred restaurant by Pep Gatell — a visual interpretation of eighteen years of restaurant data.</Paragraph>
    <Row gap={2}>
      <Badge>Data viz</Badge>
      <Badge>Film</Badge>
      <Badge variant="outline">San Sebastián · Berlin</Badge>
    </Row>
    <Link href="https://vimeo.com/139784150" external={true}>Watch on Vimeo</Link>
  </Stack>
</Section>`,
  },
  {
    prompt: "a list of skills grouped by category",
    jsx: `<Section title="Skills">
  <Stack gap={4}>
    <Stack gap={2}>
      <Heading level={4}>AI & frontend</Heading>
      <List variant="bullet">
        <ListItem>TypeScript, React, Next.js</ListItem>
        <ListItem>LLM tooling — Mistral, Anthropic</ListItem>
        <ListItem>Generative interfaces</ListItem>
      </List>
    </Stack>
    <Stack gap={2}>
      <Heading level={4}>Creative coding</Heading>
      <List variant="bullet">
        <ListItem>openFrameworks, Processing</ListItem>
        <ListItem>WebGL, Pixi.js</ListItem>
        <ListItem>Audio-reactive systems</ListItem>
      </List>
    </Stack>
  </Stack>
</Section>`,
  },
];
