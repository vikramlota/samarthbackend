const mongoose = require('mongoose');

const MediaCoverageSchema = new mongoose.Schema({
  outletName:       { type: String, required: true },
  outletLogo:       { type: String },
  articleTitle:     { type: String, required: true },
  articleUrl:       { type: String, required: true },
  publishedDate:    { type: Date, required: true },
  excerpt:          { type: String, maxlength: 300 },
  thumbnailImage:   { type: String },
  active:           { type: Boolean, default: true, index: true },
  featured:         { type: Boolean, default: false },
  displayOrder:     { type: Number, default: 0 },
}, { timestamps: true });

MediaCoverageSchema.index({ active: 1, featured: 1, publishedDate: -1 });

module.exports = mongoose.model('MediaCoverage', MediaCoverageSchema);
