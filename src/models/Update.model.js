const mongoose = require('mongoose');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const UpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Job', 'Admit Card Update', 'Result', 'New Notification', 'Exam Strategy', 'Exam Pattern', 'Cut-Off Analysis', 'Answer Key', 'Syllabus Update', 'Important Dates', 'General'],
    required: true
  },
  linkUrl: {
    type: String,
    required: false // Optional, in case it's just a text notice
  },
  isLatest: {
    type: Boolean,
    default: true
  },
  // Auto-expire "New" badge after 7 days (logic handled in controller or frontend)
  datePosted: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    required: false
  }
},{ timestamps: true });

// Pre-save hook to auto-generate slug if not provided
UpdateSchema.pre('save', async function() {
  if (this.title && !this.slug) {
    this.slug = generateSlug(this.title);
  }
});

module.exports = mongoose.model('Update', UpdateSchema);