const SiteStats = require('../models/SiteStats.model.js');
const cache = require('../utils/cache.js');

const CACHE_KEY = 'site_stats';
const CACHE_TTL = 5 * 60 * 1000;

// @desc  Get homepage trust stats
// @route GET /api/stats
const getStats = async (req, res) => {
  try {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    let stats = await SiteStats.findOne();
    if (!stats) {
      stats = await SiteStats.create({});
    }

    const data = {
      yearsOfExperience: stats.yearsOfExperience,
      totalStudents: stats.totalStudents,
      totalSelections: stats.totalSelections,
      facultyCount: stats.facultyCount,
      examCategories: stats.examCategories,
      lastUpdated: stats.lastUpdated || stats.updatedAt
    };

    cache.set(CACHE_KEY, data, CACHE_TTL);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Stats fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch stats' });
  }
};

// @desc  Update homepage trust stats
// @route PUT /api/stats
// @access Private (Admin)
const updateStats = async (req, res) => {
  try {
    const { yearsOfExperience, totalStudents, totalSelections, facultyCount, examCategories } = req.body;
    const update = {
      ...(yearsOfExperience !== undefined && { yearsOfExperience: Number(yearsOfExperience) }),
      ...(totalStudents !== undefined && { totalStudents: Number(totalStudents) }),
      ...(totalSelections !== undefined && { totalSelections: Number(totalSelections) }),
      ...(facultyCount !== undefined && { facultyCount: Number(facultyCount) }),
      ...(examCategories !== undefined && { examCategories: Number(examCategories) }),
      lastUpdated: new Date()
    };

    const stats = await SiteStats.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true }
    );

    cache.invalidate(CACHE_KEY);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Stats update error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getStats, updateStats };
