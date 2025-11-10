# Rate Limiting Documentation

NantucketPros implements production-ready rate limiting to protect API routes from abuse, spam, and fraud.

## Overview

The rate limiting system provides:
- **Protection against abuse**: Prevents malicious actors from overwhelming the API
- **Spam prevention**: Limits email sending to prevent spam
- **Fraud prevention**: Restricts Stripe operations to prevent fraudulent activity
- **Flexible deployment**: Works in development (in-memory) and production (Redis)
- **User-friendly responses**: Returns 429 with retry information when limits are exceeded

## Architecture

### Dual-Mode Operation

The system automatically adapts based on environment:

1. **Development Mode** (Default)
   - Uses in-memory storage
   - No external dependencies required
   - Automatically cleans up old entries every 5 minutes
   - Perfect for local development

2. **Production Mode** (Optional)
   - Uses Upstash Redis for distributed rate limiting
   - Works across serverless instances
   - Recommended for production deployments
   - Activated by setting `UPSTASH_REDIS_REST_URL` environment variable

### Rate Limit Configuration

Pre-configured limits for common use cases:

| Route Type | Limit | Window | Use Case |
|------------|-------|--------|----------|
| **EMAIL** | 10 requests | 1 hour | Email sending (spam prevention) |
| **BOOKING** | 20 requests | 1 hour | Booking operations (abuse prevention) |
| **STRIPE** | 5 requests | 1 minute | Payment operations (fraud prevention) |
| **WEBHOOK** | 100 requests | 1 minute | Webhook processing (DoS prevention) |
| **API** | 100 requests | 1 minute | General API calls (default limit) |

## Implementation

### Protected Routes

The following API routes are rate limited:

#### Email Routes
```
POST /api/emails/send
```
- **Limit**: 10 emails per hour per user
- **Identifier**: User ID (if authenticated), IP address (if not)
- **Purpose**: Prevent email spam and abuse

#### Booking Routes
```
POST /api/bookings/accept
```
- **Limit**: 20 requests per hour
- **Identifier**: User ID / IP address
- **Purpose**: Prevent booking manipulation

#### Stripe Routes
```
POST /api/stripe/create-account
GET  /api/bookings/payment-intent
```
- **Limit**: 5 requests per minute
- **Identifier**: User ID / IP address
- **Purpose**: Prevent fraudulent payment attempts

### Example Usage

To protect a new API route, wrap it with `withRateLimit`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    RATE_LIMITS.API, // or use custom config
    async () => {
      // Your API logic here
      return NextResponse.json({ success: true });
    }
  );
}
```

### Custom Rate Limits

Create custom configurations for specific needs:

```typescript
import { rateLimit, type RateLimitConfig } from '@/lib/rate-limit';

const customLimit: RateLimitConfig = {
  id: 'api:custom:my-endpoint',
  limit: 50,
  window: 300, // 5 minutes in seconds
};

export async function POST(request: NextRequest) {
  return withRateLimit(request, customLimit, async () => {
    // Your API logic
  });
}
```

## Response Format

### Success Response

When within limits, standard headers are added:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1699564800
```

### Rate Limit Exceeded

When limit is exceeded, returns `429 Too Many Requests`:

```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 1699564800
}
```

Headers:
```
Status: 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699564800
Retry-After: 45
```

## Setup

### Development (Default)

No setup required! Rate limiting works out of the box using in-memory storage.

### Production with Upstash Redis (Optional)

For production deployments with serverless architecture:

