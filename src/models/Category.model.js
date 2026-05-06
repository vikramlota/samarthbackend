const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 60,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/,
  },
  description: {
    type: String,
    maxLength: 300,
  },

  // Display
  color: {
    type: String,
    enum: ['red', 'orange', 'gray', 'green', 'blue'],
    default: 'red',
  },
  iconName: { type: String },

  // Status
  active: { type: Boolean, default: true, index: true },
  displayOrder: { type: Number, default: 0 },

  // SEO for category page (e.g., /blog/category/ssc-tips)
  seo: {
    title: { type: String, maxLength: 70 },
    description: { type: String, maxLength: 160 },
  },

  // Denormalized counter for performance
  postCount: { type: Number, default: 0 },
}, { timestamps: true });

CategorySchema.index({ slug: 1, active: 1 });

module.exports = mongoose.model('Category', CategorySchema);
