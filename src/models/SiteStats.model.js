const mongoose = require('mongoose');

const SiteStatsSchema = new mongoose.Schema({
  yearsOfExperience: { type: Number, default: 16 },
  totalStudents: { type: Number, default: 5000 },
  totalSelections: { type: Number, default: 1200 },
  facultyCount: { type: Number, default: 40 },
  examCategories: { type: Number, default: 20 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SiteStats', SiteStatsSchema);
