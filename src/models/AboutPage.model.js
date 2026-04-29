const mongoose = require('mongoose');

const FounderSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  title:         { type: String, required: true },
  formerRole:    { type: String },
  photo:         { type: String },
  bio:           { type: String, required: true },
  yearsOfService:{ type: Number },
  credentials:   [{ type: String }],
  socialLinks: {
    linkedin: { type: String },
    twitter:  { type: String },
  },
  displayOrder:  { type: Number, default: 0 },
}, { _id: false });

const MilestoneSchema = new mongoose.Schema({
  year:        { type: Number, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String },
  highlight:   { type: Boolean, default: false },
}, { _id: false });

const AwardSchema = new mongoose.Schema({
  year:        { type: Number, required: true },
  title:       { type: String, required: true },
  awardedBy:   { type: String, required: true },
  description: { type: String },
  image:       { type: String },
}, { _id: false });

const InfrastructurePhotoSchema = new mongoose.Schema({
  url:          { type: String, required: true },
  caption:      { type: String, required: true },
  category: {
    type: String,
    enum: ['classroom', 'library', 'reception', 'computer-lab', 'discussion-room', 'exterior', 'other'],
    default: 'other',
  },
  displayOrder: { type: Number, default: 0 },
}, { _id: false });

const ValueSchema = new mongoose.Schema({
  iconName:    { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const StatSchema = new mongoose.Schema({
  iconName: { type: String, required: true },
  value:    { type: String, required: true },
  label:    { type: String, required: true },
}, { _id: false });

const AboutPageSchema = new mongoose.Schema({
  hero: {
    eyebrow:         { type: String, default: 'ABOUT US' },
    headline:        { type: String, required: true },
    subheadline:     { type: String, required: true },
    backgroundImage: { type: String },
  },

  founderStory: {
    eyebrow:    { type: String, default: 'OUR STORY' },
    headline:   { type: String, required: true },
    paragraphs: [{ type: String }],
    photo:      { type: String },
  },

  founders:  [FounderSchema],
  stats:     [StatSchema],

  mission: { type: String },
  vision:  { type: String },
  values:  [ValueSchema],

  journey: {
    eyebrow:     { type: String, default: 'OUR JOURNEY' },
    headline:    { type: String, default: '16 Years of Excellence' },
    subheadline: { type: String },
    milestones:  [MilestoneSchema],
  },

  awards: {
    eyebrow:     { type: String, default: 'ACHIEVEMENTS' },
    headline:    { type: String, default: 'Awards & Recognition' },
    subheadline: { type: String },
    items:       [AwardSchema],
  },

  infrastructure: {
    eyebrow:     { type: String, default: 'OUR SPACE' },
    headline:    { type: String, default: 'World-Class Learning Environment' },
    subheadline: { type: String },
    photos:      [InfrastructurePhotoSchema],
  },

  video: {
    enabled:     { type: Boolean, default: false },
    youtubeId:   { type: String },
    title:       { type: String },
    description: { type: String },
  },

  cta: {
    eyebrow:  { type: String, default: 'READY TO JOIN?' },
    title:    { type: String, default: "Be Part of Amritsar's Leading Coaching Family" },
    subtitle: { type: String },
  },

  seo: {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    keywords:    { type: String },
    canonical:   { type: String, required: true },
    ogImage:     { type: String },
  },

  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

// Singleton helper — auto-creates the one doc if it doesn't exist yet
AboutPageSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({});
  if (!doc) {
    doc = await this.create({
      hero: {
        headline: 'About Samarth Academy',
        subheadline: 'Coaching with purpose since 2008.',
      },
      founderStory: {
        headline: 'Our Story',
        paragraphs: ['Content coming soon.'],
      },
      seo: {
        title: 'About Samarth Academy | Best Coaching Institute in Amritsar',
        description: 'Founded by ex-government officers. 16+ years. Learn about our journey, mission, and the team behind Samarth Academy.',
        canonical: 'https://thesamarthacademy.in/about',
      },
    });
  }
  return doc;
};

module.exports = mongoose.model('AboutPage', AboutPageSchema);
