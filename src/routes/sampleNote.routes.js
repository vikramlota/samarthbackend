const express = require('express');
const router = express.Router();
const { getSampleNotes, adminListAll, adminGetOne, adminCreate, adminUpdate, adminDelete } = require('../controllers/sampleNote.controller.js');
const { protect, requireAdmin } = require('../middlewares/auth.middleware.js');
const { publicReadLimiter } = require('../middlewares/rateLimiter.middleware.js');

// Admin routes first
router.get('/admin/all', protect, adminListAll);
router.get('/admin/:id', protect, adminGetOne);
router.post('/admin', protect, adminCreate);
router.put('/admin/:id', protect, adminUpdate);
router.delete('/admin/:id', requireAdmin, adminDelete);

// Public
router.get('/', publicReadLimiter, getSampleNotes);

module.exports = router;
