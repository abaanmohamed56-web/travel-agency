export interface RateLimitResult {
  ok: boolean;
  retryAfterSec?: number;
}

export interface RateLimiter {
  check(key: string, limit: number, windowMs: number): RateLimitResult;
}

/**
 * Sliding-window in-memory limiter. Per-process only — fine for a single
 * node; swap in a Redis-backed implementation of the same interface when
 * scaling out.
 */
class InMemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();
  private lastPrune = Date.now();

  check(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    this.pruneOccasionally(now, windowMs);

    const windowStart = now - windowMs;
    const timestamps = (this.hits.get(key) ?? []).filter(
      (t) => t > windowStart
    );
    if (timestamps.length >= limit) {
      const retryAfterSec = Math.ceil(
        (timestamps[0] + windowMs - now) / 1000
      );
      this.hits.set(key, timestamps);
      return { ok: false, retryAfterSec: Math.max(retryAfterSec, 1) };
    }
    timestamps.push(now);
    this.hits.set(key, timestamps);
    return { ok: true };
  }

  private pruneOccasionally(now: number, windowMs: number) {
    if (now - this.lastPrune < 60_000) return;
    this.lastPrune = now;
    for (const [key, timestamps] of this.hits) {
      const alive = timestamps.filter((t) => t > now - windowMs);
      if (alive.length === 0) this.hits.delete(key);
      else this.hits.set(key, alive);
    }
  }
}

const globalStore = globalThis as unknown as { __raalhuRateLimiter?: RateLimiter };

export function getRateLimiter(): RateLimiter {
  globalStore.__raalhuRateLimiter ??= new InMemoryRateLimiter();
  return globalStore.__raalhuRateLimiter;
}

/** Chat runs are expensive: 10 per org per 10 minutes. */
export const CHAT_RUN_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 };
