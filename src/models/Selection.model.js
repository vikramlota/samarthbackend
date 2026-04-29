const mongoose = require('mongoose');

const SelectionSchema = new mongoose.Schema({
  name:         { type: String, required: [true, 'Student name is required'], trim: true },
  photo:        { type: String },
  exam:         { type: String, required: [true, 'Exam name is required'], trim: true },
  examTag:      { type: String, lowercase: true, index: true }, // matches landing page slug pattern, e.g. "ssc-cgl"
  year:         { type: Number, required: [true, 'Year is required'], index: true },
  rank:         { type: String },
  post:         { type: String },
  quote:        { type: String },
  featured:     { type: Boolean, default: false },
  active:       { type: Boolean, default: true },
  published:    { type: Boolean, default: true }, // kept for backward-compat
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

SelectionSchema.index({ examTag: 1, active: 1, year: -1 });
SelectionSchema.index({ featured: 1, active: 1 });

module.exports = mongoose.model('Selection', SelectionSchema);
