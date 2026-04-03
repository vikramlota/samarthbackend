const express = require('express');
const router = express.Router();
const { getHomepageData } = require('../controllers/homepage.controller.js');

/**
 * GET /api/homepage
 * Aggregated endpoint for homepage data
 * Returns: courses, updates, successStories, currentAffairs
 */
router.get('/', getHomepageData);

module.exports = router;
