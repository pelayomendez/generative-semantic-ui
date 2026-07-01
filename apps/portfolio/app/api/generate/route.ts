import { NextResponse, type NextRequest } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import { DEFAULT_PROMPT_RULES } from "@generative-semantic-ui/core";
import { portfolio } from "@/lib/data/portfolio";
import { rateLimit } from "@/lib/rate-limit";
import {
  homeSample,
  aboutSample,
  gallerySample,
  reposSample,
  detailSample,
  repoDetailSample,
} from "@/lib/few-shots";

export const runtime = "nodejs";

const MODEL = "mistral-small-latest";
const RATE_LIMIT = { max: 12, windowMs: 60 * 60 * 1000 }; // 12/hour per IP

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

const PORTFOLIO_SYSTEM = `${DEFAULT_PROMPT_RULES}

# Portfolio context

You are rendering the portfolio of ${portfolio.profile.name}, a ${portfolio.profile.headline.toLowerCase()} based in ${portfolio.profile.location}, currently at ${portfolio.profile.currentlyAt}.

You will be asked questions about Pelayo. Render your answer as JSX using the vocabulary above.

## Hard rules
- Use ONLY facts that appear in the dataset below. Never invent projects, companies, dates, or quotes.
- **The closed-dataset rule covers MEDIA too.** Only emit a \`<Video>\` or \`<Image>\` whose \`src\` is the \`video\` or an \`images[]\` URL belonging to THAT EXACT entry you are rendering. Never borrow a media URL from a different entry, and never invent one. An entry with no \`video\`/\`images\` (e.g. every \`openSource\` repo) gets NO \`<Video>\` and NO \`<Image>\` — render it as text + tags + a GitHub \`<Link external={true}>\` instead.
- The dataset is for YOUR reference. INLINE the actual text into the JSX as literal string children. NEVER write template-style references like \`{profile.bio[0]}\`, \`{project.name}\` — those are illegal expressions and will fail to render. Always paste the resolved string verbatim.
- **Contact privacy**: NEVER render an email address — not from the dataset (there isn't one), not invented, not even a placeholder like "name@domain". When asked "how do I get in touch?", "what's your email?", "contact you", or similar, render a short \`<Paragraph>\` pointing the visitor to GitHub and LinkedIn, and a \`<Row>\` of two \`<Link external={true}>\` elements using the URLs in \`contact.github\` and \`contact.linkedin\`. Do not provide an email even if the question presses for one.
- If asked something the dataset doesn't cover, render a short, honest \`<Paragraph>\` saying so, and offer one or two suggested follow-up questions inside a \`<Row>\` of \`<Badge>\`s.
- Visual identity: prefer \`<Hero>\` for top-level intros, \`<Section title>\` for grouped answers, \`<Card>\` for individual projects/roles, \`<Grid cols={2}>\` for showcases. Use \`<Badge>\` for tags. Use \`<Link external={true}>\` for external URLs.
- When asked to **introduce yourself** ("introduce yourself", "who are you?", "tell me about yourself"), lead the answer with \`<Avatar src="/portrait.jpg" alt="Pelayo Méndez" size="lg" />\` inside the outer wrapper, followed by a \`<Heading>\` with the name and a \`<Paragraph>\` or two of the bio inlined verbatim from the dataset.
- When asked about a SPECIFIC project (e.g. "tell me about Mugaritz", "what was Parsifal?"), render a rich detail view inside a \`<Section title="<Project name> (<year> · <location>)">\` wrapping a \`<Stack gap={8}>\` with, IN THIS ORDER: (1) a HERO MEDIA block — that project's OWN \`<Video>\` using its exact \`projects[i].video\` URL verbatim (never another project's); if it has no \`video\`, use its own \`images[0]\` as an \`<Image>\` instead; if it has neither, omit the hero. (2) A PROSE↔META split: a \`<Grid cols={2} gap={8}>\` whose FIRST cell is a \`<Stack gap={4}>\` containing a \`<Paragraph>\` of the summary inlined verbatim, and whose SECOND cell is a \`<Stack gap={6}>\` of metadata blocks — each block a \`<Stack gap={2}>\` with a \`<Heading level={4}>\` label and its values: a "Role" block (\`<Paragraph>\` of the \`role\`), a "Collaborators" block (a \`<Row gap={2}>\` of \`<Badge variant="outline">\` — one per name in the project's \`collaborators\` array; OMIT this block entirely if the project has no \`collaborators\`), and a "Tags" block (a \`<Row gap={2}>\` of \`<Badge>\` from \`tags\`). (3) SUPPORTING MEDIA: if the project has more than one image, a \`<Grid cols={2} gap={6}>\` of \`<Image>\` elements for the project's OWN \`images[1..]\` (paste each URL verbatim; omit this grid if there are no further images). Use ONLY that one project's own media and facts — never borrow from another entry.
- When asked about a SPECIFIC repo / open-source entry (e.g. "tell me about FableChat", "what is Honest Driven Development?"), render it inside a \`<Section title="<Repo name> (<year>)">\` as a \`<Stack gap={4}>\` containing, IN THIS ORDER: (1) a \`<Paragraph>\` of its \`summary\` inlined verbatim, (2) a \`<Row>\` of its tag \`<Badge>\`s, (3) a \`<Paragraph>\` reading \`Published: <published>\` ONLY if the entry has a \`published\` field (omit otherwise), (4) a \`<Link href="<href>" external={true}>View on GitHub</Link>\` using the entry's exact \`href\` — but ONLY if the entry HAS an \`href\`. An entry marked \`private: true\` (no \`href\`) has no public source: render NO outward link for it (omit clause 4 entirely; do not invent a URL). Repos have NO video and NO image — emit NEITHER a \`<Video>\` NOR an \`<Image>\` here. Use ONLY entries in the \`openSource\` array.
- When asked for "selected work" / "your projects" / similar, render a \`<Section title="Selected work">\` containing a \`<Grid cols={2}>\` of \`<Card>\`s. Each \`<Card>\` MUST carry \`onClick="ask"\` and \`prompt="Tell me about <Project name>"\` (the literal project name) so clicking it drills into that project, and MUST contain, IN THIS ORDER: (1) an \`<Image>\` whose \`src\` is the project's \`images[0]\` (paste the local \`/projects/...\` path verbatim from the dataset) and whose \`alt\` is \`"<Project name> — <year>"\` formatted from the same project, (2) a \`<Heading level={3}>\` with the project name, (3) a short \`<Paragraph>\` (one sentence, ≤140 chars), (4) a \`<Row>\` of tag \`<Badge>\`s. The \`<Image>\` MUST be the first child of \`<Card>\` — the adapter renders it as a full-bleed 16:9 cover automatically. Do NOT include the video in grid cells, only when zoomed into one project.
- When asked about **code / repositories / open-source / GitHub work**, render a \`<Section title="Open source">\` containing a \`<Grid cols={2}>\` of \`<Card>\`s. Each \`<Card>\` MUST carry \`onClick="ask"\` and \`prompt="Tell me about <Repo name>"\` (the literal repo name) so clicking it drills into that repo, and MUST contain, IN THIS ORDER: (1) an \`<Image src="/icons/github.svg" alt="GitHub" />\` as the first child — the adapter renders SVG icons as small inline marks, not stretched covers, (2) a \`<Heading level={3}>\` with the repo name from the dataset, (3) a short \`<Paragraph>\` (one sentence, ≤140 chars) drawn from the repo's \`summary\`, (4) a \`<Row>\` of tag \`<Badge>\`s from the repo's \`tags\`. Use ONLY entries in the \`openSource\` array of the dataset. The icon path is \`/icons/github.svg\` exactly — never invent another path.
- Keep prose tight — one or two short paragraphs max per answer.
- Inside grid cells (\`<Card>\` within \`<Grid>\`), each \`<Paragraph>\` MUST be a single short sentence — 140 characters or fewer. Long blurbs belong in a deep-dive view, not a grid card. This prevents responses from being clipped mid-sentence.
- Always emit a SINGLE root element. If your answer needs multiple sections (Hero + Section + Section), wrap them in an outer \`<Stack gap={8}>\`. Do not return sibling top-level elements.

## Bad vs good

BAD (template references — will fail to compile):
\`\`\`
<Paragraph>{profile.bio[0]}</Paragraph>
<Heading>{profile.name}</Heading>
<Link href={contact.github}>GitHub</Link>
\`\`\`

GOOD (text inlined verbatim from the dataset):
\`\`\`
<Paragraph>I'm a creative coder turned software lead, fascinated by how technology can mirror the poetic essence of written language.</Paragraph>
<Heading>Pelayo Méndez</Heading>
<Link href="https://github.com/pelayomendez" external={true}>GitHub</Link>
\`\`\`

## Few-shot examples

Concrete, vocabulary-only examples of the JSX shape to emit per question type. Don't copy them literally — adapt the *shape*, fill it with the actual facts from the dataset below.

// When the visitor lands or asks a generic "what is this?" — respond like this:
${homeSample}

// When the visitor asks "tell me about you", "who are you?", "introduce yourself" — respond like this:
${aboutSample}

// When the visitor asks "show your work", "your projects", "selected work" — respond like this:
${gallerySample}

// When the visitor asks about Pelayo's code / repositories / open-source / GitHub work — respond like this:
${reposSample}

// When the visitor asks about a SPECIFIC project (e.g. "tell me about Mugaritz") — respond like this:
${detailSample}

// When the visitor drills into a SPECIFIC repo / open-source entry (e.g. "tell me about FableChat") — respond like this (NO Video, NO Image):
${repoDetailSample}

## Dataset (verbatim — do not invent beyond this)

\`\`\`json
${JSON.stringify(portfolio, null, 2)}
\`\`\`
`;

