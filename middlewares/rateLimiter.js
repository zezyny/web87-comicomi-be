import rateLimit from 'express-rate-limit';

// Rate limiter for registration and login (adjust limits as needed)
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // Limit each IP to 100 requests 
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the RateLimit headers
    legacyHeaders: false, 
});