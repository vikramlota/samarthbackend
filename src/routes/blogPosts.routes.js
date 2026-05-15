const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost.model');
const Category = require('../models/Category.model');
const { protect } = require('../middlewares/auth.middleware.js');

function normalizeCategories(categories) {
  if (!Array.isArray(categories)) return [];
  return categories
    .map(item => {
      if (typeof item === 'string' || typeof item === 'number') return item;
      if (item && typeof item === 'object') return item._id || item.value || item.id || null;
      return null;
    })
    .filter(Boolean);
}

function hasVisibleContent(content) {
  if (!content) return false;
  const plainText = String(content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plainText.length > 0;
}

const adminRouter = express.Router();
adminRouter.use(protect);

// Stats must come before /:id to prevent "stats" being treated as an id
adminRouter.get('/stats/summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [total, totalActive, recentCount, mostViewed, byCategory] = await Promise.all([
      BlogPost.countDocuments({}),
      BlogPost.countDocuments({ active: true }),
      BlogPost.countDocuments({ active: true, publishedAt: { $gte: thirtyDaysAgo } }),
      BlogPost.find({ active: true })
        .select('title slug views publishedAt')
        .sort({ views: -1 })
        .limit(5)
        .lean(),
      BlogPost.aggregate([
        { $match: { active: true } },
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
        { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
        { $unwind: '$category' },
        { $project: { _id: 0, name: '$category.name', slug: '$category.slug', count: 1 } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: { total, totalActive, recentCount, mostViewed, byCategory },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

adminRouter.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const [posts, total] = await Promise.all([
      BlogPost.find({})
        .populate('categories', 'name slug color')
        .select('title slug excerpt coverImage categories featured active publishedAt views readingTimeMinutes wordCount updatedAt')
        .sort({ publishedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      BlogPost.countDocuments({}),
    ]);

    res.json({ success: true, data: posts, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

adminRouter.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('categories', 'name slug color')
      .lean();

    if (!post) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

adminRouter.post('/', async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };

    data.categories = normalizeCategories(data.categories);

    if (!data.title?.trim()) {
      return res.status(400).json({ success: false, error: 'Title required' });
    }
    if (!hasVisibleContent(data.content)) {
      return res.status(400).json({ success: false, error: 'Content required' });
    }
    if (!data.categories || data.categories.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one category required' });
    }

    const validCategoryCount = await Category.countDocuments({
      _id: { $in: data.categories },
      active: true,
    });
    if (validCategoryCount !== data.categories.length) {
      return res.status(400).json({ success: false, error: 'One or more categories are invalid or inactive' });
    }

    const post = await BlogPost.create(data);
    await post.populate('categories', 'name slug color');

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: 'A post with this slug already exists' });
    }
    console.error('Error creating post:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

adminRouter.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body, updatedBy: req.user._id };
    if (Object.prototype.hasOwnProperty.call(updates, 'categories')) {
      updates.categories = normalizeCategories(updates.categories);

      if (updates.categories.length === 0) {
        return res.status(400).json({ success: false, error: 'At least one category required' });
      }

      const validCategoryCount = await Category.countDocuments({
        _id: { $in: updates.categories },
        active: true,
      });
      if (validCategoryCount !== updates.categories.length) {
        return res.status(400).json({ success: false, error: 'One or more categories are invalid or inactive' });
      }
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Not found' });

    Object.assign(post, updates);
    await post.save();
    await post.populate('categories', 'name slug color');

    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

adminRouter.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { active: false, updatedBy: req.user._id },
      { new: true }
    );

    if (!post) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: post, message: 'Post deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

adminRouter.patch('/:id/featured', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Not found' });

    post.featured = !post.featured;
    post.updatedBy = req.user._id;
    await post.save();

    res.json({ success: true, data: { _id: post._id, featured: post.featured } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.use('/admin', adminRouter);
router.use('/manage', adminRouter);

// ============ PUBLIC ROUTES ============

/**
 * GET /api/blog/posts
 * ?category=ssc-tips  &featured=true  &search=...  &page=1  &limit=10
 * &sort=newest|oldest|most-viewed
 */
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      search,
      page = 1,
      limit = 10,
      sort = 'newest',
    } = req.query;

    const filter = { active: true };

    if (category) {
      const categoryDoc = await Category.findOne({
        slug: category.toLowerCase(),
        active: true,
      });
      if (!categoryDoc) {
        return res.json({ success: true, data: [], total: 0, page: 1, totalPages: 0 });
      }
      filter.categories = categoryDoc._id;
    }

    if (featured === 'true') filter.featured = true;

    if (search?.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [{ title: regex }, { excerpt: regex }];
    }

    const sortMap = {
      newest: { publishedAt: -1 },
      oldest: { publishedAt: 1 },
      'most-viewed': { views: -1, publishedAt: -1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .populate('categories', 'name slug color')
        .select('-content')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

// Related posts — declared before /:slug so Express doesn't confuse it
router.get('/:slug/related', async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const currentPost = await BlogPost.findOne({
      slug: req.params.slug.toLowerCase(),
      active: true,
    }).lean();

    if (!currentPost) return res.json({ success: true, data: [] });

    const related = await BlogPost.find({
      _id: { $ne: currentPost._id },
      categories: { $in: currentPost.categories },
      active: true,
    })
      .populate('categories', 'name slug color')
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(Math.min(10, Math.max(1, parseInt(limit))))
      .lean();

    res.json({ success: true, data: related });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch related posts' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const param = req.params.slug;
    let post;

    // Check if param is a valid MongoDB ObjectId
    if (param && param.match(/^[0-9a-fA-F]{24}$/)) {
      post = await BlogPost.findById(param)
        .populate('categories', 'name slug color')
        .lean();
    } else {
      post = await BlogPost.findOne({
        slug: param.toLowerCase(),
        active: true,
      })
        .populate('categories', 'name slug color')
        .lean();
    }

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Fire-and-forget view increment
    BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec();

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
});

module.exports = router;

