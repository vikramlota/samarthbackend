const express = require('express');
const router = express.Router();
const { getResults, addResult, deleteResult } = require('../controllers/result.controller.js');
const { protect } = require('../middlewares/auth.middleware');
const { upload, handleMullerError } = require('../middlewares/upload.middleware.js');

// Logging middleware for debugging
router.post('/', (req, res, next) => {
  console.log('🔍 POST /results route - headers:', req.headers['content-type']);
  next();
});

router.route('/').get(getResults).post(protect, upload.single('image'), handleMullerError, addResult);
router.route('/:id').delete(protect, deleteResult);

module.exports = router;