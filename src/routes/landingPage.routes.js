const express = require('express');
const router = express.Router();
const {
  listLandingPages,
  getLandingPageBySlug,
  adminListAll,
  adminGetById,
  adminCreate,
  adminUpdate,
  adminSoftDelete,
  adminDuplicate,
} = require('../controllers/landingPage.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { validateLandingPage } = require('../middlewares/validation.middleware.js');
const { publicReadLimiter } = require('../middlewares/rateLimiter.middleware.js');

// ── PUBLIC ──────────────────────────────────────────────────────────────────────
// IMPORTANT: Admin routes MUST come before /:slug to avoid being swallowed by the wildcard

// GET /api/landing-pages
router.get('/', publicReadLimiter, listLandingPages);

// ── ADMIN ───────────────────────────────────────────────────────────────────────

// GET /api/landing-pages/admin/all
router.get('/admin/all', protect, adminListAll);

// GET /api/landing-pages/admin/:id
router.get('/admin/:id', protect, adminGetById);

// POST /api/landing-pages/admin
router.post('/admin', protect, validateLandingPage, adminCreate);

// PUT /api/landing-pages/admin/:id
router.put('/admin/:id', protect, validateLandingPage, adminUpdate);

// DELETE /api/landing-pages/admin/:id  (soft delete)
router.delete('/admin/:id', protect, adminSoftDelete);

// POST /api/landing-pages/admin/:id/duplicate
router.post('/admin/:id/duplicate', protect, adminDuplicate);

// ── PUBLIC (wildcard — MUST be last) ────────────────────────────────────────────

// GET /api/landing-pages/:slug
router.get('/:slug', publicReadLimiter, getLandingPageBySlug);

module.exports = router;
