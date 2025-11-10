/**
 * Rate Limiting Utility
 *
 * Provides rate limiting for API routes with:
 * - Upstash Redis support for production (optional)
 * - In-memory fallback for development
 * - Configurable limits per endpoint
 * - IP-based and user-based limiting
 */

import { NextRequest, NextResponse } from 'next/server';

// Rate limit configuration
export interface RateLimitConfig {
  /**
   * Unique identifier for this rate limit (e.g., 'api:emails:send')
   */
  id: string;

  /**
   * Maximum number of requests allowed
   */
  limit: number;

  /**
   * Time window in seconds
   */
  window: number;
}

// In-memory store for development
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

/**
 * Get client identifier from request
 * Uses user ID if authenticated, otherwise falls back to IP
 */
function getIdentifier(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;

  // Try to get IP from various headers (for proxy/CDN scenarios)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'anonymous';

  return `ip:${ip}`;
}

/**
 * In-memory rate limiter (for development)
 */
async function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const key = `${config.id}:${identifier}`;
  const now = Date.now();
  const windowMs = config.window * 1000;

  // Initialize or get existing record
  if (!store[key] || store[key].resetAt < now) {
    store[key] = {
      count: 0,
      resetAt: now + windowMs,
    };
  }

  const record = store[key];

  // Check if limit exceeded
  if (record.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: Math.floor(record.resetAt / 1000),
    };
  }

  // Increment counter
  record.count++;

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - record.count,
    reset: Math.floor(record.resetAt / 1000),
  };
}

/**
 * Upstash Redis rate limiter (for production)
 * Only used if UPSTASH_REDIS_REST_URL is configured
 */
async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Fall back to memory if Redis not configured
    return checkRateLimitMemory(identifier, config);
  }

  try {
    const key = `ratelimit:${config.id}:${identifier}`;
    const now = Math.floor(Date.now() / 1000);
    const window = config.window;

    // Use Redis pipeline for atomic operations
    const pipeline = [
      ['INCR', key],
      ['EXPIRE', key, window],
      ['TTL', key],
    ];

    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipeline),
    });

    if (!response.ok) {
      console.error('Redis rate limit check failed, falling back to memory');
      return checkRateLimitMemory(identifier, config);
    }

    const results = await response.json();
    const count = results[0].result as number;
    const ttl = results[2].result as number;
    const reset = now + ttl;

    const remaining = Math.max(0, config.limit - count);
    const success = count <= config.limit;

    return {
      success,
      limit: config.limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error('Redis rate limit error, falling back to memory:', error);
    return checkRateLimitMemory(identifier, config);
  }
}

/**
 * Main rate limiting function
 * Automatically chooses Redis (if configured) or in-memory
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  userId?: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const identifier = getIdentifier(request, userId);

  // Use Redis if configured, otherwise use in-memory
  if (process.env.UPSTASH_REDIS_REST_URL) {
    return checkRateLimitRedis(identifier, config);
  } else {
    return checkRateLimitMemory(identifier, config);
  }
}

/**
 * Middleware wrapper for rate limiting
 * Returns a 429 response if rate limit exceeded
 */
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>,
  userId?: string
): Promise<NextResponse> {
  const result = await rateLimit(request, config, userId);

  // Add rate limit headers to response
  const headers = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter: result.reset,
      },
      {
        status: 429,
        headers: {
          ...headers,
          'Retry-After': (result.reset - Math.floor(Date.now() / 1000)).toString(),
        },
      }
    );
  }

  // Execute handler and add headers
  const response = await handler();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Pre-configured rate limit configs for common use cases
 */
export const RATE_LIMITS = {
  // Strict limits for email sending (prevent spam)
  EMAIL: {
    id: 'api:emails:send',
    limit: 10, // 10 emails
    window: 60 * 60, // per hour
  },

  // Moderate limits for booking operations
  BOOKING: {
    id: 'api:bookings',
    limit: 20, // 20 requests
    window: 60 * 60, // per hour
  },

  // Tight limits for Stripe operations (prevent fraud)
  STRIPE: {
    id: 'api:stripe',
    limit: 5, // 5 requests
    window: 60, // per minute
  },

  // Webhook limits (prevent DoS)
  WEBHOOK: {
    id: 'api:webhooks',
    limit: 100, // 100 requests
    window: 60, // per minute
  },

  // General API limit
  API: {
    id: 'api:general',
    limit: 100, // 100 requests
    window: 60, // per minute
  },
} as const;
