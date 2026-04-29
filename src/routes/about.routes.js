const express = require('express');
const router = express.Router();
const { getAbout, updateAbout, updateSection, uploadPhoto } = require('../controllers/about.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { upload } = require('../middlewares/upload.middleware.js');
const { publicReadLimiter } = require('../middlewares/rateLimiter.middleware.js');

// PUBLIC
router.get('/', publicReadLimiter, getAbout);

// ADMIN — full doc replace
router.put('/admin', protect, updateAbout);

// ADMIN — single section update (avoids sending the entire doc each time)
router.patch('/admin/:section', protect, updateSection);

// ADMIN — photo upload (returns Cloudinary URL, admin pastes into the section form)
router.post('/admin/upload', protect, upload.single('photo'), uploadPhoto);

module.exports = router;
