const express = require('express');
const router = express.Router();
const { getStats, updateStats } = require('../controllers/stats.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

router.get('/', getStats);
router.put('/', protect, updateStats);

module.exports = router;
