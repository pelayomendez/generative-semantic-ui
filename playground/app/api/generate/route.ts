import { NextResponse, type NextRequest } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import { DEFAULT_PROMPT_RULES } from "@generative-semantic-ui/core";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MODEL = "mistral-small-latest";
const DEMO_RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }; // 5/hour per IP on demo key

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function extractJSX(raw: string): string {
  // Strip markdown code fences the model sometimes adds despite instructions.
  let s = raw.trim();
  const fence = /^```(?:jsx|tsx|html)?\n([\s\S]*?)\n```$/;
  const match = fence.exec(s);
  if (match) s = match[1].trim();
  return s;
}

export async function POST(req: NextRequest) {
  let body: { prompt?: string; userApiKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = (body.prompt ?? "").trim();
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const userKey = (body.userApiKey ?? "").trim() || null;
  const serverKey = process.env.MISTRAL_API_KEY ?? null;
  const apiKey = userKey ?? serverKey;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "No API key. Set a Mistral API key in the playground or configure MISTRAL_API_KEY on the server.",
      },
      { status: 400 },
    );
  }

  if (!userKey) {
    // Using the shared demo key → rate limit by IP
    const ip = getClientIp(req);
    const result = rateLimit(`demo:${ip}`, DEMO_RATE_LIMIT);
    if (!result.ok) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded on demo key (${DEMO_RATE_LIMIT.max}/hour). Resets in ${result.resetInSeconds}s. Paste your own Mistral API key for unlimited use.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(result.resetInSeconds) },
        },
      );
    }
  }

  const mistral = new Mistral({ apiKey });

  try {
    const response = await mistral.chat.complete({
      model: MODEL,
      messages: [
        { role: "system", content: DEFAULT_PROMPT_RULES },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const content = response.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content : "";
    if (!text) {
      return NextResponse.json(
        { error: "Model returned no content" },
        { status: 502 },
      );
    }

    const jsx = extractJSX(text);
    return NextResponse.json({ jsx });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
