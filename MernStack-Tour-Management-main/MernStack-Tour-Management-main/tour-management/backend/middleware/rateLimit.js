const rateLimit = require('express-rate-limit');

// General rate limiting for all APIs
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Strict rate limiting for authentication endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again after 15 minutes',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiting for booking endpoints
const bookingRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 booking requests per hour
  message: {
    success: false,
    message: 'Too many booking requests, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many booking requests, please try again after 1 hour',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiting for payment endpoints
const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 payment requests per 15 minutes
  message: {
    success: false,
    message: 'Too many payment requests, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many payment requests, please try again after 15 minutes',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiting for review endpoints
const reviewRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 review requests per hour
  message: {
    success: false,
    message: 'Too many review requests, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many review requests, please try again after 1 hour',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Rate limiting for search endpoints
const searchRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 search requests per minute
  message: {
    success: false,
    message: 'Too many search requests, please try again after 1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many search requests, please try again after 1 minute',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// User-specific rate limiting (for authenticated users)
const userRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each user to 200 requests per 15 minutes
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user?.id || req.ip;
  },
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again after 15 minutes',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Admin rate limiting (more restrictive)
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each admin to 50 requests per 15 minutes
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  message: {
    success: false,
    message: 'Too many admin requests, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many admin requests, please try again after 15 minutes',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Custom rate limiting middleware for specific endpoints
const createCustomRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.round(req.rateLimit.resetTime / 1000)
      });
    }
  });
};

// Rate limiting for file uploads
const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: {
    success: false,
    message: 'Too many upload requests, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many upload requests, please try again after 1 hour',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

module.exports = {
  generalRateLimit,
  authRateLimit,
  bookingRateLimit,
  paymentRateLimit,
  reviewRateLimit,
  searchRateLimit,
  userRateLimit,
  adminRateLimit,
  createCustomRateLimit,
  uploadRateLimit
};
