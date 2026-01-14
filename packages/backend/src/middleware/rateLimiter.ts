import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Simple in-memory rate limiter (replace with Redis in production)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore: Map<string, RateLimitEntry> = new Map();

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

export const createRateLimiter = (options: RateLimitOptions) => {
  const { windowMs, maxRequests, message = 'Too many requests, please try again later.' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting for OPTIONS (CORS preflight) requests
    if (req.method === 'OPTIONS') {
      return next();
    }

    // Skip rate limiting in development (localhost)
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === 'localhost' || process.env.NODE_ENV !== 'production') {
      return next();
    }

    const now = Date.now();
    const entry = rateLimitStore.get(clientIp);

    // Clean up old entries
    if (entry && now > entry.resetTime) {
      rateLimitStore.delete(clientIp);
    }

    // Get or create entry
    const current = rateLimitStore.get(clientIp) || { count: 0, resetTime: now + windowMs };

    if (current.count >= maxRequests) {
      return res.status(429).json({ error: message });
    }

    current.count++;
    rateLimitStore.set(clientIp, current);
    next();
  };
};

export { router as rateLimitRouter };
