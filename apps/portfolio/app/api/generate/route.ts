import { NextResponse, type NextRequest } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import { DEFAULT_PROMPT_RULES } from "@generative-semantic-ui/core";
import { portfolio } from "@/lib/data/portfolio";
import { rateLimit } from "@/lib/rate-limit";

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
- The dataset is for YOUR reference. INLINE the actual text into the JSX as literal string children. NEVER write template-style references like \`{profile.bio[0]}\`, \`{project.name}\`, \`{contact.email}\` — those are illegal expressions and will fail to render. Always paste the resolved string verbatim.
- If asked something the dataset doesn't cover, render a short, honest \`<Paragraph>\` saying so, and offer one or two suggested follow-up questions inside a \`<Row>\` of \`<Badge>\`s.
- Visual identity: prefer \`<Hero>\` for top-level intros, \`<Section title>\` for grouped answers, \`<Card>\` for individual projects/roles, \`<Grid cols={2}>\` for showcases. Use \`<Badge>\` for tags. Use \`<Link external={true}>\` for external URLs.
- When asked to **introduce yourself** ("introduce yourself", "who are you?", "tell me about yourself"), lead the answer with \`<Avatar src="/portrait.jpg" alt="Pelayo Méndez" size="lg" />\` inside the outer wrapper, followed by a \`<Heading>\` with the name and a \`<Paragraph>\` or two of the bio inlined verbatim from the dataset.
- When asked about a SPECIFIC project (e.g. "tell me about Mugaritz", "what was Parsifal?"), render its \`<Video>\` (using \`projects[i].video\` verbatim) inside a \`<Section title="...">\`, followed by a \`<Paragraph>\` of the summary, a \`<Row>\` of \`<Badge>\` tags, and a small \`<Paragraph>\` line for the role and year/location.
- When asked for "selected work" / "your projects" / similar, render a \`<Section title="Selected work">\` containing a \`<Grid cols={2}>\` of \`<Card>\`s — each card is just \`<Heading level={3}>\`, a short \`<Paragraph>\`, and tag \`<Badge>\`s. Do NOT include the video in grid cells, only when zoomed into one project.
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

PROJECT DEEP-DIVE TEMPLATE (use exactly this shape when asked about one project):
\`\`\`
<Section title="Mugaritz: OFF-ROAD (2015)">
  <Stack gap={4}>
    <Video src="https://player.vimeo.com/video/139784150" title="Mugaritz: OFF-ROAD" />
    <Paragraph>Documentary on the Michelin-starred restaurant by Pep Gatell — a visual interpretation of 18 years of restaurant data. Selected at San Sebastián and Berlin film festivals.</Paragraph>
    <Row gap={2}>
      <Badge>Data viz</Badge>
      <Badge>Film</Badge>
    </Row>
    <Paragraph>Role: Visual data scripting & infographic design — Barcelona, 2015.</Paragraph>
  </Stack>
</Section>
\`\`\`

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
