import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 5 requests per 1 minute
// by default. We use an ephemeral cache for performance.
const cache = new Map();

// Initialize redis client only if keys are present (prevents crashes during build or dev without keys)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

/**
 * Standard rate limiter for critical actions (e.g. booking, login)
 * 5 requests per minute per IP.
 */
export const actionRateLimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
        ephemeralCache: cache,
    })
    : null;

/**
 * Stricter rate limiter for very sensitive actions (e.g. signup, password reset requests)
 * 3 requests per 15 minutes per IP.
 */
export const strictRateLimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "15 m"),
        analytics: true,
        ephemeralCache: cache,
    })
    : null;

/**
 * Helper to check rate limit and return appropriate response.
 * Fallback to allow if Redis is not configured (e.g., local dev).
 */
export async function checkRateLimit(
    limiter: Ratelimit | null,
    identifier: string,
    actionName: string = "Action"
): Promise<{ success: boolean; error?: string }> {
    if (!limiter) {
        console.warn(`[RateLimit] Redis not configured, skipping rate limit for ${actionName}`);
        return { success: true };
    }

    try {
        const { success } = await limiter.limit(identifier);
        if (!success) {
            console.warn(`[RateLimit] Blocked ${actionName} for ${identifier}`);
            return {
                success: false,
                error: "Too many requests. Please try again later."
            };
        }
        return { success: true };
    } catch (error) {
        console.error(`[RateLimit] Error checking limit for ${actionName}:`, error);
        // Fail open if Redis is down so we don't block legitimate users
        return { success: true };
    }
}
