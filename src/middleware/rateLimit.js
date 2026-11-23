import rateLimit from 'express-rate-limit';

// Caps how many requests one IP can make, which slows down anyone guessing passwords or codes
function limiter(limit, minutes) {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-8', // tells the app when it can try again
    legacyHeaders: false,
    handler: (req, res) =>
      res.status(429).json({
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: `Too many attempts. Try again in ${minutes} minutes`,
        },
      }),
  });
}

export const registerLimiter = limiter(10, 15);
export const loginLimiter = limiter(10, 15);
export const verifyOtpLimiter = limiter(10, 15);
export const resendOtpLimiter = limiter(5, 15);
