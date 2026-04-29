'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const AboutPage = require('../models/AboutPage.model.js');

const aboutSeed = {
  hero: {
    eyebrow: 'ABOUT US',
    headline: 'Empowering Dreams Since 2008',
    subheadline: "Amritsar's most trusted coaching institute for government exam preparation — founded by officers who cleared these exams themselves.",
  },

  founderStory: {
    eyebrow: 'OUR STORY',
    headline: 'From Officers to Educators',
    paragraphs: [
      'Samarth Academy was founded in 2008 with a simple but powerful idea: students preparing for government jobs deserve to learn from people who have actually walked that path. Our founders, Sidharth and Deepika, both come from successful government careers — Sidharth as a Branch Manager at Bank of India, Deepika as a GST & Customs Inspector with the Central Government. Together, they brought over 18 years of real government service experience into one classroom.',
      'They saw a gap that few others were addressing. Most coaching centres in Amritsar were teaching students how to attempt exam questions — but not preparing them for the reality of what government service actually demands. Students who got selected often struggled in their first months on the job because their coaching had been disconnected from the actual nature of the role.',
      'Samarth Academy was built to bridge that gap. Every class is designed by people who have lived these careers. We do not just teach the SSC CGL syllabus — we explain what an Income Tax Inspector actually investigates. We do not just prepare students for bank exams — we walk them through what a Probationary Officer does in their first week at a branch. That context changes everything about how students prepare.',
      'Today, 16 years later, we have helped over 1,200 students secure prestigious government positions across SSC, banking, Punjab Police, and teaching services. Our batches remain capped at 30 students. Our founders still teach. And our core principle remains unchanged: limited batches, structured preparation, and officer-led mentorship.',
      'We are not a mass coaching centre. We are a performance-driven academic institution that takes your government job preparation personally.',
    ],
    photo: '/images/founders-group.jpg', // TODO: Replace with real Cloudinary URL
  },

  founders: [
    {
      name: 'Sidharth',
      title: 'Co-Founder & Director',
      formerRole: 'Ex-Branch Manager, Bank of India',
      photo: '/images/founders/sidharth.jpg', // TODO: Replace with real Cloudinary URL
      bio: '<p>Sidharth brings 12 years of banking sector experience to Samarth Academy. As a former Branch Manager at Bank of India, he managed branch operations, credit portfolios, and customer relationships — giving him deep firsthand insight into what banks look for in officer-level candidates.</p><p>He has participated in recruitment interview panels and knows exactly what differentiates a candidate who gets selected from one who falls at the interview stage. This is the knowledge he brings to every batch.</p><p>Sidharth specialises in IBPS PO, SBI PO, and all banking exam preparation. His mock interview sessions are considered the most valuable part of the banking programme by alumni who have successfully cleared bank interviews.</p>',
      yearsOfService: 12,
      credentials: [
        'MBA Finance, Punjab University',
        'Branch Manager, Bank of India (12 years)',
        'CAIIB Certified',
        'Former Bank Recruitment Interview Panelist',
        'Specialisation: Banking Exams, Financial Awareness',
      ],
      displayOrder: 1,
    },
    {
      name: 'Deepika',
      title: 'Co-Founder & Director',
      formerRole: 'Ex-GST & Customs Inspector, Central Government',
      photo: '/images/founders/deepika.jpg', // TODO: Replace with real Cloudinary URL
      bio: '<p>Deepika served as a GST & Customs Inspector for 6 years in the Central Government after clearing SSC CGL. Her tenure gave her firsthand experience of investigation procedures, government protocol, and the day-to-day reality of inspector-level postings — knowledge that directly informs how she teaches SSC aspirants.</p><p>She is particularly known for her structured approach to Tier 3 (Descriptive) preparation — an area most coaching centres ignore and most candidates underestimate. Her essay and letter writing sessions have been credited by multiple students as the margin that pushed their rank into selection territory.</p><p>Deepika specialises in SSC (CGL, CHSL, MTS), UGC NET, Quantitative Aptitude, and Reasoning. She is also the academic director responsible for curriculum design across all Samarth Academy batches.</p>',
      yearsOfService: 6,
      credentials: [
        'M.A. Economics, Guru Nanak Dev University',
        'GST & Customs Inspector, Central Government (6 years)',
        'SSC CGL Selection, 2012',
        'Academic Director, Samarth Academy',
        'Specialisation: SSC, UGC NET, Descriptive Writing',
      ],
      displayOrder: 2,
    },
  ],

  stats: [
    { iconName: 'FaTrophy',           value: '16+',    label: 'Years of Excellence' },
    { iconName: 'FaUsers',            value: '5,000+', label: 'Students Taught' },
    { iconName: 'FaCertificate',      value: '1,200+', label: 'Final Selections' },
    { iconName: 'FaChalkboardTeacher',value: '40+',    label: 'Expert Faculty' },
    { iconName: 'FaBookOpen',         value: '20+',    label: 'Exam Categories' },
  ],

  mission: "To provide structured, performance-driven government exam coaching that prepares students not just to clear exams, but to thrive in the careers that follow. We believe quality education is not a privilege — it is a right.",

  vision: "To be North India's most trusted name in government exam preparation — where every aspirant gets officer-led mentorship, every batch is small enough for personal attention, and every selection becomes a story we are proud to tell.",

  values: [
    {
      iconName: 'FaShieldAlt',
      title: 'Integrity',
      description: "We deliver what we promise. No inflated success claims, no hidden charges, no advertisements that outpace reality. Our selection numbers are verifiable — ask any alumni.",
    },
    {
      iconName: 'FaHandshake',
      title: 'Accessibility',
      description: 'Quality coaching at fees that working-class families in Punjab can afford. EMI options are available because financial stress should not stand between a student and their government job.',
    },
    {
      iconName: 'FaChartLine',
      title: 'Excellence',
      description: 'Limited batches, structured curriculum, weekly assessments, individual tracking. We measure every student\'s progress and act on the data — not on assumptions.',
    },
    {
      iconName: 'FaUserShield',
      title: 'Mentorship',
      description: 'Real guidance from people who have done these jobs. Our founders do not just teach the syllabus — they share the lived experience of what government service actually looks like.',
    },
    {
      iconName: 'FaHeart',
      title: 'Student First',
      description: 'Every decision we make — batch size, fee structure, curriculum design — starts with one question: what gives our students the best chance of selection?',
    },
  ],

  journey: {
    eyebrow: 'OUR JOURNEY',
    headline: '16 Years of Excellence',
    subheadline: 'Key milestones that shaped Samarth Academy',
    milestones: [
      { year: 2008, title: 'Founded Samarth Academy', description: 'Sidharth and Deepika opened doors with their first batch of 12 students preparing for SSC CGL from a single classroom in Amritsar.', icon: 'FaFlag', highlight: true },
      { year: 2010, title: 'First 50 Selections', description: 'Crossed 50 cumulative government selections in our first two years — a foundation built entirely on results, not advertising.', icon: 'FaTrophy' },
      { year: 2013, title: 'Banking Exam Programme Launch', description: 'Added dedicated IBPS PO and SBI PO coaching batches, drawing on Sidharth\'s experience as a Branch Manager.', icon: 'FaUniversity' },
      { year: 2015, title: 'Punjab Police Coaching Added', description: 'Launched Punjab Police Constable and Sub-Inspector coaching with bilingual (Hindi + Punjabi) instruction and regional GK focus.', icon: 'FaShieldAlt' },
      { year: 2017, title: 'New Campus in Amritsar', description: 'Moved to a larger campus with dedicated computer lab for mock tests, library, and group discussion room.', icon: 'FaBuilding' },
      { year: 2018, title: '500 Selections Milestone', description: 'Reached 500 cumulative final selections across SSC, Banking, and State Government exams.', icon: 'FaCertificate' },
      { year: 2020, title: 'Hybrid Classes During Pandemic', description: 'Pivoted to hybrid delivery during COVID-19 with zero batch cancellations. Every enrolled student continued uninterrupted.', icon: 'FaLaptop' },
      { year: 2022, title: 'UGC NET & CAT Programmes', description: 'Expanded into academic and management entrance exam preparation — UGC NET for teaching careers, CAT for IIM aspirants.', icon: 'FaBookOpen' },
      { year: 2024, title: '1,200+ Selections Milestone', description: 'Crossed 1,200 cumulative selections — celebrated with our full alumni network at Samarth Academy\'s first annual gathering.', icon: 'FaStar', highlight: true },
    ],
  },

  awards: {
    eyebrow: 'ACHIEVEMENTS',
    headline: 'Awards & Recognition',
    subheadline: 'Grateful to be recognised by peers and institutions',
    items: [
      // TODO: Replace with actual awards received by Samarth Academy
      { year: 2024, title: 'Best SSC Coaching Institute — Amritsar', awardedBy: 'Punjab Education Excellence Awards', description: 'Recognised for consistent SSC CGL results and student satisfaction ratings.' },
      { year: 2023, title: 'Excellence in Government Exam Coaching', awardedBy: 'North India Education Forum', description: 'Awarded for innovative teaching methodology and verified selection track record.' },
      { year: 2022, title: 'Top 10 Coaching Institutes in Punjab', awardedBy: 'Education Today Magazine', description: "Featured in Punjab's top coaching destinations for government exam preparation." },
    ],
  },

  infrastructure: {
    eyebrow: 'OUR SPACE',
    headline: 'World-Class Learning Environment',
    subheadline: 'Every corner of our campus is designed for focused preparation',
    photos: [
      // TODO: Replace with real Cloudinary URLs after uploading photos
      { url: '/images/infra/classroom-1.jpg', caption: 'Smart Classroom', category: 'classroom', displayOrder: 1 },
      { url: '/images/infra/library.jpg', caption: 'Library & Reading Room', category: 'library', displayOrder: 2 },
      { url: '/images/infra/computer-lab.jpg', caption: 'Computer Lab — Online Mock Tests', category: 'computer-lab', displayOrder: 3 },
      { url: '/images/infra/discussion-room.jpg', caption: 'Group Discussion Room', category: 'discussion-room', displayOrder: 4 },
      { url: '/images/infra/reception.jpg', caption: 'Reception Area', category: 'reception', displayOrder: 5 },
      { url: '/images/infra/exterior.jpg', caption: 'Samarth Academy — Amritsar', category: 'exterior', displayOrder: 6 },
    ],
  },

  video: {
    enabled: false,        // Admin sets to true after uploading a founder message video
    youtubeId: '',         // e.g. "dQw4w9WgXcQ"
    title: 'Message from Our Founders',
    description: 'Hear directly from Sidharth and Deepika about why Samarth Academy exists and what drives their teaching.',
  },

  cta: {
    eyebrow: 'READY TO JOIN?',
    title: "Be Part of Amritsar's Leading Coaching Family",
    subtitle: "Whether you're targeting SSC, Banking, Punjab Police, UGC NET, or CAT — come talk to us. Free demo class, no commitment.",
  },

  seo: {
    title: 'About Samarth Academy | Founded by Ex-Government Officers | Amritsar',
    description: 'Samarth Academy — Amritsar coaching institute founded by ex-Bank Manager and ex-GST Inspector. 16+ years, 1,200+ selections. Learn our story, mission, and team.',
    keywords: 'about samarth academy amritsar, samarth academy founders, coaching institute amritsar history, government exam coaching amritsar',
    canonical: 'https://thesamarthacademy.in/about',
    ogImage: '/images/og/about.jpg', // TODO: Upload OG image and replace with Cloudinary URL
  },
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await AboutPage.findOneAndUpdate({}, aboutSeed, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log('✅ About page seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ About page seed error:', error.message);
    process.exit(1);
  }
}

seed();
