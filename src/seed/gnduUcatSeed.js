/**
 * gnduUcatSeed.js — GNDU UCAT selections & success stories
 *
 * Populates both `selections` and `successstories` collections with GNDU UCAT 2026 results
 * (Guru Nanak Dev University campus admissions, session Jun 2026-27),
 * sourced from the "GNDU UCAT SELECTIONS" congratulatory-poster batch.
 *
 * WHAT THIS SCRIPT DOES
 *   1. Connects to MongoDB (MONGODB_URI)
 *   2. Uploads each student's photo (from ./photos) to Cloudinary
 *   3. Upserts a Selection document AND a SuccessStory document per student with the resulting
 *      Cloudinary secure_url, so the results appear on both Landing Pages and Success Stories (/Selections) page.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const Selection = require('../models/Selection.model.js');
const SuccessStory = require('../models/SuccessStory.model.js');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : '',
  api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : '',
  api_secret: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : '',
});

const PHOTOS_DIR = path.join(__dirname, 'photos');
const EXAM = 'GNDU UCAT';
const EXAM_TAG = 'gndu-ucat';
const YEAR = 2026;
const CLOUDINARY_FOLDER = 'samarth-academy/selections/gndu-ucat';

// rank left undefined where no rank was printed on the poster
const students = [
  { slug: 'aarush-malhotra',  name: 'Aarush Malhotra',  photoFile: 'aarush-malhotra.png' },
  { slug: 'anmoljit-kaur',    name: 'Anmoljit Kaur',    photoFile: 'anmoljit-kaur.png' },
  { slug: 'anna',             name: 'Anna',             photoFile: 'anna.png' },
  { slug: 'bharatjeet',       name: 'Bharatjeet',       photoFile: 'bharatjeet.png' },
  { slug: 'esharver',         name: 'Esharver',         photoFile: 'esharver.png',        rank: '300' },
  { slug: 'gagandeep-singh',  name: 'Gagandeep Singh',  photoFile: 'gagandeep-singh.png', rank: '168', featured: true },
  { slug: 'harkirat-singh',   name: 'Harkirat Singh',   photoFile: 'harkirat-singh.png' },
  { slug: 'jashandeep-bawa',  name: 'Jashandeep Bawa',  photoFile: 'jashandeep-bawa.png', rank: '150', post: 'M.Com (FYIP)', featured: true },
  { slug: 'jasmeen-kaur',     name: 'Jasmeen Kaur',     photoFile: 'jasmeen-kaur.png',    rank: '191' },
  { slug: 'jobanpreet-singh', name: 'Jobanpreet Singh', photoFile: 'jobanpreet-singh.png' },
  { slug: 'kanal-seth',       name: 'Kanal Seth',       photoFile: 'kanal-seth.png',      rank: '191' },
  { slug: 'kanishka',         name: 'Kanishka',         photoFile: 'kanishka.png',        rank: '191' },
  { slug: 'kuwardeep-singh',  name: 'Kuwardeep Singh',  photoFile: 'kuwardeep-singh.png' },
  { slug: 'neeraj-ramgarhia', name: 'Neeraj Ramgarhia', photoFile: 'neeraj-ramgarhia.png' },
  { slug: 'nitish-sharma',    name: 'Nitish Sharma',    photoFile: 'nitish-sharma.png' },
  { slug: 'preetika',         name: 'Preetika',         photoFile: 'preetika.png' },
  { slug: 'ratneek-kaur',     name: 'Ratneek Kaur',     photoFile: 'ratneek-kaur.png' },
  { slug: 'shubhseerat-kaur', name: 'Shubhseerat Kaur', photoFile: 'shubhseerat-kaur.png' },
  { slug: 'tanmay-mahajan',   name: 'Tanmay Mahajan',   photoFile: 'tanmay-mahajan.png',  rank: '168', featured: true },
  { slug: 'upraj-singh',      name: 'Upraj Singh',      photoFile: 'upraj-singh.png' },
  { slug: 'vardhan-khanna',   name: 'Vardhan Khanna',   photoFile: 'vardhan-khanna.png' },
  { slug: 'mannat-bedi',      name: 'Mannat Bedi',      photoFile: 'mannat-bedi.png' },
];

async function uploadPhoto(student) {
  const filePath = path.join(PHOTOS_DIR, student.photoFile);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! photo not found for ${student.name} at ${filePath} — skipping upload`);
    return null;
  }
  const result = await cloudinary.uploader.upload(filePath, {
    folder: CLOUDINARY_FOLDER,
    public_id: student.slug,
    overwrite: true,
    resource_type: 'image',
    format: 'jpg',
  });
  return result.secure_url;
}

async function run() {
  const dbName = process.env.DB_NAME || 'test';
  await mongoose.connect(process.env.MONGODB_URI, { dbName });
  console.log(`Connected to MongoDB database: '${dbName}'`);

  let selectionsCount = 0;
  let successStoriesCount = 0;

  for (const [index, student] of students.entries()) {
    process.stdout.write(`[${index + 1}/${students.length}] ${student.name} ... `);

    const photoUrl = await uploadPhoto(student);

    // 1. Seed Selection model (for Landing Pages & Selections list)
    const selectionDoc = {
      name: student.name,
      exam: EXAM,
      examTag: EXAM_TAG,
      year: YEAR,
      rank: student.rank,
      post: student.post,
      featured: Boolean(student.featured),
      active: true,
      published: true,
      displayOrder: index,
    };
    if (photoUrl) selectionDoc.photo = photoUrl;

    await Selection.updateOne(
      { name: student.name, examTag: EXAM_TAG, year: YEAR },
      { $set: selectionDoc },
      { upsert: true }
    );
    selectionsCount++;

    // 2. Seed SuccessStory model (for /api/results & Success Stories page)
    const successStoryDoc = {
      studentName: student.name,
      examName: EXAM,
      category: 'State',
      year: YEAR,
      rank: student.rank || '',
      post: student.post || '',
      imageUrl: photoUrl || '',
      photo: photoUrl || '',
      featured: Boolean(student.featured),
      published: true,
      testimonial: student.post
        ? `${student.name} secured admission in ${student.post} through GNDU UCAT 2026.`
        : `${student.name} successfully cleared the GNDU UCAT 2026 entrance exam.`
    };

    await SuccessStory.updateOne(
      { studentName: student.name, examName: EXAM, year: YEAR },
      { $set: successStoryDoc },
      { upsert: true }
    );
    successStoriesCount++;

    console.log('seeded to Selections & SuccessStories');
  }

  console.log(`\nDone. Seeded ${selectionsCount} Selections and ${successStoriesCount} Success Stories.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
