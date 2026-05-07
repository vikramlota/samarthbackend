const express = require('express');
const router = express.Router();
const Category = require('../models/Category.model');
const { protect } = require('../middleware/auth');
const { generateUniqueSlug } = require('../utils/slug');

// ============ ADMIN ROUTES (before /:slug to avoid param collision) ============

router.get('/admin/all', protect, async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ displayOrder: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

router.post('/admin', protect, async (req, res) => {
  try {
    const { name, description, color, iconName, displayOrder, seo } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Name required (min 2 chars)' });
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
      return res.status(409).json({ success: false, error: 'Category with this name already exists' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/admin/:id', protect, async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.name) {
      const existing = await Category.findById(req.params.id);
      if (existing && existing.name !== updates.name) {
        updates.slug = await generateUniqueSlug(Category, updates.name, req.params.id);
      }
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/admin/:id', protect, async (req, res) => {
  try {
    const BlogPost = require('../models/BlogPost.model');

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!category) return res.status(404).json({ success: false, error: 'Not found' });

    const postCount = await BlogPost.countDocuments({
      categories: req.params.id,
      active: true,
    });

    res.json({
      success: true,
      data: category,
      message: postCount > 0
        ? `Category deactivated. ${postCount} active post(s) remain in this category.`
        : 'Category deactivated.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ PUBLIC ROUTES ============

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

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug.toLowerCase(),
      active: true,
    }).lean();

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

module.exports = router;
