const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonials.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const { upload } = require('../middlewares/upload.middleware.js');

router.route('/')
  .get(getTestimonials)
  .post(protect, upload.single('photo'), createTestimonial);

router.route('/:id')
  .put(protect, upload.single('photo'), updateTestimonial)
  .delete(protect, deleteTestimonial);

module.exports = router;
