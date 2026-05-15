const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireEditor } = require('../middlewares/auth.middleware.js');
const { uploadOnCloudinary } = require('../utils/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

// POST /api/upload/image
router.post('/image', requireEditor, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }
    const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, error: error.message || 'Upload failed' });
  }
});

module.exports = router;
