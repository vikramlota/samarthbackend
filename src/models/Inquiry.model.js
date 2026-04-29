const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  text:     { type: String, required: true },
  addedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  addedAt:  { type: Date, default: Date.now },
}, { _id: false });

const InquirySchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },

  inquiryType: {
    type: String,
    enum: ['course-inquiry', 'demo-class', 'visit-booking', 'admission', 'general'],
    default: 'general',
    index: true,
  },

  course:        { type: String },
  preferredTime: { type: String },
  preferredDate: { type: Date },
  message:       { type: String, maxlength: 2000 },

  source: { type: String, required: true, default: 'unknown' },

  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'converted', 'closed', 'spam'],
    default: 'new',
    index: true,
  },

  notes:       [NoteSchema],
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  contactedAt: { type: Date },
  convertedAt: { type: Date },

  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ inquiryType: 1, status: 1 });
InquirySchema.index({ source: 1 });

module.exports = mongoose.model('Inquiry', InquirySchema);
