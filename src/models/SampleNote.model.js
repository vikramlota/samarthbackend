const mongoose = require('mongoose');

const SampleNoteSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  category:     { type: String, trim: true, index: true },
  description:  { type: String, trim: true },
  driveUrl:     { type: String, required: true, trim: true },
  icon:         { type: String, default: 'FaFileAlt' },
  displayOrder: { type: Number, default: 0 },
  active:       { type: Boolean, default: true, index: true },
  featured:     { type: Boolean, default: false },
}, { timestamps: true });

SampleNoteSchema.index({ active: 1, displayOrder: 1 });

module.exports = mongoose.model('SampleNote', SampleNoteSchema);
