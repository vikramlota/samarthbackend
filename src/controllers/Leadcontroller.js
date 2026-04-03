const Lead = require('../models/Lead.model.js');

// @desc    Submit form
// @route   POST /api/leads
const submitLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private (Admin)
const getLeads = async (req, res) => {
  const leads = await Lead.find({}).sort({ submittedAt: -1 });
  res.json(leads);
};

module.exports = { submitLead, getLeads };