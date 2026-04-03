const SuccessStory = require('../models/SuccessStory.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// @desc    Get all results
// @route   GET /api/results
const getResults = async (req, res) => {
  const results = await SuccessStory.find({}).sort({ year: -1 });
  // Ensure image URLs are HTTPS
  const sanitizedResults = results.map(item => ({
    ...item.toObject(),
    imageUrl: item.imageUrl ? item.imageUrl.replace(/^http:/, 'https:') : item.imageUrl
  }));
  res.json(sanitizedResults);
};

// @desc    Add a result
// @route   POST /api/results
// @access  Private
const addResult = async (req, res) => {
  try {
    console.log('📤 POST /api/results request received');
    console.log('📦 req.file:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'NO FILE');
    console.log('📝 req.body keys:', Object.keys(req.body));
    
    const body = { ...req.body };
    
    if (req.file) {
      try {
        console.log('🖼️ Attempting to upload image to Cloudinary...');
        const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        console.log('✅ Cloudinary upload result:', uploadResult ? uploadResult.secure_url : 'null');
        
        if (uploadResult && (uploadResult.secure_url || uploadResult.url)) {
          body.imageUrl = uploadResult.secure_url || uploadResult.url;
          console.log('✅ Image URL set:', body.imageUrl);
        } else {
          console.warn('⚠️ Cloudinary returned but no URL found');
        }
      } catch (uploadErr) {
        console.error('❌ Cloudinary upload failed:', uploadErr.message);
        return res.status(400).json({ message: 'Image upload failed', details: uploadErr.message });
      }
    } else {
      console.warn('⚠️ No file received in request');
    }
    
    console.log('💾 Creating SuccessStory with data:', body);
    const result = await SuccessStory.create(body);
    console.log('✅ SuccessStory created:', result._id);
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Error in addResult:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete result
// @route   DELETE /api/results/:id
// @access  Private
const deleteResult = async (req, res) => {
  const result = await SuccessStory.findById(req.params.id);
  if (result) {
    await result.deleteOne();
    res.json({ message: 'Result removed' });
  } else {
    res.status(404).json({ message: 'Result not found' });
  }
};

module.exports = { getResults, addResult, deleteResult };