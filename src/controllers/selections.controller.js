const Selection = require('../models/Selection.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

// GET /api/selections?exam=ssc-cgl&featured=true&limit=8&year=2024
const getSelections = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 8, 100);
    const filter = { active: true };

    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.exam) filter.examTag = req.query.exam.toLowerCase();
    if (req.query.year)  filter.year = parseInt(req.query.year);

    const [data, total] = await Promise.all([
      Selection.find(filter)
        .sort({ displayOrder: 1, year: -1, createdAt: -1 })
        .limit(limit)
        .lean(),
      Selection.countDocuments(filter),
    ]);

    res.json({ success: true, data, total });
  } catch (error) {
    console.error('Selections fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch selections' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// GET /api/selections/admin/all
const adminListAll = async (req, res) => {
  try {
    const data = await Selection.find({}).sort({ year: -1, createdAt: -1 }).lean();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not fetch selections' });
  }
};

// POST /api/selections/admin
const adminCreate = async (req, res) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) body.photo = result.secure_url;
    }

    const selection = await Selection.create(body);
    res.status(201).json({ success: true, data: selection });
  } catch (error) {
    console.error('Selection create error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/selections/admin/:id
const adminUpdate = async (req, res) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) body.photo = result.secure_url;
    }

    const selection = await Selection.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!selection) return res.status(404).json({ success: false, error: 'Selection not found' });
    res.json({ success: true, data: selection });
  } catch (error) {
    console.error('Selection update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/selections/admin/:id  — soft delete
const adminDelete = async (req, res) => {
  try {
    const selection = await Selection.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!selection) return res.status(404).json({ success: false, error: 'Selection not found' });
    res.json({ success: true, message: 'Selection deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Keep old exports for backward compat with existing route file
const createSelection = adminCreate;
const updateSelection = adminUpdate;
const deleteSelection = async (req, res) => {
  try {
    const selection = await Selection.findByIdAndDelete(req.params.id);
    if (!selection) return res.status(404).json({ success: false, error: 'Selection not found' });
    res.json({ success: true, message: 'Selection removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getSelections,
  adminListAll,
  adminCreate,
  adminUpdate,
  adminDelete,
  // backward-compat aliases
  createSelection,
  updateSelection,
  deleteSelection,
};
