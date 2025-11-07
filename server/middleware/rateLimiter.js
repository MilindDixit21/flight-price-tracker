// server/middleware/rateLimiter.js
import rateLimit from "express-rate-limit"

/**
 * Global API rate limiter middleware
 * -------------------------------------------------
 * Limits how many requests a client (IP) can make 
 * in a defined time window.
 *
 * - Use this on /api routes in app.js or selectively 
 *   per route (e.g., flights/search).
 * - For distributed environments, switch to a Redis store.
 */

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 60,                 // limit each IP to 60 requests per minute
  message: {
    ok: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,    // Disable deprecated headers
});
