/**
 * Database indexes seed
 * Run this script to create indexes for optimal query performance
 * 
 * Usage: node src/utils/createIndexes.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('../models/Course.model.js');
const Update = require('../models/Update.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');
const SuccessStory = require('../models/SuccessStory.model.js');
const Lead = require('../models/Lead.model.js');

async function createIndexes() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    console.log('📊 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Batch create indexes with error handling
    const indexCreationTasks = [];

    // Course indexes
    console.log('\n📚 Creating Course indexes...');
    indexCreationTasks.push(
      Course.collection.createIndex({ isActive: 1, createdAt: -1 })
        .then(() => console.log('  ✅ Index: isActive + createdAt (DESC)'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );
    
    indexCreationTasks.push(
      Course.collection.createIndex({ slug: 1 }, { unique: true, sparse: true })
        .then(() => console.log('  ✅ Index: slug (unique)'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    indexCreationTasks.push(
      Course.collection.createIndex({ category: 1 })
        .then(() => console.log('  ✅ Index: category'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    // Update (Notifications) indexes
    console.log('\n📰 Creating Update indexes...');
    indexCreationTasks.push(
      Update.collection.createIndex({ createdAt: -1 })
        .then(() => console.log('  ✅ Index: createdAt (DESC)'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    indexCreationTasks.push(
      Update.collection.createIndex({ slug: 1 }, { unique: true, sparse: true })
        .then(() => console.log('  ✅ Index: slug (unique)'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    // CurrentAffair indexes
    console.log('\n🌍 Creating CurrentAffair indexes...');
    indexCreationTasks.push(
      CurrentAffair.collection.createIndex({ createdAt: -1 })
        .then(() => console.log('  ✅ Index: createdAt (DESC)'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    indexCreationTasks.push(
      CurrentAffair.collection.createIndex({ slug: 1 }, { unique: true, sparse: true })
        .then(() => console.log('  ✅ Index: slug (unique)'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    // SuccessStory indexes
    console.log('\n🏆 Creating SuccessStory indexes...');
    indexCreationTasks.push(
      SuccessStory.collection.createIndex({ year: -1 })
        .then(() => console.log('  ✅ Index: year (DESC)'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    // Lead indexes (for quick queries from frontend)
    console.log('\n👥 Creating Lead indexes...');
    indexCreationTasks.push(
      Lead.collection.createIndex({ email: 1 })
        .then(() => console.log('  ✅ Index: email'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    indexCreationTasks.push(
      Lead.collection.createIndex({ phone: 1 })
        .then(() => console.log('  ✅ Index: phone'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    indexCreationTasks.push(
      Lead.collection.createIndex({ createdAt: -1 })
        .then(() => console.log('  ✅ Index: createdAt (DESC)'))
        .catch(e => console.error('  ❌ Error:', e.message))
    );

    // Wait for all index creations
    await Promise.all(indexCreationTasks);

    console.log('\n✨ All indexes created successfully!');
    
    // List all indexes
    console.log('\n📋 Existing indexes:');
    const models = [Course, Update, CurrentAffair, SuccessStory, Lead];
    for (const Model of models) {
      const indexes = await Model.collection.getIndexes();
      console.log(`  ${Model.modelName}: ${Object.keys(indexes).length} indexes`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Index creation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createIndexes();
}

module.exports = createIndexes;
