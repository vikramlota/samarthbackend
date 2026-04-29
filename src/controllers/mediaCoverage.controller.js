const MediaCoverage = require('../models/MediaCoverage.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

// GET /api/media-coverage?featured=true&limit=20
const getMediaCoverage = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const filter = { active: true };
    if (req.query.featured === 'true') filter.featured = true;

    const items = await MediaCoverage.find(filter)
      .sort({ displayOrder: 1, publishedDate: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Media coverage fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch media coverage' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// GET /api/media-coverage/admin/all
const adminListAll = async (req, res) => {
  try {
    const items = await MediaCoverage.find({}).sort({ publishedDate: -1 }).lean();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch media coverage' });
  }
};

// POST /api/media-coverage/admin
const adminCreate = async (req, res) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) body.outletLogo = result.secure_url;
    }

    const item = await MediaCoverage.create(body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Media coverage create error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/media-coverage/admin/:id
const adminUpdate = async (req, res) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) body.outletLogo = result.secure_url;
    }

    const item = await MediaCoverage.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Media coverage update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/media-coverage/admin/:id  — soft delete
const adminDelete = async (req, res) => {
  try {
    const item = await MediaCoverage.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Media coverage item deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getMediaCoverage, adminListAll, adminCreate, adminUpdate, adminDelete };
