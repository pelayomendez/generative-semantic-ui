import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getCanned } from "@/lib/canned";
import { generateJsx, GenerateError } from "@/lib/generate";

export const runtime = "nodejs";

// Single source of truth for the per-IP limit.
const RATE_LIMIT = { max: 12, windowMs: 60 * 60 * 1000 }; // 12/hour per IP

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
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

  // Canned answers (the landing chips) cost nothing: they are served before
  // the key check and the rate limit, so a reviewer clicking chips never
  // spends quota or sees an error.
  const canned = getCanned(prompt);
  if (canned) return NextResponse.json({ jsx: canned.jsx, truncated: false });

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

  try {
    return NextResponse.json(await generateJsx(prompt, apiKey));
  } catch (err) {
    if (err instanceof GenerateError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : "Upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
