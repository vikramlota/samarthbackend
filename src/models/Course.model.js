const mongoose = require('mongoose');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 10000
  },
  link: {
    type: String,
    required: false,
    default: null
  },
  youtubeLink: {
    type: String,
    default: '',
    required: false
  },
  category: {
    type: String,
    enum: ['SSC', 'Banking', 'State', 'Defence', 'Teaching', 'Punjab Police', 'Other'],
    required: true
  },
  features: [{
    type: String
  }],
  badgeText: {
    type: String,
    default: null 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Store theme colors for the frontend UI cards
  colorTheme: {
    from: { type: String, default: 'from-brand-red' },
    to: { type: String, default: 'to-orange-600' },
    text: { type: String, default: 'text-brand-red' },
    border: { type: String, default: 'border-brand-red' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save hook to auto-generate slug if not provided
CourseSchema.pre('save', async function() {
  if (this.title && !this.slug) {
    this.slug = generateSlug(this.title);
  }
});

module.exports = mongoose.model('Course', CourseSchema);