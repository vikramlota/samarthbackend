const mongoose = require('mongoose');

const SeoSchema = new mongoose.Schema({
  title:       { type: String, required: true, maxlength: 70 },
  description: { type: String, required: true, maxlength: 160 },
  keywords:    { type: String },
  canonical:   { type: String, required: true },
  ogImage:     { type: String },
}, { _id: false });

const HeroSchema = new mongoose.Schema({
  badge:           String,
  headline:        { type: String, required: true },
  headlineAccent:  String,
  subheadline:     { type: String, required: true },
  trustPoints:     [{ type: String }],
}, { _id: false });

const QuickInfoSchema = new mongoose.Schema({
  duration:  String,
  fees:      String,
  batchSize: String,
  mode:      String,
}, { _id: false });

const ExamStatSchema = new mongoose.Schema({
  iconName: { type: String, required: true },
  label:    { type: String, required: true },
  value:    { type: String, required: true },
}, { _id: false });

const OverviewSchema = new mongoose.Schema({
  paragraphs: [{ type: String }],
  examStats:  [ExamStatSchema],
}, { _id: false });

const WhyChooseFeatureSchema = new mongoose.Schema({
  iconName:    { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  iconBg:      { type: String, enum: ['red', 'orange'], default: 'red' },
}, { _id: false });

const FeesSchema = new mongoose.Schema({
  original:    { type: Number },
  discounted:  { type: Number, required: true },
  currency:    { type: String, default: '₹' },
  emiAvailable:{ type: Boolean, default: false },
  emiNote:     { type: String },
}, { _id: false });

const CourseDetailsSchema = new mongoose.Schema({
  inclusions: [{ type: String }],
  fees:       FeesSchema,
}, { _id: false });

const SyllabusSubjectSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  topics: [{ type: String }],
}, { _id: false });

const SyllabusSchema = new mongoose.Schema({
  subjects: [SyllabusSubjectSchema],
}, { _id: false });

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  order:    { type: Number, default: 0 },
}, { _id: false });

const CtaSchema = new mongoose.Schema({
  eyebrow:     String,
  title:       String,
  description: String,
  trustPoints: [{ type: String }],
}, { _id: false });

const FinalCtaSchema = new mongoose.Schema({
  eyebrow:  String,
  title:    String,
  subtitle: String,
}, { _id: false });

const LandingPageSchema = new mongoose.Schema({
  slug:          { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9-]+$/ },
  examShortName: { type: String, required: true },
  examFullName:  { type: String, required: true },
  active:        { type: Boolean, default: true, index: true },
  displayOrder:  { type: Number, default: 0 },

  seo:           { type: SeoSchema, required: true },
  hero:          { type: HeroSchema, required: true },
  quickInfo:     { type: QuickInfoSchema, required: true },
  overview:      { type: OverviewSchema, required: true },
  whyChoose:     [WhyChooseFeatureSchema],
  courseDetails: { type: CourseDetailsSchema, required: true },
  syllabus:      { type: SyllabusSchema, required: true },
  faqs:          [FaqSchema],
  midCta:        { type: CtaSchema },
  finalCta:      { type: FinalCtaSchema },

  facultyTags: [{ type: String }],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

LandingPageSchema.index({ slug: 1, active: 1 });
LandingPageSchema.index({ active: 1, displayOrder: 1 });

module.exports = mongoose.model('LandingPage', LandingPageSchema);
