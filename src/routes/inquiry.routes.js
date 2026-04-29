const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  adminListAll,
  adminStats,
  adminGetById,
  adminUpdate,
  adminAddNote,
} = require('../controllers/inquiry.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { createRateLimiter } = require('../middlewares/rateLimiter.middleware.js');

// Strict rate limit for the public submission endpoint
const submitLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many submissions. Please try again in an hour.',
});

// ADMIN routes — register before any /:id wildcard
router.get('/admin/stats/summary', protect, adminStats);
router.get('/admin/all', protect, adminListAll);
router.get('/admin/:id', protect, adminGetById);
router.patch('/admin/:id', protect, adminUpdate);
router.post('/admin/:id/notes', protect, adminAddNote);

// PUBLIC submission
router.post('/', submitLimiter, submitInquiry);

module.exports = router;
