const Inquiry = require('../models/Inquiry.model.js');

const PHONE_REGEX = /^[6-9]\d{9}$/;

const cleanPhone = (raw = '') =>
  String(raw).replace(/^(\+91|91)/, '').replace(/[\s\-]/g, '').trim();

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

// POST /api/inquiries
const submitInquiry = async (req, res) => {
  try {
    // Honeypot — bots fill the hidden "website" field
    if (req.body.website) {
      return res.status(200).json({ success: true, message: 'Thanks! We will contact you soon.' });
    }

    const { name, phone, email, inquiryType, course, preferredTime, preferredDate, message, source } = req.body;

    // Required field validation
    const errors = {};
    if (!name || String(name).trim().length < 2) errors.name = 'Please enter your full name';
    if (!phone) errors.phone = 'Phone number is required';
    if (phone && !PHONE_REGEX.test(cleanPhone(phone))) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const inquiry = await Inquiry.create({
      name:          String(name).trim(),
      phone:         cleanPhone(phone),
      email:         email ? String(email).trim().toLowerCase() : undefined,
      inquiryType:   inquiryType || 'general',
      course:        course   ? String(course).trim()   : undefined,
      preferredTime: preferredTime ? String(preferredTime).trim() : undefined,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      message:       message  ? String(message).trim()  : undefined,
      source:        source   ? String(source).trim()   : 'unknown',
      ipAddress:     (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
                      || req.socket?.remoteAddress
                      || 'unknown',
      userAgent:     req.headers['user-agent'] || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Thanks! We will contact you within 24 hours.',
      inquiryId: inquiry._id,
    });
  } catch (error) {
    console.error('Inquiry submission error:', error.message);
    res.status(500).json({ success: false, error: 'Could not submit. Please try again.' });
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────

// GET /api/inquiries/admin/all?status=new&inquiryType=demo-class&page=1&limit=50
const adminListAll = async (req, res) => {
  try {
    const { status, inquiryType, source, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status)      filter.status = status;
    if (inquiryType) filter.inquiryType = inquiryType;
    if (source)      filter.source = source;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [data, total] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Inquiry.countDocuments(filter),
    ]);

    res.json({ success: true, data, total, page: parseInt(page) });
  } catch (error) {
    console.error('Inquiry list error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiries' });
  }
};

// GET /api/inquiries/admin/stats/summary
const adminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, todayCount, byStatus, byType, topSources] = await Promise.all([
      Inquiry.countDocuments({}),
      Inquiry.countDocuments({ createdAt: { $gte: today } }),
      Inquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Inquiry.aggregate([{ $group: { _id: '$inquiryType', count: { $sum: 1 } } }]),
      Inquiry.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({ success: true, data: { total, today: todayCount, byStatus, byType, topSources } });
  } catch (error) {
    console.error('Inquiry stats error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};

// GET /api/inquiries/admin/:id
const adminGetById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('assignedTo', 'username')
      .populate('notes.addedBy', 'username');
    if (!inquiry) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/inquiries/admin/:id  — update status / assignment only
const adminUpdate = async (req, res) => {
  try {
    const ALLOWED = ['status', 'assignedTo', 'contactedAt', 'convertedAt'];
    const updates = {};
    ALLOWED.forEach(k => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, error: 'Not found' });

    console.log(`📋 Inquiry ${inquiry._id} updated by ${req.admin?.username}`);
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// POST /api/inquiries/admin/:id/notes  — append an admin note
const adminAddNote = async (req, res) => {
  try {
    if (!req.body.text?.trim()) {
      return res.status(400).json({ success: false, error: 'Note text is required' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, error: 'Not found' });

    inquiry.notes.push({ text: req.body.text.trim(), addedBy: req.admin?._id });
    await inquiry.save();

    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { submitInquiry, adminListAll, adminStats, adminGetById, adminUpdate, adminAddNote };
