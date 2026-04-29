const express = require('express');
const router = express.Router();
const { getFaculty, getFacultyById, adminListAll, adminCreate, adminUpdate, adminDelete } = require('../controllers/faculty.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { upload } = require('../middlewares/upload.middleware.js');
const { publicReadLimiter } = require('../middlewares/rateLimiter.middleware.js');

// PUBLIC — admin routes registered first (before /:id wildcard)
router.get('/admin/all', protect, adminListAll);
router.post('/admin', protect, upload.single('photo'), adminCreate);
router.put('/admin/:id', protect, upload.single('photo'), adminUpdate);
router.delete('/admin/:id', protect, adminDelete);

// PUBLIC (wildcard last) — /:idOrSlug accepts MongoDB ObjectId OR URL slug
router.get('/', publicReadLimiter, getFaculty);
router.get('/:idOrSlug', publicReadLimiter, getFacultyById);

module.exports = router;
