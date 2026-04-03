/**
 * Simple in-memory caching utility for Express backend
 * Stores cached data with TTL (Time To Live)
 * 
 * Usage:
 * - cache.set(key, value, ttl)
 * - cache.get(key)
 * - cache.invalidate(key)
 * - cache.clear()
 */

class Cache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Set a cache entry with optional TTL (in milliseconds)
   * Default TTL: 5 minutes
   */
  set(key, value, ttl = 5 * 60 * 1000) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl
    });

    // Set auto-expiry timer
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.invalidate(key);
        console.log(`⏱️  Cache expired for key: ${key}`);
      }, ttl);

      this.timers.set(key, timer);
    }

    console.log(`💾 Cache SET: ${key} (TTL: ${ttl}ms)`);
  }

  /**
   * Get a cached value
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      console.log(`❌ Cache MISS: ${key}`);
      return null;
    }

    // Check if expired
    if (cached.ttl > 0 && Date.now() - cached.timestamp > cached.ttl) {
      this.invalidate(key);
      console.log(`⏰ Cache EXPIRED: ${key}`);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);
    return cached.data;
  }

  /**
   * Invalidate a specific cache entry
   */
  invalidate(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    if (this.cache.has(key)) {
      this.cache.delete(key);
      console.log(`🗑️  Cache INVALIDATED: ${key}`);
      return true;
    }

    return false;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
    console.log(`🧹 Cache CLEARED`);
  }

  /**
   * Get cache statistics
   */
  stats() {
    return {
      entries: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
module.exports = new Cache();
