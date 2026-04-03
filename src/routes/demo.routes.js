const express = require('express');
const router = express.Router();
const { createDemoRequest, getDemoRequests, updateDemoStatus, deleteDemoRequest } = require('../controllers/demo.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

// Public route to submit
router.route('/').post(createDemoRequest);

// Protected Admin Routes
router.route('/').get(protect, getDemoRequests);
router.route('/:id').put(protect, updateDemoStatus).delete(protect, deleteDemoRequest);

module.exports = router;