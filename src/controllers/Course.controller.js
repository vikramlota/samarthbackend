const Course = require('../models/Course.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const fs = require('fs');
const path = require('path');
const { notifyGoogle } = require('../utils/googleIndexing.js');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    console.log('🎓 getCourses called - fetching active courses...');
    // Sort by latest created
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
    console.log(`✅ Found ${courses.length} courses`);
    res.json(courses);
  } catch (error) {
    console.error('❌ getCourses error:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin)
const createCourse = async (req, res) => {
  let tempFilePath = null;
  
  try {
    if (!req.file) {
        return res.status(400).json({ message: "❌ Image file is missing in the request." });
    }

    // UPLOAD LOGIC
    let imageUrl = "";
    try {
        if (req.file.buffer) {
            tempFilePath = path.join('/tmp', `${Date.now()}-${req.file.originalname}`);
            fs.writeFileSync(tempFilePath, req.file.buffer);
        } else {
            tempFilePath = req.file.path;
        }
        
        const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);
        
        if (!cloudinaryResponse?.secure_url) {
             throw new Error("Cloudinary returned no URL");
        }
        
        imageUrl = cloudinaryResponse.secure_url;
    } catch (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
    } finally {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Cleanup error:", e); }
        }
    }

    // PARSE FEATURES
    let features = [];
    if (req.body.features) {
        features = Array.isArray(req.body.features) ? req.body.features : [req.body.features];
    } else {
        Object.keys(req.body).forEach((key) => {
            const m = key.match(/^features\[(\d+)\]$/);
            if (m) features[Number(m[1])] = req.body[key];
        });
    }
    features = features.filter(f => f);

    // MANUAL CONSTRUCTION (Slug comes directly from req.body now)
    const courseData = {
        title: req.body.title,
        slug: req.body.slug, 
        description: req.body.description,
        category: req.body.category,
        badgeText: req.body.badgeText,
        link: req.body.link,
        youtubeLink: req.body.youtubeLink,
        colorTheme: req.body.colorTheme, 
        features: features,
        image: imageUrl, 
    };

    const course = new Course(courseData);
    const createdCourse = await course.save();

    // --- PING GOOGLE INSTANTLY ---
    const courseUrl = `https://thesamarthacademy.in/courses/${createdCourse.slug}`;
    await notifyGoogle(courseUrl, 'URL_UPDATED');

    res.status(201).json(createdCourse);

  } catch (error) {
    console.error("❌ Create Course Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:slug
// @access  Private (Admin)
const updateCourse = async (req, res) => {
    let tempFilePath = null;
    try {
        const { slug } = req.params;
        let course;
        
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
          course = await Course.findById(slug);
        } else {
          course = await Course.findOne({ slug });
        }

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const body = { ...req.body };

        // Handle Image Upload
        if (req.file) {
            try {
                 if (req.file.buffer) {
                    tempFilePath = path.join('/tmp', `${Date.now()}-${req.file.originalname}`);
                    fs.writeFileSync(tempFilePath, req.file.buffer);
                } else {
                    tempFilePath = req.file.path;
                }

                const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);

                if (cloudinaryResponse && cloudinaryResponse.secure_url) {
                    body.image = cloudinaryResponse.secure_url;
                }
            } catch (uploadError) {
                 throw new Error(`Image upload failed: ${uploadError.message}`);
            } finally {
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Cleanup error", e); }
                }
            }
        }

        // Handle Features
        const features = [];
        Object.keys(body).forEach((key) => {
            const m = key.match(/^features\[(\d+)\]$/);
            if (m) {
                features[Number(m[1])] = body[key];
                delete body[key];
            }
        });
        
        if (features.length > 0) {
            body.features = features.filter(f => f !== undefined && f !== null);
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            course._id,
            { $set: body },
            { new: true, runValidators: true } 
        );

        // --- PING GOOGLE INSTANTLY ---
        const courseUrl = `https://thesamarthacademy.in/courses/${updatedCourse.slug}`;
        await notifyGoogle(courseUrl, 'URL_UPDATED');

        res.json(updatedCourse);

    } catch (error) {
        console.error('Course update error:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:slug
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    let course;
    
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(slug);
    } else {
      course = await Course.findOne({ slug });
    }
    
    if (course) {
      await Course.deleteOne({ _id: course._id });

      // --- PING GOOGLE INSTANTLY ---
      const courseUrl = `https://thesamarthacademy.in/courses/${course.slug}`;
      await notifyGoogle(courseUrl, 'URL_DELETED');

      res.json({ message: 'Course removed successfully', deletedCourse: course });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single course by ID or Slug
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const param = req.params.id;
    let course;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(param);
    } else {
      course = await Course.findOne({ slug: param });
      
      if (!course) {
        const regexSlug = new RegExp(`^${param}$`, 'i');
        course = await Course.findOne({ slug: regexSlug });
      }
      
      // Removed the heavy database fallback loop here!
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found', searchedParam: param });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse, getCourseById };