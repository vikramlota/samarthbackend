const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  slug:          { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  designation:   { type: String, required: true },
  qualification: { type: String, required: true },
  experience:    { type: Number, required: true },
  yearsAtSamarth:{ type: Number },

  // Short copy for grid/card views
  shortBio:      { type: String, maxlength: 200 },
  // Full bio — HTML allowed (Jodit-edited)
  bio:           { type: String },

  photo:         { type: String },
  subjects:      [{ type: String }],
  examTags:      [{ type: String, lowercase: true }],

  achievements:  [{ type: String }],
  examsCleared:  [{ type: String }], // e.g. "SSC CGL 2015 - AIR 234"

  awards: [{
    year:      { type: Number },
    title:     { type: String, required: true },
    awardedBy: { type: String },
  }],

  linkedin:    { type: String },
  email:       { type: String },

  active:        { type: Boolean, default: true },
  displayOrder:  { type: Number, default: 0 },
  featured:      { type: Boolean, default: false },
}, { timestamps: true });

FacultySchema.index({ active: 1, examTags: 1 });
FacultySchema.index({ slug: 1 });

// Auto-generate slug from name on first save
FacultySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Faculty', FacultySchema);
