// Concrete examples of the JSX shape the LLM should emit per response
// mode. Consumed by the portfolio system prompt at
// `apps/portfolio/app/api/generate/route.ts`.
//
// Each export is a literal JSX string — the same vocabulary that runs
// in production. They demonstrate *what* a given response shape looks
// like; the prose rules above the dataset describe *when* to use each.
// The two reinforce each other; don't drop the prose rules.

export const homeSample = `<Hero eyebrow="Generative portfolio">
  <Heading level={1}>Pelayo Méndez</Heading>
  <Paragraph>Creative software developer & lead based in Barcelona. Ask anything — the page renders the answer.</Paragraph>
  <Row gap={2}>
    <Badge variant="outline">Selected work</Badge>
    <Badge variant="outline">About me</Badge>
  </Row>
</Hero>`;

export const aboutSample = `<Stack gap={4}>
  <Avatar src="/portrait.jpg" alt="Pelayo Méndez" size="lg" />
  <Heading level={1}>Pelayo Méndez</Heading>
  <Paragraph>I'm a creative coder turned software lead, fascinated by how technology can mirror the poetic essence of written language.</Paragraph>
  <Paragraph>After a decade designing interactive performances, installations and audio-reactive concerts with companies like La Fura dels Baus, I'm now focused on AI-driven interfaces and developer tooling — bringing the same generative sensibility to the way humans and language models share a screen.</Paragraph>
  <Row gap={3}>
    <Link href="https://github.com/pelayomendez" external={true}>GitHub</Link>
    <Link href="https://www.linkedin.com/in/pelayomendez/" external={true}>LinkedIn</Link>
  </Row>
</Stack>`;

export const gallerySample = `<Section title="Selected work">
  <Grid cols={2} gap={6}>
    <Card>
      <Image src="/projects/mugaritz.jpg" alt="Mugaritz: OFF-ROAD — 2015" />
      <Heading level={3}>Mugaritz: OFF-ROAD</Heading>
      <Paragraph>Documentary visualising 18 years of Michelin-starred restaurant data.</Paragraph>
      <Row gap={2}>
        <Badge>Data viz</Badge>
        <Badge>Film</Badge>
      </Row>
    </Card>
    <Card>
      <Image src="/projects/apolo.jpg" alt="APOLO — Nitsa — 2018" />
      <Heading level={3}>APOLO — Nitsa</Heading>
      <Paragraph>Interactive dance room with a large-scale LED grid in Barcelona's Nitsa club.</Paragraph>
      <Row gap={2}>
        <Badge>Interactive</Badge>
        <Badge>LED</Badge>
      </Row>
    </Card>
  </Grid>
</Section>`;

export const detailSample = `<Section title="Mugaritz: OFF-ROAD (2015)">
  <Stack gap={4}>
    <Video src="https://player.vimeo.com/video/139784150" title="Mugaritz: OFF-ROAD" />
    <Paragraph>Documentary on the Michelin-starred restaurant by Pep Gatell — a visual interpretation of 18 years of restaurant data. Selected at San Sebastián and Berlin film festivals.</Paragraph>
    <Row gap={2}>
      <Badge>Data viz</Badge>
      <Badge>Film</Badge>
    </Row>
    <Paragraph>Role: Visual data scripting & infographic design — Barcelona, 2015.</Paragraph>
  </Stack>
</Section>`;
