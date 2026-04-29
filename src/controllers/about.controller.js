const AboutPage = require('../models/AboutPage.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

const ALLOWED_SECTIONS = [
  'hero', 'founderStory', 'founders', 'stats',
  'mission', 'vision', 'values', 'journey',
  'awards', 'infrastructure', 'video', 'cta', 'seo',
];

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

// GET /api/about
const getAbout = async (req, res) => {
  try {
    const about = await AboutPage.getSingleton();
    // Never expose audit fields publicly
    const { updatedBy, __v, ...data } = about.toObject();
    res.json({ success: true, data });
  } catch (error) {
    console.error('About page fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch About page' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// PUT /api/about/admin  — replace entire document
const updateAbout = async (req, res) => {
  try {
    const about = await AboutPage.getSingleton();
    Object.assign(about, req.body);
    about.updatedBy = req.admin?._id;
    await about.save();

    console.log(`✏️  About page updated by ${req.admin?.username}`);
    res.json({ success: true, data: about });
  } catch (error) {
    console.error('About page update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PATCH /api/about/admin/:section  — update a single section
const updateSection = async (req, res) => {
  try {
    const { section } = req.params;

    if (!ALLOWED_SECTIONS.includes(section)) {
      return res.status(400).json({
        success: false,
        error: `Invalid section. Allowed: ${ALLOWED_SECTIONS.join(', ')}`,
      });
    }

    const about = await AboutPage.getSingleton();
    about[section] = req.body;
    about.updatedBy = req.admin?._id;
    await about.save();

    console.log(`✏️  About page section "${section}" updated by ${req.admin?.username}`);
    res.json({ success: true, data: about[section] });
  } catch (error) {
    console.error('About section update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// POST /api/about/admin/upload  — upload a photo for any About section
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
    if (!result?.secure_url) {
      return res.status(500).json({ success: false, error: 'Upload failed' });
    }

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('About photo upload error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAbout, updateAbout, updateSection, uploadPhoto };