1. **Create Upstash Redis Database**
   - Sign up at [upstash.com](https://upstash.com)
   - Create a new Redis database
   - Select a region close to your deployment
   - Copy the REST API credentials

2. **Add Environment Variables**

Add to `.env.local` or your deployment platform:

```bash
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

3. **Deploy**

That's it! The system automatically detects Redis and uses it for distributed rate limiting.

## Monitoring

### Check Rate Limit Status

Rate limit headers are included in every API response:

```typescript
// Client-side example
const response = await fetch('/api/emails/send', {
  method: 'POST',
  body: JSON.stringify(data),
});

console.log('Limit:', response.headers.get('X-RateLimit-Limit'));
console.log('Remaining:', response.headers.get('X-RateLimit-Remaining'));
console.log('Reset:', response.headers.get('X-RateLimit-Reset'));
```

### Handle Rate Limit Errors

```typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  console.log(`Rate limited. Retry in ${retryAfter} seconds`);

  // Optional: Show user-friendly message
  const resetTime = new Date(
    parseInt(response.headers.get('X-RateLimit-Reset') || '0') * 1000
  );
  alert(`Too many requests. Please try again after ${resetTime.toLocaleTimeString()}`);
}
```

## Security Considerations

### Identifier Strategy

1. **Authenticated Users**: Rate limited by user ID
2. **Anonymous Users**: Rate limited by IP address
3. **Proxy/CDN Support**: Reads from `X-Forwarded-For` and `X-Real-IP` headers

### IP Spoofing Protection

When deployed behind a reverse proxy (Vercel, Cloudflare, etc.):
- Trusts `X-Forwarded-For` header from CDN
- Takes first IP in chain (original client IP)
- Falls back to `X-Real-IP` if available

### Storage Security

- **In-Memory**: Isolated per instance, automatic cleanup
- **Redis**: TLS-encrypted connections, API token authentication

## Performance

### In-Memory Mode
- **Latency**: < 1ms overhead
- **Throughput**: Unlimited (local)
- **Limitation**: Per-instance only (not shared across serverless functions)

### Redis Mode (Upstash)
- **Latency**: ~10-50ms overhead (network + Redis)
- **Throughput**: 10,000+ requests/second (Upstash limits)
- **Benefit**: Shared across all serverless instances

## Troubleshooting

### Rate Limit Too Strict

Adjust limits in `lib/rate-limit.ts`:

```typescript
export const RATE_LIMITS = {
  EMAIL: {
    id: 'api:emails:send',
    limit: 20, // Increased from 10
    window: 60 * 60,
  },
  // ...
};
```

### Redis Connection Issues

If Redis fails, system automatically falls back to in-memory:

```
Console: "Redis rate limit check failed, falling back to memory"
```

Check environment variables:
```bash
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN
```

### False Positives

If legitimate users are being rate limited:

1. Check if they're sharing an IP (corporate proxy, VPN)
2. Consider user-based limits instead of IP-based
3. Increase limits for specific routes
4. Implement allowlist for trusted IPs (if needed)

## Testing

### Manual Testing

```bash
# Test rate limit
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/emails/send \
    -H "Content-Type: application/json" \
    -H "Cookie: your-session-cookie" \
    -d '{"type":"test","data":{}}' \
    -i | grep -E "(HTTP|X-RateLimit)"
  echo "Request $i"
done
```

Expected: First 10 succeed, next 5 return 429.

### Automated Testing

Create tests in your test suite:

```typescript
import { rateLimit } from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  it('should allow requests within limit', async () => {
    const config = { id: 'test', limit: 5, window: 60 };
    const request = new NextRequest('http://localhost:3000/api/test');

    for (let i = 0; i < 5; i++) {
      const result = await rateLimit(request, config);
      expect(result.success).toBe(true);
    }
  });

  it('should block requests exceeding limit', async () => {
    const config = { id: 'test', limit: 5, window: 60 };
    const request = new NextRequest('http://localhost:3000/api/test');

    // Exceed limit
    for (let i = 0; i < 6; i++) {
      await rateLimit(request, config);
    }

    const result = await rateLimit(request, config);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });
});
```

## Migration Guide

### Adding to Existing Routes

1. Import rate limit utilities:
```typescript
import { withRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { NextRequest } from 'next/server'; // Change from Request
```

2. Change request type from `Request` to `NextRequest`

3. Wrap handler with `withRateLimit`:
```typescript
export async function POST(request: NextRequest) {
  return withRateLimit(request, RATE_LIMITS.API, async () => {
    // Existing code here
  });
}
```

4. Test the route to ensure it works correctly

## Future Enhancements

Potential improvements for future versions:

- [ ] Per-user custom limits (premium users get higher limits)
- [ ] Dynamic limits based on load
- [ ] Rate limit exemptions for admin users
- [ ] Dashboard for monitoring rate limit metrics
- [ ] Alerts when limits are frequently exceeded
- [ ] Geographic-based limits
- [ ] Time-of-day based limits

---

**Last Updated**: November 9, 2025
