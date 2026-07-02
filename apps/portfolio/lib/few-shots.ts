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
  <Grid cols={2} gap={8}>
    <Card onClick="ask" prompt="Tell me about Mugaritz: OFF-ROAD">
      <Image src="/projects/mugaritz.jpg" alt="Mugaritz: OFF-ROAD — 2015" />
      <Heading level={3}>Mugaritz: OFF-ROAD</Heading>
      <Paragraph>Documentary visualising 18 years of Michelin-starred restaurant data.</Paragraph>
      <Row gap={2}>
        <Badge>Data viz</Badge>
        <Badge>Film</Badge>
      </Row>
    </Card>
    <Card onClick="ask" prompt="Tell me about APOLO — Nitsa">
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

export const reposSample = `<Section title="Open source">
  <Grid cols={2} gap={8}>
    <Card onClick="ask" prompt="Tell me about Honest Driven Development">
      <Image src="/icons/github.svg" alt="GitHub" />
      <Heading level={3}>Honest Driven Development</Heading>
      <Paragraph>Intent-driven development with integrated specs — npm package, zero runtime.</Paragraph>
      <Row gap={2}>
        <Badge>DX</Badge>
        <Badge>AI tooling</Badge>
      </Row>
    </Card>
    <Card onClick="ask" prompt="Tell me about Generative Semantic UI">
      <Image src="/icons/github.svg" alt="GitHub" />
      <Heading level={3}>Generative Semantic UI</Heading>
      <Paragraph>Constrained JSX vocabulary letting LLMs render real UI — like HTML for AI agents.</Paragraph>
      <Row gap={2}>
        <Badge>TypeScript</Badge>
        <Badge>LLMs</Badge>
      </Row>
    </Card>
  </Grid>
</Section>`;

// A single PROJECT drilled into. The shape echoes designs/detail/: a hero
// media block (the project's OWN video, or images[0] if it has no video),
// a title carrying year + location, a prose↔meta split, and a grid of the
// project's OWN supporting images[1..]. Collaborators come from the entry's
// `collaborators` array. Never borrow another entry's media.
export const detailSample = `<Section title="Mugaritz: OFF-ROAD (2015 · Barcelona)">
  <Stack gap={8}>
    <Video src="https://player.vimeo.com/video/139784150" title="Mugaritz: OFF-ROAD" />
    <Grid cols={3} gap={8}>
      <Stack gap={4} span={2}>
        <Paragraph>Documentary on the Michelin-starred restaurant by Pep Gatell (La Fura dels Baus) — a visual interpretation of 18 years of restaurant data. Selected at San Sebastián and Berlin film festivals.</Paragraph>
      </Stack>
      <Stack gap={6}>
        <Stack gap={2}>
          <Heading level={4}>Role</Heading>
          <Paragraph>Visual data scripting & infographic design</Paragraph>
        </Stack>
        <Stack gap={2}>
          <Heading level={4}>Collaborators</Heading>
          <Row gap={2}>
            <Badge variant="outline">Pep Gatell</Badge>
            <Badge variant="outline">Fritz Gnad</Badge>
          </Row>
        </Stack>
        <Stack gap={2}>
          <Heading level={4}>Tags</Heading>
          <Row gap={2}>
            <Badge>Data viz</Badge>
            <Badge>Film</Badge>
          </Row>
        </Stack>
      </Stack>
    </Grid>
    <Grid cols={2} gap={6}>
      <Image src="https://www.pelayomendez.dev/img/mugaritz2.jpg" alt="Mugaritz: OFF-ROAD — detail" />
      <Image src="https://www.pelayomendez.dev/img/mugaritz3.jpg" alt="Mugaritz: OFF-ROAD — detail" />
    </Grid>
  </Stack>
</Section>`;

// A single open-source REPO drilled into. Repos carry NO video and NO
// project image in the dataset — so this shape has neither. It is a clean
// text + tags + GitHub link card. NEVER borrow a `<Video>`/`<Image>` from
// a project here.
export const repoDetailSample = `<Section title="Honest Driven Development (2026)">
  <Stack gap={4}>
    <Paragraph>A lightweight take on intent-driven development with integrated specs. Pitched as a counter to AI coding tools that ship before you've thought.</Paragraph>
    <Row gap={2}>
      <Badge>DX</Badge>
      <Badge>AI tooling</Badge>
      <Badge>npm</Badge>
    </Row>
    <Paragraph>Published: npm: honestdd</Paragraph>
    <Link href="https://github.com/pelayomendez/honest-dd" external={true}>View on GitHub</Link>
  </Stack>
</Section>`;
