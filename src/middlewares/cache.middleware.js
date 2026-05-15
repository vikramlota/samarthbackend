const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return res.json(cached.data);
  }

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
    return originalJson(data);
  };

  next();
}

module.exports = cacheMiddleware;