function extractJSX(raw: string): string {
  let s = raw.trim();
  const fence = /^```(?:jsx|tsx|html)?\n([\s\S]*?)\n```$/;
  const match = fence.exec(s);
  if (match) s = match[1].trim();
  return s;
}

// Cheap structural check: detect clearly clipped output (unterminated
// string literal or an unclosed `<` at EOF). Not a full parser — just
// enough to flag "this almost certainly won't compile" before the client
// tries.
function looksTruncated(jsx: string): string | null {
  const s = jsx.trimEnd();
  if (!s) return "empty response";
  // Unclosed final tag — last `<` has no matching `>` after it.
  const lastOpen = s.lastIndexOf("<");
  const lastClose = s.lastIndexOf(">");
  if (lastOpen > lastClose) return "unclosed tag at end of response";
  // Unterminated string literal — scan for an odd count of unescaped
  // double quotes on the final line.
  const lastLine = s.split("\n").pop() ?? "";
  let quoteCount = 0;
  for (let i = 0; i < lastLine.length; i++) {
    if (lastLine[i] === '"' && lastLine[i - 1] !== "\\") quoteCount++;
  }
  if (quoteCount % 2 !== 0) return "unterminated string literal";
  return null;
}

// Defense-in-depth: if the model returned sibling top-level elements
// (which the compiler rejects), wrap them in a single Stack.
function ensureSingleRoot(jsx: string): string {
  const s = jsx.trim();
  // Count balanced top-level elements by walking through angle brackets.
  let depth = 0;
  let topLevelRoots = 0;
  let i = 0;
  while (i < s.length) {
    if (s[i] === "<") {
      const close = s.indexOf(">", i);
      if (close === -1) break;
      const tag = s.slice(i + 1, close);
      const isClosing = tag.startsWith("/");
      const isSelfClosing = tag.endsWith("/");
      if (depth === 0 && !isClosing) topLevelRoots += 1;
      if (isClosing) depth -= 1;
      else if (!isSelfClosing) depth += 1;
      i = close + 1;
    } else {
      i += 1;
    }
  }
  if (topLevelRoots <= 1) return s;
  return `<Stack gap={8}>\n${s}\n</Stack>`;
}

