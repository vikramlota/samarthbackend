const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model.js');

const protect = async (req, res, next) => {
  let token;

  console.log("🔐 Auth check - Authorization header:", req.headers.authorization ? 'Present' : 'Missing');

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      console.log("✅ Token extracted, verifying with JWT_SECRET...");
      
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET not configured!");
        return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verified for admin ID:", decoded.id);

      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        console.warn("⚠️ Admin not found for token ID:", decoded.id);
        return res.status(401).json({ message: 'Admin account not found' });
      }

      console.log("✅ Auth successful for admin:", req.admin.username);
      return next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed: ' + error.message });
    }
  }

  // No token provided
  console.warn("⚠️ No Authorization token provided");
  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

module.exports = { protect };