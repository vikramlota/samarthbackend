const CurrentAffairPdf = require('../models/CurrentAffairPdf.model.js');

// ── PUBLIC ──────────────────────────────────────────────────────────────────────

// GET /api/current-affair-pdfs
const getPdfs = async (req, res) => {
  try {
    const filter = { active: { $ne: false } };
    const pdfs = await CurrentAffairPdf.find(filter)
      .sort({ displayOrder: 1, year: -1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: pdfs });
  } catch (error) {
    console.error('CurrentAffairPdf fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch PDFs' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// GET /api/current-affair-pdfs/admin/all
const adminListAll = async (req, res) => {
  try {
    const pdfs = await CurrentAffairPdf.find({})
      .sort({ displayOrder: 1, year: -1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: pdfs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch PDFs' });
  }
};

// GET /api/current-affair-pdfs/admin/:id
const adminGetOne = async (req, res) => {
  try {
    const pdf = await CurrentAffairPdf.findById(req.params.id).lean();
    if (!pdf) return res.status(404).json({ success: false, error: 'PDF entry not found' });
    res.json({ success: true, data: pdf });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/current-affair-pdfs/admin
const adminCreate = async (req, res) => {
  try {
    const pdf = await CurrentAffairPdf.create(req.body);
    res.status(201).json({ success: true, data: pdf });
  } catch (error) {
    console.error('CurrentAffairPdf create error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/current-affair-pdfs/admin/:id
const adminUpdate = async (req, res) => {
  try {
    const pdf = await CurrentAffairPdf.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!pdf) return res.status(404).json({ success: false, error: 'PDF entry not found' });
    res.json({ success: true, data: pdf });
  } catch (error) {
    console.error('CurrentAffairPdf update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/current-affair-pdfs/admin/:id  — soft delete
const adminDelete = async (req, res) => {
  try {
    const pdf = await CurrentAffairPdf.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!pdf) return res.status(404).json({ success: false, error: 'PDF entry not found' });
    res.json({ success: true, message: 'PDF entry deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getPdfs, adminListAll, adminGetOne, adminCreate, adminUpdate, adminDelete };
