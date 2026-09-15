const SampleNote = require('../models/SampleNote.model.js');

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

// GET /api/sample-notes
const getSampleNotes = async (req, res) => {
  try {
    const filter = { active: { $ne: false } };
    const notes = await SampleNote.find(filter).sort({ displayOrder: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('SampleNotes fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch sample notes' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// GET /api/sample-notes/admin/all
const adminListAll = async (req, res) => {
  try {
    const notes = await SampleNote.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sample notes' });
  }
};

// GET /api/sample-notes/admin/:id
const adminGetOne = async (req, res) => {
  try {
    const note = await SampleNote.findById(req.params.id).lean();
    if (!note) return res.status(404).json({ success: false, error: 'Sample note not found' });
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/sample-notes/admin
const adminCreate = async (req, res) => {
  try {
    const note = await SampleNote.create(req.body);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    console.error('SampleNote create error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/sample-notes/admin/:id
const adminUpdate = async (req, res) => {
  try {
    const note = await SampleNote.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, error: 'Sample note not found' });
    res.json({ success: true, data: note });
  } catch (error) {
    console.error('SampleNote update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/sample-notes/admin/:id  — soft delete
const adminDelete = async (req, res) => {
  try {
    const note = await SampleNote.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, error: 'Sample note not found' });
    res.json({ success: true, message: 'Sample note deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getSampleNotes, adminListAll, adminGetOne, adminCreate, adminUpdate, adminDelete };
