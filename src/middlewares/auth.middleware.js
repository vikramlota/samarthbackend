const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user || !user.active) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  });
}

async function requireEditor(req, res, next) {
  await requireAuth(req, res, () => {
    if (!['admin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Editor access required' });
    }
    next();
  });
}

// Backward-compat alias for old routes that used protect
const protect = requireEditor;
const adminAuth = requireEditor;

module.exports = { requireAuth, requireAdmin, requireEditor, protect, adminAuth };