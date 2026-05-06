require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category.model');

const categoriesSeed = [
  {
    name: 'SSC Tips & Strategy',
    slug: 'ssc-tips',
    description: 'Preparation strategies, study plans, and tips for SSC CGL, CHSL, MTS, and other SSC exams.',
    color: 'red',
    iconName: 'FaGraduationCap',
    displayOrder: 1,
    seo: {
      title: 'SSC Tips & Strategy | Samarth Academy Blog',
      description: 'Expert SSC preparation tips and strategies from coaching specialists at Samarth Academy, Amritsar.',
    },
  },
  {
    name: 'Banking Exam Prep',
    slug: 'banking-prep',
    description: 'IBPS PO, SBI PO, RBI Grade B, and clerk-level banking exam preparation guides.',
    color: 'orange',
    iconName: 'FaUniversity',
    displayOrder: 2,
    seo: {
      title: 'Banking Exam Preparation | Samarth Academy Blog',
      description: 'Banking exam preparation guides for IBPS PO, SBI PO, and other banking exams.',
    },
  },
  {
    name: 'Punjab Police & State Exams',
    slug: 'punjab-police-state',
    description: 'Punjab Police, Patwari, and state government exam preparation insights.',
    color: 'red',
    iconName: 'FaShieldAlt',
    displayOrder: 3,
    seo: {
      title: 'Punjab Police & State Exams | Samarth Academy Blog',
      description: 'Punjab Police, Patwari, and state exam preparation tips and updates.',
    },
  },
  {
    name: 'Exam Notifications',
    slug: 'exam-notifications',
    description: 'Latest government exam notifications, important dates, and application updates.',
    color: 'orange',
    iconName: 'FaBell',
    displayOrder: 4,
    seo: {
      title: 'Latest Exam Notifications | Samarth Academy Blog',
      description: 'Stay updated with the latest government exam notifications and important dates.',
    },
  },
  {
    name: 'Career Guidance',
    slug: 'career-guidance',
    description: 'Government job career advice, salary insights, and life as a government officer.',
    color: 'gray',
    iconName: 'FaCompass',
    displayOrder: 5,
    seo: {
      title: 'Government Career Guidance | Samarth Academy Blog',
      description: 'Career guidance for government job aspirants from ex-government officers.',
    },
  },
  {
    name: 'Success Stories',
    slug: 'success-stories',
    description: 'Inspiring journeys of Samarth Academy students who cleared government exams.',
    color: 'green',
    iconName: 'FaTrophy',
    displayOrder: 6,
    seo: {
      title: 'Student Success Stories | Samarth Academy Blog',
      description: 'Real success stories from Samarth Academy students who cracked government exams.',
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    if (process.argv.includes('--clear')) {
      await Category.deleteMany({});
      console.log('🗑️  Cleared existing categories');
    }

    for (const cat of categoriesSeed) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`✓ Seeded: ${cat.name}`);
    }

    console.log(`\n✅ Done — ${categoriesSeed.length} categories seeded`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
