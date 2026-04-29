const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  courseSlug:      { type: String, required: true, lowercase: true, index: true },
  name:            { type: String, required: true },
  startDate:       { type: Date, required: true, index: true },
  endDate:         { type: Date },
  timing:          { type: String, required: true },
  faculty:         { type: String, required: true },
  totalSeats:      { type: Number, required: true },
  seatsAvailable:  { type: Number, required: true },
  mode:            { type: String, enum: ['classroom', 'online', 'hybrid'], default: 'classroom' },
  active:          { type: Boolean, default: true, index: true },
  featured:        { type: Boolean, default: false },
}, { timestamps: true });

BatchSchema.index({ courseSlug: 1, active: 1, startDate: 1 });

module.exports = mongoose.model('Batch', BatchSchema);
