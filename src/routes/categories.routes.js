const express = require('express');
const router = express.Router();
const Category = require('../models/Category.model');
const { protect } = require('../middlewares/auth.middleware.js');
const { generateUniqueSlug } = require('../utils/slug');

// ================= ADMIN ROUTES =================

// GET all categories (admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// GET category by ID (admin)
router.get('/admin/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

// CREATE category
router.post('/admin', protect, async (req, res) => {
  try {
    const { name, description, color, iconName, displayOrder, seo } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name required (min 2 chars)',
      });
    }

    const slug = await generateUniqueSlug(Category, name);

    const category = await Category.create({
      name: name.trim(),
      slug,
      description,
      color,
      iconName,
      displayOrder,
      seo,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Category already exists',
      });
    }

    res.status(400).json({ success: false, error: error.message });
  }
});

// UPDATE category
router.put('/admin/:id', protect, async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.name) {
      const existing = await Category.findById(req.params.id);

      if (existing && existing.name !== updates.name) {
        updates.slug = await generateUniqueSlug(
          Category,
          updates.name,
          req.params.id
        );
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE (soft delete)
router.delete('/admin/:id', protect, async (req, res) => {
  try {
    const BlogPost = require('../models/BlogPost.model');

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }

    const postCount = await BlogPost.countDocuments({
      categories: req.params.id,
      active: true,
    });

    res.json({
      success: true,
      data: category,
      message:
        postCount > 0
          ? `Category deactivated. ${postCount} post(s) still using it.`
          : 'Category deleted.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// ================= PUBLIC ROUTES =================

// GET all active categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ active: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// GET category by slug OR id
router.get('/:param', async (req, res) => {
  try {
    const { param } = req.params;

    let category;

    if (/^[0-9a-fA-F]{24}$/.test(param)) {
      // MongoDB ObjectId
      category = await Category.findById(param).lean();
    } else {
      // slug
      category = await Category.findOne({
        slug: param.toLowerCase(),
        active: true,
      }).lean();
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

module.exports = router;
