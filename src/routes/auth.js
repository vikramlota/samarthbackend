const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRES_IN = '7d';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many login attempts. Try again later.' },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, error: 'Too many password reset requests.' },
});

function generateToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    // Ensure email is a string before calling toLowerCase
    const emailStr = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: emailStr, active: true })
      .select('+passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        error: `Account locked. Try again after ${user.lockedUntil.toLocaleTimeString()}.`,
      });
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_TIME);
      }
      await user.save();
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    const token = generateToken(user);
    res.json({ success: true, data: { token, user: user.toJSON() } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user || !user.active) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    res.json({ success: true, data: { user: user.toJSON() } });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase().trim(), active: true });
    if (user) {
      const resetToken = user.createPasswordResetToken();
      await user.save();
      console.log(`[DEV] Password reset token for ${user.email}: ${resetToken}`);
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, a reset link has been sent.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not process request' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: 'Token and new password required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires +passwordHash');

    if (!user) {
      return res.status(400).json({ success: false, error: 'Token is invalid or expired' });
    }

    user.passwordHash = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();

    res.json({ success: true, message: 'Password updated. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not reset password' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub).select('+passwordHash');

    if (!user) return res.status(401).json({ success: false, error: 'User not found' });

    const { currentPassword, newPassword } = req.body;
    if (!await user.verifyPassword(currentPassword)) {
      return res.status(401).json({ success: false, error: 'Current password incorrect' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }

    user.passwordHash = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not change password' });
  }
});

module.exports = router;
