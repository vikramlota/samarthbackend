const Update = require('../models/Update.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const { notifyGoogle } = require('../utils/googleIndexing.js');

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
};

// --- NOTIFICATIONS / UPDATES ---
const getUpdates = async (req, res) => {
  try {
    const filter = {};
    const isActiveQuery = req.query.active === 'true';

    if (isActiveQuery) {
      const now = new Date();
      filter.active = true;
      filter.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: now } }
      ];
    }

    const limit = req.query.limit ? Math.min(parseInt(req.query.limit), 50) : undefined;
    let query = Update.find(filter).sort({ datePosted: -1 });
    if (limit) query = query.limit(limit);

    const updates = await query;

    // When called with ?active=true return the new standardised format
    if (isActiveQuery) {
      const data = updates.map(item => ({
        _id: item._id,
        text: item.title,
        href: item.href || item.linkUrl || null,
        active: item.active !== false,
        expiresAt: item.expiresAt || null
      }));
      return res.json({ success: true, data });
    }

    // Default: backward-compatible array response for admin panel
    const sanitizedUpdates = updates.map(item => ({
      ...item.toObject(),
      imageUrl: item.imageUrl ? item.imageUrl.replace(/^http:/, 'https:') : item.imageUrl
    }));
    res.json(sanitizedUpdates);
  } catch (error) {
    console.error('Error fetching updates:', error.message, error.stack);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

const getUpdateById = async (req, res) => {
  try {
    const param = req.params.id;
    let update;

    // Check if param is a MongoDB ObjectId or a slug
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      update = await Update.findById(param);
    } else {
      update = await Update.findOne({ slug: param });
      
      // If slug not found, try case-insensitive
      if (!update) {
        const regexSlug = new RegExp(`^${param}$`, 'i');
        update = await Update.findOne({ slug: regexSlug });
      }
      
      // Removed the heavy database fallback loop here!
    }

    if (!update) {
      return res.status(404).json({ message: 'Update not found', searchedParam: param });
    }
    // Ensure image URL is HTTPS
    const sanitizedUpdate = {
      ...update.toObject(),
      imageUrl: update.imageUrl ? update.imageUrl.replace(/^http:/, 'https:') : update.imageUrl
    };
    res.json(sanitizedUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUpdate = async (req, res) => {
  try {
    console.log('📥 Creating update request received');
    const body = { ...req.body };
    
    // Validate required fields
    if (!body.title || !body.description || !body.type) {
      console.warn('❌ Missing required fields:', { title: !!body.title, description: !!body.description, type: !!body.type });
      return res.status(400).json({ 
        message: "Missing required fields: title, description, type",
        received: { title: !!body.title, description: !!body.description, type: !!body.type }
      });
    }
    
    console.log('✅ Validation passed for title:', body.title);
    
    // Handle Image Upload to Cloudinary
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        console.error("❌ Cloudinary not configured! Missing environment variables.");
        return res.status(500).json({ 
          message: "Image upload service not configured. Please contact administrator.",
          details: "Missing Cloudinary credentials in environment variables"
        });
      }
      
      try {
        console.log("📤 Uploading image to Cloudinary:", req.file.originalname);
        const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        if (uploadResult) {
          body.imageUrl = uploadResult.secure_url;
          console.log("✅ Notification image uploaded to Cloudinary:", body.imageUrl);
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError.message);
        return res.status(400).json({ 
          message: `Image upload failed: ${uploadError.message}`,
          hint: "Make sure Cloudinary credentials are properly configured"
        });
      }
    }
    
    // Ensure type matches one of the valid enum values
    const validTypes = ['Job', 'Admit Card Update', 'Result', 'New Notification', 'Exam Strategy', 'Exam Pattern', 'Cut-Off Analysis', 'Answer Key', 'Syllabus Update', 'Important Dates', 'General'];
    if (!validTypes.includes(body.type)) {
      console.warn('❌ Invalid type:', body.type);
      return res.status(400).json({ 
        message: `Invalid type: '${body.type}'. Must be one of: ${validTypes.join(', ')}`
      });
    }
    
    console.log('📝 Creating update in database...');
    const update = await Update.create(body);
    console.log('✅ Update created with ID:', update._id);

    // --- PING GOOGLE INSTANTLY ---
    try {
      const updateUrl = `https://thesamarthacademy.in/updates/${update.slug}`;
      console.log('🔔 Notifying Google about:', updateUrl);
      await notifyGoogle(updateUrl, 'URL_UPDATED');
      console.log('✅ Google notification sent');
    } catch (googleError) {
      console.warn("⚠️ Google indexing notification failed (non-critical):", googleError.message);
      // Don't fail the request on Google indexing error
    }

    res.status(201).json(update);
  } catch (error) {
    console.error("❌ Error creating notification:", error.message);
    console.error("Error stack:", error.stack);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errorMsg = Object.keys(error.errors)
        .map(k => `${k}: ${error.errors[k].message}`)
        .join(', ');
      return res.status(400).json({ message: errorMsg });
    }
    
    // Handle other errors
    res.status(500).json({ 
      message: 'Failed to create update: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
};

const deleteUpdate = async (req, res) => {
  try {
    const deletedUpdate = await Update.findByIdAndDelete(req.params.id);
    
    if (deletedUpdate) {
        // --- PING GOOGLE INSTANTLY ---
        const updateUrl = `https://thesamarthacademy.in/updates/${deletedUpdate.slug}`;
        await notifyGoogle(updateUrl, 'URL_DELETED');
        
        res.json({ message: 'Update removed' });
    } else {
        res.status(404).json({ message: 'Update not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    let update = await Update.findById(id);
    if (!update) return res.status(404).json({ message: 'Update not found' });

    const body = { ...req.body };

    // Ensure type matches one of the valid enum values (if being updated)
    if (body.type) {
      const validTypes = ['Job', 'Admit Card Update', 'Result', 'New Notification', 'Exam Strategy', 'Exam Pattern', 'Cut-Off Analysis', 'Answer Key', 'Syllabus Update', 'Important Dates', 'General'];
      if (!validTypes.includes(body.type)) {
        return res.status(400).json({ 
          message: `Invalid type: '${body.type}'. Must be one of: ${validTypes.join(', ')}`
        });
      }
    }

    // Handle Image Upload
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        console.error("❌ Cloudinary not configured! Missing environment variables.");
        return res.status(500).json({ 
          message: "Image upload service not configured. Please contact administrator.",
          details: "Missing Cloudinary credentials in environment variables"
        });
      }
      
      try {
        console.log("📤 Uploading image to Cloudinary:", req.file.originalname);
        const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        if (uploadResult) {
          body.imageUrl = uploadResult.secure_url;
          console.log("✅ Notification image uploaded to Cloudinary (update):", body.imageUrl);
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error during update:", uploadError.message);
        return res.status(400).json({ 
          message: `Image upload failed: ${uploadError.message}`,
          hint: "Make sure Cloudinary credentials are properly configured"
        });
      }
    }

    // Apply updates and save
    Object.keys(body).forEach(key => {
      if (typeof body[key] !== 'undefined') update[key] = body[key];
    });

    await update.save();

    // --- PING GOOGLE INSTANTLY ---
    try {
      const updateUrl = `https://thesamarthacademy.in/updates/${update.slug}`;
      await notifyGoogle(updateUrl, 'URL_UPDATED');
    } catch (googleError) {
      console.warn("⚠️ Google indexing notification failed (non-critical):", googleError.message);
    }

    res.json(update);
  } catch (error) {
    console.error('Error updating notification:', error);
    const errorMsg = error.errors ? Object.keys(error.errors).map(k => `${k}: ${error.errors[k].message}`).join(', ') : error.message;
    res.status(400).json({ message: errorMsg, error: error.toString() });
  }
};

// --- CURRENT AFFAIRS ---
const getCurrentAffairs = async (req, res) => {
  try {
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

const createCurrentAffair = async (req, res) => {
  try {
    const body = { ...req.body };
    
    // Handle Image Upload to Cloudinary
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (uploadResult) {
        body.imageUrl = uploadResult.secure_url;
      }
    }
    
    const news = await CurrentAffair.create(body);

    // --- PING GOOGLE INSTANTLY ---
    const newsUrl = `https://thesamarthacademy.in/current-affairs/${news.slug}`;
    await notifyGoogle(newsUrl, 'URL_UPDATED');

    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// *** CRITICAL STEP: EXPORT AS AN OBJECT ***
module.exports = { 
  getUpdates, 
  getUpdateById,
  createUpdate, 
  updateUpdate,
  deleteUpdate, 
  getCurrentAffairs, 
  createCurrentAffair 
};