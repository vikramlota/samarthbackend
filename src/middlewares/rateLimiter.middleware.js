// Simple in-memory rate limiter — no external dependency needed
// Used for public read endpoints (100 req/min per IP)

const store = new Map();

const createRateLimiter = ({ windowMs = 60 * 1000, max = 100, message = 'Too many requests, please try again later.' } = {}) => {
  return (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || req.socket?.remoteAddress
      || 'unknown';

    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      return res.status(429).json({ success: false, error: message });
    }

    entry.count++;
    next();
  };
};

// Pre-built limiter for public GET endpoints
const publicReadLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 100 });

module.exports = { createRateLimiter, publicReadLimiter };
