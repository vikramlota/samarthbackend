const mongoose = require('mongoose');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const CurrentAffairSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  contentBody: {
    type: String,
    required: true // Can store HTML or Markdown string
  },
  category: {
    type: String,
    enum: ['National', 'International', 'Tech', 'Awards', 'Sports', 'Economy', 'Defence', 'Important Days', 'Obituary', 'Miscellaneous'],
    required: true
  },
  tags: [{
    type: String
  }],
  isSpotlight: {
    type: Boolean,
    default: false,
    description: 'If true, this article appears in the big Hero card'
  },
  imageUrl: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true });

// Pre-save hook to auto-generate slug if not provided
CurrentAffairSchema.pre('save', async function() {
  if (this.headline && !this.slug) {
    this.slug = generateSlug(this.headline);
  }
});

module.exports = mongoose.model('CurrentAffair', CurrentAffairSchema);