const rateLimit = require('express-rate-limit');

// Applies to /login and /signup specifically — generous enough for normal
// use/testing, tight enough to blunt a brute-force script.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in a few minutes.' },
});

module.exports = { authLimiter };
