const express = require('express');
const router = express.Router();
const { createDemoRequest, getDemoRequests, updateDemoStatus, deleteDemoRequest, adminListAll, adminStats } = require('../controllers/demo.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

// Public route to submit
router.route('/').post(createDemoRequest);

// Protected Admin Routes
router.route('/admin/all').get(protect, adminListAll);
router.route('/admin/stats/summary').get(protect, adminStats);

router.route('/').get(protect, getDemoRequests);
router.route('/:id').put(protect, updateDemoStatus).delete(protect, deleteDemoRequest);

module.exports = router;
