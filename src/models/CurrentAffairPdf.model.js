const mongoose = require('mongoose');

const CurrentAffairPdfSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  month:        { type: String, trim: true, index: true },   // e.g. "November 2025"
  year:         { type: Number, index: true },               // e.g. 2025
  category:     { type: String, trim: true, index: true },   // SSC, Banking, General, etc.
  description:  { type: String, trim: true },
  driveUrl:     { type: String, required: true, trim: true },
  icon:         { type: String, default: 'FaFilePdf' },
  displayOrder: { type: Number, default: 0 },
  active:       { type: Boolean, default: true, index: true },
  featured:     { type: Boolean, default: false },
}, { timestamps: true });

CurrentAffairPdfSchema.index({ active: 1, displayOrder: 1 });

module.exports = mongoose.model('CurrentAffairPdf', CurrentAffairPdfSchema);
