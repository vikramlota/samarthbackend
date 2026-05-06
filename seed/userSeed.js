const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME || 'test' });

    const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@thesamarthacademy.in';
    const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
    const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Samarth Admin';

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`User already exists: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    const user = await User.create({
      email: ADMIN_EMAIL,
      passwordHash: ADMIN_PASSWORD,
      name: ADMIN_NAME,
      role: 'admin',
      active: true,
      emailVerified: true,
    });

    console.log(`✅ Admin created: ${user.email}`);
    console.log(`⚠️  Initial password: ${ADMIN_PASSWORD}`);
    console.log(`⚠️  CHANGE THIS PASSWORD IMMEDIATELY after first login.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
