const Batch = require('../models/Batch.model.js');

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

// GET /api/batches?course=ssc-cgl&active=true
const getBatches = async (req, res) => {
  try {
    const { course, active = 'true' } = req.query;
    const filter = {};

    if (course) filter.courseSlug = course.toLowerCase();
    if (active === 'true') {
      filter.active = true;
      filter.startDate = { $gte: new Date() };
    }

    const batches = await Batch.find(filter).sort({ startDate: 1 }).lean();
    res.json({ success: true, data: batches });
  } catch (error) {
    console.error('Batches fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch batches' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// GET /api/batches/admin/all
const adminListAll = async (req, res) => {
  try {
    const batches = await Batch.find({}).sort({ startDate: -1 }).lean();
    res.json({ success: true, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch batches' });
  }
};

// POST /api/batches/admin
const adminCreate = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    console.error('Batch create error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/batches/admin/:id
const adminUpdate = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (error) {
    console.error('Batch update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/batches/admin/:id  — soft delete
const adminDelete = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
    res.json({ success: true, message: 'Batch deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getBatches, adminListAll, adminCreate, adminUpdate, adminDelete };
