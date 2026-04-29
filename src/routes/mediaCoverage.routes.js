const express = require('express');
const router = express.Router();
const { getMediaCoverage, adminListAll, adminCreate, adminUpdate, adminDelete } = require('../controllers/mediaCoverage.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { upload } = require('../middlewares/upload.middleware.js');
const { publicReadLimiter } = require('../middlewares/rateLimiter.middleware.js');

// Admin routes first (before potential wildcards)
router.get('/admin/all', protect, adminListAll);
router.post('/admin', protect, upload.single('outletLogo'), adminCreate);
router.put('/admin/:id', protect, upload.single('outletLogo'), adminUpdate);
router.delete('/admin/:id', protect, adminDelete);

// Public
router.get('/', publicReadLimiter, getMediaCoverage);

module.exports = router;
