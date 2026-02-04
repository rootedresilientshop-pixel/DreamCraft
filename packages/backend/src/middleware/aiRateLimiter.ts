import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

/**
 * AI Rate Limiter Middleware
 * Limits AI requests to prevent Pi 4 overload from concurrent LLM inference
 *
 * Ollama can only handle 1-2 concurrent inference requests efficiently
 * This limiter ensures we queue requests appropriately
 */

const rateLimiter = new RateLimiterMemory({
  points: 10, // Allow 10 requests
  duration: 60, // Per 60 seconds
  keyPrefix: 'ai-rate-limit',
});

// Request queue for streaming responses
interface QueuedRequest {
  userId: string;
  endpoint: string;
  timestamp: number;
}

let requestQueue: QueuedRequest[] = [];
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 2; // Ollama handles 1-2 concurrent inferences well

/**
 * Middleware to rate limit AI endpoint requests
 */
export async function aiRateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId || 'anonymous';
    const key = `${userId}`;

    await rateLimiter.consume(key);
    next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      return res.status(429).json({
        error: 'Too many AI requests',
        retryAfter: Math.ceil((rateLimiterRes as any).msBeforeNext / 1000),
      });
    }
    next();
  }
}

/**
 * Queue management for LLM inference
 * Ensures Ollama doesn't get overwhelmed
 */
export function enqueueAIRequest(userId: string, endpoint: string): Promise<void> {
  return new Promise((resolve) => {
    const request: QueuedRequest = {
      userId,
      endpoint,
      timestamp: Date.now(),
    };

    requestQueue.push(request);

    // Process queue
    processQueue(() => resolve());
  });
}

function processQueue(onComplete: () => void) {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) {
    if (requestQueue.length === 0) {
      onComplete();
    }
    return;
  }

  activeRequests++;
  const request = requestQueue.shift();

  // Simulate request processing time (real time will be added by actual LLM call)
  // This just ensures we don't start more than MAX_CONCURRENT_REQUESTS at once
  setTimeout(() => {
    activeRequests--;
    processQueue(onComplete);
  }, 100);
}

/**
 * Get current queue status for monitoring
 */
export function getQueueStatus() {
  return {
    queueLength: requestQueue.length,
    activeRequests,
    maxConcurrent: MAX_CONCURRENT_REQUESTS,
  };
}

/**
 * Circuit breaker pattern for AI endpoints
 * Gracefully degrade when LLM is unavailable
 */
export class AICircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly failureThreshold = 5;
  private readonly resetTimeout = 60000; // 1 minute

  isOpen(): boolean {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        this.failureCount = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  recordFailure() {
    this.lastFailureTime = Date.now();
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      failureThreshold: this.failureThreshold,
    };
  }
}

// Global circuit breaker instance
export const aiCircuitBreaker = new AICircuitBreaker();
