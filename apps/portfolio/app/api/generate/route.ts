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
- Keep prose tight — one or two short paragraphs max per answer.
- Always emit a single root element.

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
    });

    const content = response.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content : "";
    if (!text) {
      return NextResponse.json(
        { error: "Model returned no content" },
        { status: 502 },
      );
    }

    return NextResponse.json({ jsx: extractJSX(text) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
