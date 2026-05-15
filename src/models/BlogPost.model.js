const mongoose = require('mongoose');
const { generateUniqueSlug } = require('../utils/slug');
const { calculateReadingTime } = require('../utils/readingTime');
const { sanitizeHtml } = require('../utils/sanitizeHtml');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  // Content
  excerpt: {
    type: String,
    required: true,
    maxLength: 300,
  },
  content: {
    type: String,
    required: true,
  },

  // Cover image
  coverImage: { type: String },
  coverImageAlt: { type: String },

  // Multi-category support
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }],

  tags: [{ type: String }],

  // Single institute author — extendable to Faculty later
  author: {
    name: { type: String, default: 'Samarth Academy' },
    avatar: { type: String },
  },

  readingTimeMinutes: { type: Number, default: 1 },
  wordCount: { type: Number, default: 0 },

  // active = soft-delete flag (no draft state)
  active: { type: Boolean, default: true, index: true },
  featured: { type: Boolean, default: false, index: true },
  publishedAt: { type: Date, default: Date.now, index: true },

  seo: {
    title: { type: String, maxLength: 200 },
    description: { type: String, maxLength: 500 },
    keywords: { type: String },
    ogImage: { type: String },
    canonicalUrl: { type: String },
    noindex: { type: Boolean, default: false },
  },

  views: { type: Number, default: 0 },

  // Audit — references Admin model
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

BlogPostSchema.index({ active: 1, publishedAt: -1 });
BlogPostSchema.index({ categories: 1, active: 1, publishedAt: -1 });
BlogPostSchema.index({ featured: 1, active: 1, publishedAt: -1 });

BlogPostSchema.pre('save', async function () {
  // Auto-generate slug from title on create or title change
  if (!this.slug || this.isModified('title')) {
    this.slug = await generateUniqueSlug(this.constructor, this.title, this._id);
  }

  if (this.isModified('content')) {
    this.content = sanitizeHtml(this.content);

    const plainText = this.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plainText.split(' ').filter(Boolean);
    this.wordCount = words.length;
    this.readingTimeMinutes = calculateReadingTime(words.length);
  }

  // Auto-generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    const plainText = this.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    this.excerpt = plainText.length > 297
      ? plainText.substring(0, 297) + '...'
      : plainText;
  }

  if (!this.seo) this.seo = {};
  if (!this.seo.title) this.seo.title = this.title.substring(0, 70);
  if (!this.seo.description) this.seo.description = this.excerpt ? this.excerpt.substring(0, 160) : '';
  if (!this.seo.ogImage && this.coverImage) this.seo.ogImage = this.coverImage;
});

// Recompute category postCounts after any save
BlogPostSchema.post('save', async function (doc) {
  const Category = mongoose.model('Category');
  for (const catId of doc.categories) {
    const count = await mongoose.model('BlogPost').countDocuments({
      categories: catId,
      active: true,
    });
    await Category.findByIdAndUpdate(catId, { postCount: count });
  }
});

// Recompute after findOneAndUpdate (used for soft-delete, toggle featured, etc.)
BlogPostSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return;
  const Category = mongoose.model('Category');
  for (const catId of doc.categories) {
    const count = await mongoose.model('BlogPost').countDocuments({
      categories: catId,
      active: true,
    });
    await Category.findByIdAndUpdate(catId, { postCount: count });
  }
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
