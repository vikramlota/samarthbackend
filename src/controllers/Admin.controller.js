const Admin = require('../models/Admin.model.js');
const generateToken = require('../utils/generateToken.js');
const bcrypt = require('bcrypt');

// @desc    Auth Admin & Get Token
// @route   POST /api/admin/login
const authAdmin = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    const admin = await Admin.findOne({ username });
    console.log('Admin lookup result:', !!admin);

    const passwordMatches = admin ? await bcrypt.compare(password, admin.password) : false;
    console.log('Password matches:', passwordMatches);

    if (admin && passwordMatches) {
      return res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    }

    return res.status(401).json({ message: 'Invalid username or password' });
  } catch (err) {
    console.error('Error in authAdmin:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register Admin (Dev only)
// @route   POST /api/admin/register
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ username, password: hashedPassword });

    if (admin) {
      return res.status(201).json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    }

    return res.status(400).json({ message: 'Invalid data' });
  } catch (err) {
    console.error('Error in registerAdmin:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authAdmin, registerAdmin };