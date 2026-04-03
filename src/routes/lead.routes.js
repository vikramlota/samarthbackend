const express = require('express');
const router = express.Router();
const { submitLead, getLeads } = require('../controllers/Leadcontroller.js');
const { protect } = require('../middlewares/auth.middleware.js');

router.post('/', submitLead); // Public
router.get('/', protect, getLeads); // Admin only

module.exports = router;