const Course = require('../models/Course.model.js');
const Update = require('../models/Update.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');
const SuccessStory = require('../models/SuccessStory.model.js');
const cache = require('../utils/cache.js');

const HOMEPAGE_CACHE_KEY = 'homepage_data';
const HOMEPAGE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * @desc    Get all homepage data in a single request
 * @route   GET /api/homepage
 * @access  Public
 * 
 * Returns optimized data for homepage:
 * - Featured courses (limited fields)
 * - Recent updates/notifications
 * - Success stories
 * - Current affairs highlights
 * 
 * Implements caching to reduce database calls
 */
const getHomepageData = async (req, res) => {
  try {
    // Check cache first
    const cachedData = cache.get(HOMEPAGE_CACHE_KEY);
    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true,
        cacheExpiry: new Date(Date.now() + HOMEPAGE_CACHE_TTL).toISOString()
      });
    }

    // Execute all queries in parallel for better performance
    const [courses, updates, successStories, currentAffairs, courseCount, updateCount] = await Promise.all([
      // Fetch featured active courses (limited to 8)
      Course.find({})
        .select('title slug image description category features badgeText -_id')
        .limit(8)
        .sort({ createdAt: -1 })
        .lean(),
      
      // Fetch recent updates/notifications (limited to 5)
      Update.find({})
        .select('title slug imageUrl description type createdAt -_id')
        .limit(5)
        .sort({ createdAt: -1 })
        .lean(),
      
      // Fetch recent success stories (limited to 6)
      SuccessStory.find({})
        .select('name imageUrl year position -_id')
        .limit(6)
        .sort({ year: -1 })
        .lean(),
      
      // Fetch current affairs highlights (limited to 4)
      CurrentAffair.find({})
        .select('title slug image description createdAt -_id')
        .limit(4)
        .sort({ createdAt: -1 })
        .lean(),

      // Count total active courses
      Course.countDocuments(),
      
      // Count total updates
      Update.countDocuments()
    ]);

    // Return aggregated response with metadata
    const responseData = {
      success: true,
      data: {
        courses: {
          items: courses,
          count: courses.length,
          total: courseCount
        },
        updates: {
          items: updates,
          count: updates.length,
          total: updateCount
        },
        successStories: {
          items: successStories,
          count: successStories.length
        },
        currentAffairs: {
          items: currentAffairs,
          count: currentAffairs.length
        }
      },
      timestamp: new Date().toISOString(),
      cached: false
    };

    // Store in cache for subsequent requests
    cache.set(HOMEPAGE_CACHE_KEY, responseData, HOMEPAGE_CACHE_TTL);

    return res.json(responseData);

  } catch (error) {
    console.error('❌ Homepage data fetch error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage data',
      error: error.message
    });
  }
};

module.exports = {
  getHomepageData
};
