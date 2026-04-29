const https = require('https');
const Lead = require('../models/Lead.model.js');

// In-memory rate limit store: ip → { count, resetAt }
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const checkRateLimit = (ip) => {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
};

const validatePhone = (phone) => {
  const cleaned = String(phone).replace(/^(\+91|91)/, '').replace(/[\s\-]/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

const normalizePhone = (phone) => {
  return String(phone).replace(/^(\+91|91)/, '').replace(/[\s\-]/g, '').trim();
};

// Fire-and-forget WhatsApp notification to admin via callmebot
const notifyAdminWhatsApp = (name, phone, course, source) => {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!adminPhone || !apiKey) return;

  const text = encodeURIComponent(
    `🔔 New Lead!\nName: ${name}\nPhone: ${phone}\nCourse: ${course || 'Not specified'}\nSource: ${source}`
  );
  const url = `/whatsapp.php?phone=${adminPhone}&text=${text}&apikey=${apiKey}`;

  const req = https.request(
    { hostname: 'api.callmebot.com', path: url, method: 'GET' },
    (res) => { console.log(`📲 WhatsApp notification status: ${res.statusCode}`); }
  );
  req.on('error', (err) => console.error('WhatsApp notification error:', err.message));
  req.end();
};

// @desc  Submit a lead form
// @route POST /api/lead  (also available at POST /api/leads)
const submitLead = async (req, res) => {
  try {
    // Honeypot: bots fill hidden field "website"
    if (req.body.website) {
      return res.status(200).json({
        success: true,
        leadId: 'bot_rejected',
        message: 'Thanks! We will contact you within 24 hours.'
      });
    }

    const { name, phone, email, course, preferredTime, message, source } = req.body;

    // Required field validation
    const errors = {};
    if (!name || String(name).trim().length < 2) errors.name = 'Please enter your full name';
    if (!phone) errors.phone = 'Phone number is required';
    if (!source) errors.source = 'Source is required';

    if (phone && !validatePhone(phone)) {
      errors.phone = 'Invalid phone number. Please enter a valid 10-digit Indian mobile number.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Rate limiting by IP (max 5 submissions per hour)
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || req.socket?.remoteAddress
      || 'unknown';

    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        success: false,
        error: 'Too many submissions. Please try again in an hour.'
      });
    }

    const lead = await Lead.create({
      fullName: String(name).trim(),
      phone: normalizePhone(phone),
      email: email ? String(email).trim() : undefined,
      courseInterest: course ? String(course).trim() : undefined,
      preferredTime: preferredTime ? String(preferredTime).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      source: String(source).trim(),
      ip,
      userAgent: req.headers['user-agent'] || undefined
    });

    // Async admin notification (non-blocking)
    notifyAdminWhatsApp(name, normalizePhone(phone), course, source);

    res.status(201).json({
      success: true,
      leadId: `lead_${lead._id}`,
      message: 'Thanks! We will contact you within 24 hours.'
    });
  } catch (error) {
    console.error('Lead submission error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.'
    });
  }
};

// @desc  Get all leads
// @route GET /api/leads
// @access Private (Admin)
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ submittedAt: -1 });
    res.json({ success: true, data: leads, total: leads.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { submitLead, getLeads };
