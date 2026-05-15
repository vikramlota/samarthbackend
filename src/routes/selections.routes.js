const express = require('express');
const router = express.Router();
const {
  getSelections,
  adminListAll,
  adminCreate,
  adminUpdate,
  adminDelete,
} = require('../controllers/selections.controller.js');
const { protect, requireAdmin } = require('../middlewares/auth.middleware.js');
const { upload } = require('../middlewares/upload.middleware.js');
const { publicReadLimiter } = require('../middlewares/rateLimiter.middleware.js');

// Admin routes first (before wildcard /:id)
router.get('/admin/all', protect, adminListAll);
router.post('/admin', protect, upload.single('photo'), adminCreate);
router.put('/admin/:id', protect, upload.single('photo'), adminUpdate);
router.delete('/admin/:id', requireAdmin, adminDelete);

// Public
router.get('/', publicReadLimiter, getSelections);

module.exports = router;

