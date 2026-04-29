const mongoose = require('mongoose');

const FeaturedExamSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: true },
  badge: { type: String },
  name: { type: String, required: [true, 'Exam name is required'], trim: true },
  tagline: { type: String },
  description: { type: String },
  highlights: [{
    label: { type: String },
    value: { type: String }
  }],
  image: { type: String },
  ctaPrimaryLabel: { type: String, default: 'Enroll Now' },
  ctaPrimaryHref: { type: String },
  ctaSecondaryLabel: { type: String },
  ctaSecondaryHref: { type: String },
  validFrom: { type: Date },
  validUntil: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('FeaturedExam', FeaturedExamSchema);
