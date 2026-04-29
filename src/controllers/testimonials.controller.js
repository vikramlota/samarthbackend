const SuccessStory = require('../models/SuccessStory.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// @desc  Get published testimonials
// @route GET /api/testimonials
const getTestimonials = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 6, 50);
    const exam = req.query.exam;

    const filter = { published: true };
    if (req.query.featured === 'true') filter.featured = true;
    if (exam) filter.examName = new RegExp(exam, 'i');

    const [items, total] = await Promise.all([
      SuccessStory.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(limit)
        .lean(),
      SuccessStory.countDocuments(filter)
    ]);

    const data = items.map(item => ({
      _id: item._id,
      name: item.studentName,
      exam: item.examName,
      selectionYear: item.year,
      rank: item.rank || null,
      post: item.post || null,
      photo: item.photo || item.imageUrl || null,
      quote: item.testimonial || null,
      rating: item.rating || null,
      featured: item.featured || false,
      publishedAt: item.publishedAt || item.createdAt
    }));

    res.json({ success: true, data, total });
  } catch (error) {
    console.error('Testimonials fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch testimonials' });
  }
};

// @desc  Create a testimonial
// @route POST /api/testimonials
// @access Private (Admin)
const createTestimonial = async (req, res) => {
  try {
    const { name, exam, selectionYear, rank, post, photo, quote, rating, featured, category } = req.body;

    let photoUrl = photo;
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) photoUrl = result.secure_url;
    }

    const story = await SuccessStory.create({
      studentName: name,
      examName: exam,
      year: Number(selectionYear),
      rank: rank || undefined,
      post: post || undefined,
      photo: photoUrl || undefined,
      testimonial: quote || undefined,
      rating: rating ? Number(rating) : undefined,
      featured: featured === true || featured === 'true',
      published: true,
      publishedAt: new Date(),
      category: category || 'SSC'
    });

    res.status(201).json({ success: true, data: story });
  } catch (error) {
    console.error('Testimonial create error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc  Update a testimonial
// @route PUT /api/testimonials/:id
// @access Private (Admin)
const updateTestimonial = async (req, res) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (result?.secure_url) body.photo = result.secure_url;
    }

    // Map API field names to model field names
    const update = {};
    if (body.name !== undefined) update.studentName = body.name;
    if (body.exam !== undefined) update.examName = body.exam;
    if (body.selectionYear !== undefined) update.year = Number(body.selectionYear);
    if (body.rank !== undefined) update.rank = body.rank;
    if (body.post !== undefined) update.post = body.post;
    if (body.photo !== undefined) update.photo = body.photo;
    if (body.quote !== undefined) update.testimonial = body.quote;
    if (body.rating !== undefined) update.rating = Number(body.rating);
    if (body.featured !== undefined) update.featured = body.featured === true || body.featured === 'true';
    if (body.published !== undefined) update.published = body.published === true || body.published === 'true';

    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!story) return res.status(404).json({ success: false, error: 'Testimonial not found' });
    res.json({ success: true, data: story });
  } catch (error) {
    console.error('Testimonial update error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc  Delete a testimonial
// @route DELETE /api/testimonials/:id
// @access Private (Admin)
const deleteTestimonial = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ success: false, error: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
