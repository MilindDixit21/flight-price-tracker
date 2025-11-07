// server/providers/cache.js

/**
 * Simple in-memory cache provider.
 * (For production, replace with Redis or a persistent store.)
 */

const cache = new Map();

/**
 * Set cache value with expiration
 * @param {string} key - Unique cache key (e.g., "flights:JFK-LAX")
 * @param {any} value - Data to store
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 */
export const setCache = (key, value, ttl = 5 * 60 * 1000) => {
  const expires = Date.now() + ttl;
  cache.set(key, { value, expires });
};

/**
 * Get cache value if still valid
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

/**
 * Clear all cache (optional)
 */
export const clearCache = () => {
  cache.clear();
};
