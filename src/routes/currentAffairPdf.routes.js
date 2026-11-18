const express = require('express');
const router = express.Router();
const {
  getPdfs,
  adminListAll,
  adminGetOne,
  adminCreate,
  adminUpdate,
  adminDelete,
} = require('../controllers/currentAffairPdf.controller.js');
const { protect, requireAdmin } = require('../middlewares/auth.middleware.js');
const { publicReadLimiter } = require('../middlewares/rateLimiter.middleware.js');

// Admin routes first (must come before public '/' to avoid collisions)
router.get('/admin/all', protect, adminListAll);
router.get('/admin/:id', protect, adminGetOne);
router.post('/admin', protect, adminCreate);
router.put('/admin/:id', protect, adminUpdate);
router.delete('/admin/:id', requireAdmin, adminDelete);

// Public
router.get('/', publicReadLimiter, getPdfs);

module.exports = router;
