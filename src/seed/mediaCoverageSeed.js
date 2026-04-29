'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const MediaCoverage = require('../models/MediaCoverage.model.js');

// TODO: Replace articleUrl values with real links once you have actual press coverage.
// Placeholder entries demonstrate the schema — update before going live.
const mediaSeed = [
  {
    outletName: 'The Tribune',
    outletLogo: '/images/media/tribune-logo.png', // TODO: Upload logo to Cloudinary
    articleTitle: 'Amritsar Coaching Institutes Reshape Government Exam Preparation',
    articleUrl: 'https://www.tribuneindia.com/', // TODO: Replace with actual article URL
    publishedDate: new Date('2024-08-15'),
    excerpt: "Samarth Academy stands out in Amritsar's coaching landscape for its officer-led approach — founders who bring real government experience into every classroom.",
    active: true,
    featured: true,
    displayOrder: 1,
  },
  {
    outletName: 'Hindustan Times — Punjab',
    outletLogo: '/images/media/ht-logo.png', // TODO: Upload logo to Cloudinary
    articleTitle: 'Local Coaching Centre Crosses 1,000 Government Selections Milestone',
    articleUrl: 'https://www.hindustantimes.com/', // TODO: Replace with actual article URL
    publishedDate: new Date('2024-03-22'),
    excerpt: 'Samarth Academy, Amritsar, celebrated its 1,000th cumulative government selection in March 2024 — a milestone achieved over 16 years of focused preparation.',
    active: true,
    featured: true,
    displayOrder: 2,
  },
  {
    outletName: 'Punjab Kesari',
    outletLogo: '/images/media/punjab-kesari-logo.png', // TODO: Upload logo to Cloudinary
    articleTitle: 'ਅੰਮ੍ਰਿਤਸਰ ਦੀ ਸਮਰੱਥ ਅਕੈਡਮੀ ਦੇ 500 ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਸਰਕਾਰੀ ਨੌਕਰੀ',
    articleUrl: 'https://www.punjabkesari.in/', // TODO: Replace with actual article URL
    publishedDate: new Date('2022-11-10'),
    excerpt: 'ਅੰਮ੍ਰਿਤਸਰ ਵਿੱਚ ਸਮਰੱਥ ਅਕੈਡਮੀ ਦੇ 500 ਤੋਂ ਵੱਧ ਵਿਦਿਆਰਥੀਆਂ ਨੇ SSC ਅਤੇ ਬੈਂਕਿੰਗ ਪ੍ਰੀਖਿਆਵਾਂ ਵਿੱਚ ਸਫਲਤਾ ਪ੍ਰਾਪਤ ਕੀਤੀ।',
    active: true,
    featured: false,
    displayOrder: 3,
  },
  {
    outletName: 'Amar Ujala — Amritsar',
    outletLogo: '/images/media/amar-ujala-logo.png', // TODO: Upload logo to Cloudinary
    articleTitle: 'सरकारी नौकरी की तैयारी में अमृतसर की समर्थ अकादमी का अनूठा तरीका',
    articleUrl: 'https://www.amarujala.com/', // TODO: Replace with actual article URL
    publishedDate: new Date('2023-05-18'),
    excerpt: 'सरकारी अफसर रह चुके शिक्षकों द्वारा संचालित समर्थ अकादमी में छात्रों को परीक्षा के साथ-साथ नौकरी की असली दुनिया की तैयारी भी दी जाती है।',
    active: true,
    featured: false,
    displayOrder: 4,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    if (process.argv.includes('--clear')) {
      await MediaCoverage.deleteMany({});
      console.log('🗑️  Cleared existing media coverage entries');
    }

    let created = 0, updated = 0;
    for (const item of mediaSeed) {
      const result = await MediaCoverage.findOneAndUpdate(
        { articleTitle: item.articleTitle },
        item,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      const isNew = result.createdAt.getTime() === result.updatedAt.getTime();
      console.log(`  ${isNew ? '✨ Created' : '♻️  Updated'}: ${item.outletName}`);
      isNew ? created++ : updated++;
    }

    console.log(`\n✅ Seed complete — ${created} created, ${updated} updated`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Media coverage seed error:', error.message);
    process.exit(1);
  }
}

seed();