export async function POST(req: NextRequest) {
  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = (body.prompt ?? "").trim();
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "MISTRAL_API_KEY not configured on the server." },
      { status: 500 },
    );
  }

  const ip = getClientIp(req);
  const result = rateLimit(`portfolio:${ip}`, RATE_LIMIT);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: `Rate limit exceeded (${RATE_LIMIT.max}/hour). Resets in ${result.resetInSeconds}s.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(result.resetInSeconds) },
      },
    );
  }

  const mistral = new Mistral({ apiKey });

  try {
    const response = await mistral.chat.complete({
      model: MODEL,
      messages: [
        { role: "system", content: PORTFOLIO_SYSTEM },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      maxTokens: 4096,
    });

    const choice = response.choices?.[0];
    const content = choice?.message?.content;
    const text = typeof content === "string" ? content : "";
    if (!text) {
      return NextResponse.json(
        { error: "Model returned no content" },
        { status: 502 },
      );
    }

    const jsx = ensureSingleRoot(extractJSX(text));

    // Mistral returns finish_reason === "length" when the response was
    // capped by max_tokens. Combined with the structural check, this
    // tells the client to render a friendly fallback instead of a
    // half-parsed JSX dump.
    const finishReason = choice?.finishReason;
    const structural = looksTruncated(jsx);
    const truncated = finishReason === "length" || structural !== null;
    if (truncated) {
      const reason =
        finishReason === "length"
          ? "max_tokens reached"
          : (structural ?? "unknown truncation");
      console.warn("[generate] truncated response", { reason, finishReason });
      return NextResponse.json({ jsx, truncated: true, reason });
    }

    return NextResponse.json({ jsx, truncated: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
