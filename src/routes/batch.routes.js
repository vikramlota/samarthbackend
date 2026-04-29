const express = require('express');
const router = express.Router();
const { getBatches, adminListAll, adminCreate, adminUpdate, adminDelete } = require('../controllers/batch.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { publicReadLimiter } = require('../middlewares/rateLimiter.middleware.js');

// Admin routes first
router.get('/admin/all', protect, adminListAll);
router.post('/admin', protect, adminCreate);
router.put('/admin/:id', protect, adminUpdate);
router.delete('/admin/:id', protect, adminDelete);

// Public
router.get('/', publicReadLimiter, getBatches);

module.exports = router;
