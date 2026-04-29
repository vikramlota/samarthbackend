const express = require('express');
const router = express.Router();
const { getFeaturedExam, upsertFeaturedExam, deactivateFeaturedExam } = require('../controllers/featuredExam.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { upload } = require('../middlewares/upload.middleware.js');

router.get('/', getFeaturedExam);
router.put('/', protect, upload.single('image'), upsertFeaturedExam);
router.delete('/', protect, deactivateFeaturedExam);

module.exports = router;
