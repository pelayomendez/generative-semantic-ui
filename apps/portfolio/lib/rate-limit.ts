// Simple in-memory per-IP rate limiter. Good enough for a single-instance
// deployment. For multi-region / multi-instance, swap for Upstash Redis.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  if (existing.count >= max) {
    return {
      ok: false,
      remaining: 0,
      resetInSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: max - existing.count,
    resetInSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}
