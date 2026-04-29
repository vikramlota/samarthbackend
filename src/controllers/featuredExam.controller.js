const FeaturedExam = require('../models/FeaturedExam.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const cache = require('../utils/cache.js');

const CACHE_KEY = 'featured_exam';
const CACHE_TTL = 10 * 60 * 1000;

// @desc  Get currently active featured exam
// @route GET /api/featured-exam
const getFeaturedExam = async (req, res) => {
  try {
    // Wrap cached value in an object so null (no active exam) is distinguishable from a cache miss
    const cached = cache.get(CACHE_KEY);
    if (cached !== null) {
      return res.json({ success: true, data: cached.data });
    }

    const now = new Date();
    const exam = await FeaturedExam.findOne({
      isActive: true,
      $or: [
        { validUntil: { $exists: false } },
        { validUntil: null },
        { validUntil: { $gte: now } }
      ]
    }).sort({ updatedAt: -1 });

    const data = exam || null;
    cache.set(CACHE_KEY, { data }, CACHE_TTL);

    res.json({ success: true, data });
  } catch (error) {
    console.error('Featured exam fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch featured exam' });
  }
};

// @desc  Create or update the featured exam (single document upsert)
// @route PUT /api/featured-exam
// @access Private (Admin)
const upsertFeaturedExam = async (req, res) => {
  try {
    const body = { ...req.body };

    // Parse highlights array if sent as a JSON string
    if (typeof body.highlights === 'string') {
      try { body.highlights = JSON.parse(body.highlights); } catch (e) {}
    }

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) body.image = result.secure_url;
    }

    const exam = await FeaturedExam.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    cache.invalidate(CACHE_KEY);
    res.json({ success: true, data: exam });
  } catch (error) {
    console.error('Featured exam update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc  Deactivate the featured exam
// @route DELETE /api/featured-exam
// @access Private (Admin)
const deactivateFeaturedExam = async (req, res) => {
  try {
    await FeaturedExam.updateMany({}, { $set: { isActive: false } });
    cache.invalidate(CACHE_KEY);
    res.json({ success: true, message: 'Featured exam deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getFeaturedExam, upsertFeaturedExam, deactivateFeaturedExam };
