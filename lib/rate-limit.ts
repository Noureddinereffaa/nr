/**
 * Rate Limiting Middleware for API Routes
 * Prevents abuse and spam attacks
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private requests: Map<string, RateLimitEntry> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Clean up old entries every minute
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.requests.entries()) {
            if (now > entry.resetTime) {
                this.requests.delete(key);
            }
        }
    }

    check(
        identifier: string,
        maxRequests: number = 5,
        windowMs: number = 60000
    ): { allowed: boolean; retryAfter?: number; remaining?: number } {
        const now = Date.now();
        const entry = this.requests.get(identifier);

        if (!entry || now > entry.resetTime) {
            // First request or window expired
            this.requests.set(identifier, {
                count: 1,
                resetTime: now + windowMs
            });
            return { allowed: true, remaining: maxRequests - 1 };
        }

        if (entry.count >= maxRequests) {
            // Rate limit exceeded
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
            return { allowed: false, retryAfter };
        }

        // Increment count
        entry.count++;
        this.requests.set(identifier, entry);
        return { allowed: true, remaining: maxRequests - entry.count };
    }

    reset(identifier: string) {
        this.requests.delete(identifier);
    }

    destroy() {
        clearInterval(this.cleanupInterval);
        this.requests.clear();
    }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Express/Vercel middleware function
 */
export function rateLimit(options: {
    maxRequests?: number;
    windowMs?: number;
    keyGenerator?: (req: any) => string;
} = {}) {
    const {
        maxRequests = 5,
        windowMs = 60000,
        keyGenerator = (req: any) =>
            req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            'unknown'
    } = options;

    return (req: any, res: any, next?: () => void) => {
        const key = keyGenerator(req);
        const result = rateLimiter.check(key, maxRequests, windowMs);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        if (result.remaining !== undefined) {
            res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
        }

        if (!result.allowed) {
            res.setHeader('Retry-After', result.retryAfter!.toString());
            return res.status(429).json({
                error: 'Too Many Requests',
                message: 'يرجى الانتظار قبل إرسال طلب آخر',
                retryAfter: result.retryAfter
            });
        }

        if (next) next();
    };
}

/**
 * Client-side rate limiter (for preventing spam from UI)
 */
export class ClientRateLimiter {
    private lastRequest: number = 0;
    private requestCount: number = 0;
    private resetTime: number = 0;

    canMakeRequest(minInterval: number = 1000, maxPerMinute: number = 10): boolean {
        const now = Date.now();

        // Check minimum interval between requests
        if (now - this.lastRequest < minInterval) {
            return false;
        }

        // Check max requests per minute
        if (now > this.resetTime) {
            this.requestCount = 0;
            this.resetTime = now + 60000;
        }

        if (this.requestCount >= maxPerMinute) {
            return false;
        }

        this.lastRequest = now;
        this.requestCount++;
        return true;
    }

    reset() {
        this.lastRequest = 0;
        this.requestCount = 0;
        this.resetTime = 0;
    }
}
