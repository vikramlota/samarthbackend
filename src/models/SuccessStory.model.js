const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Please add student name']
  },
  examName: {
    type: String,
    required: [true, 'Please add exam name (e.g., SBI PO)']
  },
  rank: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ['Banking', 'SSC', 'State', 'Defence', 'Teaching'],
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  year: {
    type: Number,
    required: true
  },
  testimonial: {
    type: String,
    maxlength: 10000
  }
},{ timestamps: true });

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);