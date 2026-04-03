const CurrentAffair = require('../models/CurrentAffair.model.js'); 
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { notifyGoogle } = require('../utils/googleIndexing.js');

// @desc    Get all Current Affairs
// @route   GET /api/current-affairs
// @access  Public
const getCurrentAffairs = async (req, res) => {
  try {
    // Sort by most recent date
    const news = await CurrentAffair.find({}).sort({ date: -1 });
    // Ensure image URLs are HTTPS
    const sanitizedNews = news.map(item => ({
      ...item.toObject(),
      imageUrl: item.imageUrl ? item.imageUrl.replace(/^http:/, 'https:') : item.imageUrl
    }));
    res.json(sanitizedNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new Current Affair Article
// @route   POST /api/current-affairs
// @access  Private (Admin)
const createCurrentAffair = async (req, res) => {
  try {
    console.log('📤 POST /api/current-affairs request received');
    console.log('📦 req.file:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'NO FILE');
    console.log('📝 req.body keys:', Object.keys(req.body));
    
    // Added slug to destructured body
    const { headline, slug, contentBody, category, tags, isSpotlight } = req.body;
    
    // Validate required fields (Now checking for slug too)
    if (!headline || !contentBody || !category || !slug) {
      return res.status(400).json({ 
        message: "Missing required fields: headline, slug, contentBody, category",
        received: { headline: !!headline, slug: !!slug, contentBody: !!contentBody, category: !!category }
      });
    }
    
    // 1. Handle Image Upload
    let imageUrl = '';
    if (req.file) {
      try {
        console.log('🖼️ Attempting to upload image to Cloudinary...');
        console.log('   File buffer size:', req.file.size, 'bytes');
        console.log('   File name:', req.file.originalname);
        console.log('   File mimetype:', req.file.mimetype);
        
        const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        
        if (!uploadResult) {
          console.warn("⚠️ Cloudinary upload returned null/undefined");
        } else if (uploadResult.secure_url) {
          imageUrl = uploadResult.secure_url;
          console.log("✅ Image uploaded successfully!");
          console.log("   Secure URL:", imageUrl);
        } else if (uploadResult.url) {
          imageUrl = uploadResult.url;
          console.log("✅ Image uploaded successfully (using .url)!");
          console.log("   URL:", imageUrl);
        } else {
          console.warn("⚠️ Cloudinary response missing secure_url:", Object.keys(uploadResult));
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError.message);
        console.error("   Full error:", uploadError);
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    } else {
      console.warn('⚠️ No file received in request');
    }

    // 2. Parse Tags
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags) 
        ? tags 
        : tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    // 3. Create Database Entry
    const newArticle = new CurrentAffair({
      headline,
      slug, // Saving the manual slug
      contentBody,
      category,
      tags: parsedTags,
      isSpotlight: isSpotlight === 'true',
      imageUrl
    });
    
    console.log('💾 Creating CurrentAffair with data:', { headline, slug, imageUrl: !!imageUrl });
    const savedArticle = await newArticle.save();
    console.log('✅ CurrentAffair created:', savedArticle._id);

    // --- PING GOOGLE INSTANTLY ---
    const articleUrl = `https://thesamarthacademy.in/current-affairs/${savedArticle.slug}`;
    await notifyGoogle(articleUrl, 'URL_UPDATED');
    
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error("❌ Error creating current affair:", error.message);
    res.status(400).json({ message: error.message, details: error.toString() });
  }
};

// @desc    Update an article
// @route   PUT /api/current-affairs/:id
// @access  Private (Admin)
const updateCurrentAffair = async (req, res) => {
  try {
    console.log('📥 PUT /api/current-affairs/:id request received');
    console.log('📦 Article ID:', req.params.id);
    console.log('📦 req.file:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'NO FILE');
    
    const article = await CurrentAffair.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const { headline, slug, contentBody, category, tags, isSpotlight } = req.body;

    // Update text fields
    article.headline = headline || article.headline;
    article.slug = slug || article.slug; // Update manual slug
    article.contentBody = contentBody || article.contentBody;
    article.category = category || article.category;
    
    // Update Boolean
    if (isSpotlight !== undefined) {
        article.isSpotlight = isSpotlight === 'true';
    }

    // Update Tags
    if (tags) {
       article.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }

    // Update Image
    if (req.file) {
      console.log('🖼️ Attempting to upload new image to Cloudinary...');
      const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (uploadResult) {
        article.imageUrl = uploadResult.secure_url;
        console.log("✅ New image uploaded to Cloudinary:", article.imageUrl);
      }
    }

    console.log('💾 Updating CurrentAffair...');
    const updatedArticle = await article.save();
    console.log('✅ CurrentAffair updated:', updatedArticle._id);

    // --- PING GOOGLE INSTANTLY (Added this to your update function!) ---
    const articleUrl = `https://thesamarthacademy.in/current-affairs/${updatedArticle.slug}`;
    await notifyGoogle(articleUrl, 'URL_UPDATED');

    res.json(updatedArticle);

  } catch (error) {
    console.error("❌ Error updating current affair:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an article
// @route   DELETE /api/current-affairs/:id
// @access  Private (Admin)
const deleteCurrentAffair = async (req, res) => {
  try {
    const deletedArticle = await CurrentAffair.findByIdAndDelete(req.params.id);
    
    if (deletedArticle) {
      // --- PING GOOGLE AFTER SUCCESSFUL DELETION ---
      const articleUrl = `https://thesamarthacademy.in/current-affairs/${deletedArticle.slug}`;
      await notifyGoogle(articleUrl, 'URL_DELETED');

      res.json({ message: 'Article removed' });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single current affair by Slug
// @route   GET /api/current-affairs/:slug
// @access  Public
const getCurrentAffairBySlug = async (req, res) => {
  try {
    const article = await CurrentAffair.findOne({ slug: req.params.slug });
    if (article) {
      // Ensure image URL is HTTPS
      const sanitizedArticle = {
        ...article.toObject(),
        imageUrl: article.imageUrl ? article.imageUrl.replace(/^http:/, 'https:') : article.imageUrl
      };
      res.json(sanitizedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCurrentAffairs,
  getCurrentAffairBySlug,
  createCurrentAffair,
  deleteCurrentAffair,
  updateCurrentAffair 
};