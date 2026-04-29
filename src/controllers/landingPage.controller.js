const LandingPage = require('../models/LandingPage.model.js');

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

// GET /api/landing-pages
const listLandingPages = async (req, res) => {
  try {
    const fields = req.query.fields
      ? req.query.fields.split(',').join(' ')
      : 'slug examShortName examFullName seo.title displayOrder';

    const pages = await LandingPage.find({ active: true })
      .select(fields)
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    res.json({ success: true, data: pages });
  } catch (error) {
    console.error('Landing pages list error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch landing pages' });
  }
};

// GET /api/landing-pages/:slug
const getLandingPageBySlug = async (req, res) => {
  try {
    const page = await LandingPage.findOne({
      slug: req.params.slug.toLowerCase(),
      active: true,
    })
      .select('-createdBy -updatedBy') // never expose admin IDs publicly
      .lean();

    if (!page) {
      return res.status(404).json({ success: false, error: 'Landing page not found' });
    }

    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Landing page fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch landing page' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// GET /api/landing-pages/admin/all
const adminListAll = async (req, res) => {
  try {
    const pages = await LandingPage.find({})
      .select('slug examShortName examFullName active displayOrder updatedAt')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    res.json({ success: true, data: pages });
  } catch (error) {
    console.error('Admin landing pages list error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch pages' });
  }
};

// GET /api/landing-pages/admin/:id
const adminGetById = async (req, res) => {
  try {
    const page = await LandingPage.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Admin landing page get error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch page' });
  }
};

// POST /api/landing-pages/admin
const adminCreate = async (req, res) => {
  try {
    const adminId = req.admin?._id;
    const page = await LandingPage.create({
      ...req.body,
      createdBy: adminId,
      updatedBy: adminId,
    });

    console.log(`📝 Admin created landing page: ${page.slug} by ${req.admin?.username}`);
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: 'A landing page with this slug already exists' });
    }
    console.error('Admin create landing page error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/landing-pages/admin/:id
const adminUpdate = async (req, res) => {
  try {
    const page = await LandingPage.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.admin?._id },
      { new: true, runValidators: true }
    );
    if (!page) return res.status(404).json({ success: false, error: 'Not found' });

    console.log(`✏️  Admin updated landing page: ${page.slug} by ${req.admin?.username}`);
    res.json({ success: true, data: page });
  } catch (error) {
    console.error('Admin update landing page error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/landing-pages/admin/:id  — soft delete
const adminSoftDelete = async (req, res) => {
  try {
    const page = await LandingPage.findByIdAndUpdate(
      req.params.id,
      { active: false, updatedBy: req.admin?._id },
      { new: true }
    );
    if (!page) return res.status(404).json({ success: false, error: 'Not found' });

    console.log(`🗑️  Admin deactivated landing page: ${page.slug} by ${req.admin?.username}`);
    res.json({ success: true, data: page, message: 'Page deactivated' });
  } catch (error) {
    console.error('Admin delete landing page error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete page' });
  }
};

// POST /api/landing-pages/admin/:id/duplicate
const adminDuplicate = async (req, res) => {
  try {
    const original = await LandingPage.findById(req.params.id).lean();
    if (!original) return res.status(404).json({ success: false, error: 'Not found' });

    const { _id, createdAt, updatedAt, __v, ...rest } = original;
    const duplicate = await LandingPage.create({
      ...rest,
      slug: `${rest.slug}-copy`,
      examShortName: `${rest.examShortName} (Copy)`,
      active: false,
      createdBy: req.admin?._id,
      updatedBy: req.admin?._id,
    });

    console.log(`📋 Admin duplicated landing page: ${original.slug} → ${duplicate.slug}`);
    res.status(201).json({ success: true, data: duplicate });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: 'Duplicate slug already exists — rename first' });
    }
    console.error('Admin duplicate error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  listLandingPages,
  getLandingPageBySlug,
  adminListAll,
  adminGetById,
  adminCreate,
  adminUpdate,
  adminSoftDelete,
  adminDuplicate,
};
