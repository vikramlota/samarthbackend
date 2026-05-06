const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true, trim: true },

  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor',
    index: true,
  },

  active: { type: Boolean, default: true, index: true },
  emailVerified: { type: Boolean, default: false },

  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },

  lastLoginAt: { type: Date },
  lastLoginIp: { type: String },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  if (this.passwordHash && !this.passwordHash.startsWith('$2')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
});

UserSchema.methods.verifyPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  return resetToken;
};

UserSchema.methods.isLocked = function () {
  return this.lockedUntil && this.lockedUntil > new Date();
};

UserSchema.methods.canEdit = function () {
  return this.active && (this.role === 'admin' || this.role === 'editor');
};

UserSchema.methods.canDelete = function () {
  return this.active && this.role === 'admin';
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
