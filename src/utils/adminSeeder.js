const Admin = require('../models/Admin.model.js');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
  try {
    // Check if admin already exists (by username)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const existingAdmin = await Admin.findOne({ username: adminUsername });

    if (existingAdmin) {
      console.log('✅ Admin already exists. Skipping seed.');
      return;
    }

    // Create default admin with env vars or defaults
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await Admin.create({
      username: adminUsername,
      password: hashedPassword,
    });

    console.log(`✅ Admin created: username="${adminUsername}"`);
    if (adminPassword === 'admin123') {
      console.log('⚠️  Using default password. Change immediately after first login!');
    }

  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;