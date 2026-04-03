const express = require('express');
const router = express.Router();
const { 
  getCurrentAffairs,
  getCurrentAffairBySlug,
  createCurrentAffair, 
  deleteCurrentAffair,
  updateCurrentAffair // <--- Import this
} = require('../controllers/currentaffairs.controllers.js');

const { protect } = require('../middlewares/auth.middleware.js');
const { upload, handleMullerError } = require('../middlewares/upload.middleware.js');

// Logging middleware for debugging
router.post('/', (req, res, next) => {
  console.log('🔍 POST /current-affairs route - headers:', req.headers['content-type']);
  next();
});

router.put('/:id', (req, res, next) => {
  console.log('🔍 PUT /current-affairs/:id route - headers:', req.headers['content-type']);
  next();
});

router.get('/', getCurrentAffairs);
router.get('/:slug', getCurrentAffairBySlug); // <-- Change this line to use slug instead of ID
router.post('/', protect, upload.single('image'), handleMullerError, createCurrentAffair);
router.delete('/:id', protect, deleteCurrentAffair);

// ADD THIS LINE:
router.put('/:id', protect, upload.single('image'), handleMullerError, updateCurrentAffair);

module.exports = router;