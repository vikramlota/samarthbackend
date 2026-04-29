const Faculty = require('../models/Faculty.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

// GET /api/faculty?exam=ssc-cgl&featured=true&limit=50
const getFaculty = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const filter = { active: true };
    if (req.query.exam) filter.examTags = req.query.exam.toLowerCase();
    if (req.query.featured === 'true') filter.featured = true;

    const faculty = await Faculty.find(filter)
      .select('-bio') // bio is heavy — exclude in list view
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: faculty });
  } catch (error) {
    console.error('Faculty fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch faculty' });
  }
};

// GET /api/faculty/:idOrSlug  — accepts MongoDB ObjectId OR URL slug
const getFacultyById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const mongoose = require('mongoose');

    const filter = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug, active: true }
      : { slug: idOrSlug.toLowerCase(), active: true };

    const member = await Faculty.findOne(filter);
    if (!member) return res.status(404).json({ success: false, error: 'Faculty not found' });
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Faculty by ID/slug error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch faculty' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// GET /api/faculty/admin/all
const adminListAll = async (req, res) => {
  try {
    const faculty = await Faculty.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch faculty' });
  }
};

// POST /api/faculty/admin
const adminCreate = async (req, res) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) body.photo = result.secure_url;
    }

    // Normalise examTags to array
    if (typeof body.examTags === 'string') {
      body.examTags = body.examTags.split(',').map(t => t.trim().toLowerCase());
    }

    const member = await Faculty.create(body);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    console.error('Faculty create error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/faculty/admin/:id
const adminUpdate = async (req, res) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) body.photo = result.secure_url;
    }

    if (typeof body.examTags === 'string') {
      body.examTags = body.examTags.split(',').map(t => t.trim().toLowerCase());
    }

    const member = await Faculty.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ success: false, error: 'Faculty not found' });
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Faculty update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/faculty/admin/:id  — soft delete
const adminDelete = async (req, res) => {
  try {
    const member = await Faculty.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!member) return res.status(404).json({ success: false, error: 'Faculty not found' });
    res.json({ success: true, message: 'Faculty deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getFaculty, getFacultyById, adminListAll, adminCreate, adminUpdate, adminDelete };
