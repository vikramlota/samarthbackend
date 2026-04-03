const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin } = require('../controllers/Admin.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { upload } = require('../middlewares/upload.middleware.js');

router.post('/login', authAdmin);
router.post('/register', registerAdmin);

// File Upload Route
router.post('/upload', protect, upload.single('file'), (req, res) => {
  res.send({ 
    message: 'File uploaded', 
    filePath: `/uploads/${req.file.filename}` 
  });
});

module.exports = router;