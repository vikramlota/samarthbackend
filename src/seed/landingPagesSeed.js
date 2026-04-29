'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const LandingPage = require('../models/LandingPage.model.js');

// ─── helpers ──────────────────────────────────────────────────────────────────
const faq = (q, a, order) => ({ question: q, answer: a, order });

// ─── seed data ────────────────────────────────────────────────────────────────
const seedData = [

  // ══════════════════════════════════════════════════════════════════════════════
  // 1. SSC (General) — covers CGL, CHSL, MTS, CPO
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'ssc-coaching-amritsar',
    examShortName: 'SSC',
    examFullName: 'SSC CGL / CHSL / MTS / CPO',
    active: true,
    displayOrder: 1,
    facultyTags: ['ssc', 'ssc-cgl', 'ssc-chsl', 'ssc-mts'],

    seo: {
      title: 'Best SSC Coaching in Amritsar | Samarth Academy',
      description: 'Top SSC coaching in Amritsar for CGL, CHSL, MTS & CPO. Expert faculty, 500+ selections. ₹12,000 onwards. Call +91-XXXXXXXXXX for a free demo class.',
      keywords: 'SSC coaching Amritsar, SSC CGL CHSL coaching Amritsar, best SSC institute Amritsar Punjab',
      canonical: 'https://thesamarthacademy.in/ssc-coaching-amritsar',
      ogImage: 'https://thesamarthacademy.in/og/ssc-coaching.jpg',
    },

    hero: {
      badge: '🏆 500+ SSC Selections',
      headline: 'Best SSC Coaching in',
      headlineAccent: 'Amritsar',
      subheadline: 'Complete preparation for SSC CGL, CHSL, MTS & CPO — taught by government officers who cleared these exams themselves.',
      trustPoints: [
        '16 years of proven results',
        'Officer-led teaching methodology',
        'Limited batch size — 30 students max',
        'Free demo class, no commitment',
      ],
    },

    quickInfo: {
      duration: '6–12 months (exam-wise)',
      fees: '₹12,000 – ₹18,000',
      batchSize: '30 students max',
      mode: 'Classroom (Amritsar)',
    },

    overview: {
      paragraphs: [
        'Staff Selection Commission (SSC) conducts some of the most sought-after central government exams in India — CGL for graduate-level officer posts, CHSL for 10+2-level posts, MTS for multitasking roles, and CPO for Central Police Organisations. Combined, these exams offer tens of thousands of vacancies every year across departments like Income Tax, CBI, CISF, Border Security Force, and more.',
        'At Samarth Academy, our SSC programme is built around a single idea: teach what actually gets you selected. Our founding faculty — Sidharth Sir (ex-Bank Manager, State topper) and Deepika Ma\'am (ex-GST Inspector, cleared SSC CGL) — design every class from the perspective of someone who has sat the exam and cleared it.',
        'We cover all four major SSC exams under one roof with a structured timetable, weekly mocks, and individual doubt sessions. Whether you are a fresh graduate targeting CGL or a 10+2 pass targeting CHSL/MTS, we have the right batch for you.',
      ],
      examStats: [
        { iconName: 'FaBriefcase', label: 'Vacancies/Year', value: '30,000+' },       // TODO: VERIFY aggregate across CGL+CHSL+MTS+CPO
        { iconName: 'FaRupeeSign', label: 'Starting Salary', value: '₹19,900+' },
        { iconName: 'FaGraduationCap', label: 'Min. Eligibility', value: '10th / 12th / Graduation' },
        { iconName: 'FaCalendar', label: 'Exam Frequency', value: 'Yearly (Multiple)' },
      ],
    },

    whyChoose: [
      { iconName: 'FaUserTie', title: 'Taught by Officers', description: 'Our core faculty cleared SSC CGL and other government exams — they teach from experience, not just books.', iconBg: 'red' },
      { iconName: 'FaChartLine', title: 'Tier-Wise Strategy', description: 'Separate strategy sessions for Tier 1 (CBT), Tier 2 (Advanced), and Tier 3 (Descriptive) — most institutes ignore Tier 3 completely.', iconBg: 'orange' },
      { iconName: 'FaClipboardList', title: '200+ Topic-Wise Tests', description: 'Granular testing by chapter so weak topics are caught early. All tests analysed in class the next session.', iconBg: 'red' },
      { iconName: 'FaUsers', title: 'Small Batch Advantage', description: 'Maximum 30 students per batch ensures every student gets noticed. Name-basis tracking of every student\'s progress.', iconBg: 'orange' },
      { iconName: 'FaBook', title: 'Printed Study Material', description: 'In-house printed notes, previous year solved papers (10 years), and exam-specific formula sheets included in fee.', iconBg: 'red' },
      { iconName: 'FaHeadset', title: 'Doubt Sessions Daily', description: 'Dedicated 1-hour doubt session after every class. WhatsApp group for quick queries — faculty responds within 24 hours.', iconBg: 'orange' },
    ],

    courseDetails: {
      inclusions: [
        'Complete Quantitative Aptitude (Tier 1 + Tier 2 level)',
        'English Language — Grammar, RC, Vocabulary, Writing',
        'General Intelligence & Reasoning (all question types)',
        'General Awareness — Current Affairs + Static GK',
        'Tier 3 Descriptive Writing — Essay, Letter, Precis',
        'Computer Proficiency basics (for CPT/DEST)',
        'Printed notes for every subject (updated yearly)',
        '10 years of previous year papers — solved in class',
        '2 full-length mock exams per week + analysis session',
        'Interview / Skill Test preparation guidance',
        'One-on-one mentorship sessions on request',
        'WhatsApp support group with faculty',
      ],
      fees: {
        original: 18000,
        discounted: 15000,
        currency: '₹',
        emiAvailable: true,
        emiNote: 'Pay ₹7,500 now + ₹7,500 after 3 months. No interest.',
      },
    },

    syllabus: {
      subjects: [
        {
          name: 'Quantitative Aptitude',
          topics: ['Number System', 'Simplification & Approximation', 'Percentage', 'Profit & Loss', 'Ratio & Proportion', 'Time, Work & Distance', 'Algebra & Geometry', 'Trigonometry', 'Data Interpretation', 'Advanced Maths (Tier 2)'],
        },
        {
          name: 'English Language',
          topics: ['Sentence Correction', 'Fill in the Blanks', 'Reading Comprehension', 'Cloze Test', 'Para Jumbles', 'Vocabulary (Synonyms/Antonyms/Idioms)', 'One-Word Substitution', 'Descriptive Essay Writing', 'Formal Letter & Application Writing'],
        },
        {
          name: 'General Intelligence & Reasoning',
          topics: ['Analogy', 'Series (Number/Verbal)', 'Classification', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Syllogism', 'Matrix & Venn Diagrams', 'Paper Folding / Cutting', 'Non-Verbal Reasoning'],
        },
        {
          name: 'General Awareness',
          topics: ['Indian History & Culture', 'Indian Polity & Constitution', 'Indian Economy', 'Geography (India + World)', 'Science (Physics, Chemistry, Biology)', 'Current Affairs (Monthly)', 'Static GK — Sports, Awards, Books'],
        },
        {
          name: 'Statistics & Economics (Tier 2 — JSO/AAO)',  // TODO: VERIFY paper code changes
          topics: ['Data Collection & Classification', 'Measures of Central Tendency', 'Dispersion & Skewness', 'Correlation & Regression', 'Time Series & Index Numbers', 'Sampling Theory', 'Indian Economics Basics'],
        },
      ],
    },

    faqs: [
      faq('Which SSC exams does this course cover?', 'This programme covers SSC CGL, SSC CHSL, SSC MTS, and SSC CPO. The core syllabus is common; exam-specific modules are added in separate sessions.', 0),
      faq('What is the minimum qualification to join?', 'It depends on the exam you are targeting. SSC MTS and CHSL require 10th/12th pass; SSC CGL and CPO require a graduation degree. We enrol students from all these backgrounds.', 1),
      faq('How many classes per week?', 'Typically 5–6 days a week, 2–3 hours per day. Exact schedule depends on the batch you join. Morning and evening batches are available.', 2),
      faq('Is there a demo/trial class?', 'Yes — we offer one free demo class before enrolment. Call or WhatsApp us to book a slot. No registration or fee required for the demo.', 3),
      faq('Can I join if SSC notification has not come yet?', 'Absolutely. Starting early gives you 6–12 months to build a strong foundation. Most of our successful students begin preparing 8–10 months before the exam.', 4),
      faq('What happens if I miss a class?', 'We maintain a student WhatsApp group where notes and class summaries are shared daily. You can also attend the same topic in another batch with prior permission.', 5),
      faq('Do you provide study material?', 'Yes — printed subject-wise notes, formula sheets, and 10 years of previous year papers are included in the course fee. No separate material cost.', 6),
      faq('Is the fee refundable?', 'We do not offer refunds, but if you are unable to continue due to genuine reasons, we allow a batch transfer to the next session at no extra cost.', 7),
      faq('How is progress tracked?', 'Weekly topic tests, fortnightly mock exams, and monthly parent/student review sessions. Every student\'s test scores are tracked individually.', 8),
      faq('Is online coaching available?', 'Currently we operate classroom-only batches in Amritsar. We plan to launch online/hybrid batches — call us to get notified when they are available.', 9),
    ],

    midCta: {
      eyebrow: '🔥 Batch Filling Fast',
      title: 'Only 30 Seats Per Batch — Book Yours Today',
      description: 'Join the coaching centre trusted by 500+ SSC selections in Amritsar. Free demo class — no commitment needed.',
      trustPoints: ['Free demo class', 'EMI available', 'Officer-taught faculty'],
    },

    finalCta: {
      eyebrow: 'Your government job is one decision away',
      title: 'Start Your SSC Preparation Today',
      subtitle: 'Call us, WhatsApp us, or walk into our centre in Amritsar. We\'ll match you to the right batch.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 2. Banking (General) — IBPS PO, SBI PO, IBPS Clerk, RBI Grade B
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'bank-coaching-amritsar',
    examShortName: 'Banking',
    examFullName: 'IBPS PO / SBI PO / IBPS Clerk / RBI Grade B',
    active: true,
    displayOrder: 2,
    facultyTags: ['banking', 'ibps-po', 'sbi-po', 'ibps-clerk'],

    seo: {
      title: 'Best Bank Coaching in Amritsar | Samarth Academy',
      description: 'Top banking coaching in Amritsar for IBPS PO, SBI PO, IBPS Clerk & RBI Grade B. Taught by ex-Bank Manager. 400+ bank selections. Call +91-XXXXXXXXXX.',
      keywords: 'bank coaching Amritsar, IBPS PO coaching Amritsar, SBI PO coaching Amritsar, banking institute Punjab',
      canonical: 'https://thesamarthacademy.in/bank-coaching-amritsar',
      ogImage: 'https://thesamarthacademy.in/og/bank-coaching.jpg',
    },

    hero: {
      badge: '🏦 400+ Bank Selections',
      headline: 'Best Bank Coaching in',
      headlineAccent: 'Amritsar',
      subheadline: 'Crack IBPS PO, SBI PO, IBPS Clerk & RBI Grade B — taught by Sidharth Sir, an ex-Bank Manager who has been on the other side of the interview table.',
      trustPoints: [
        'Taught by a real ex-Bank Manager',
        'Mock interview preparation included',
        'GK & Current Affairs updates daily',
        '400+ bank selections since 2008',
      ],
    },

    quickInfo: {
      duration: '6–9 months',
      fees: '₹14,000 – ₹20,000',
      batchSize: '30 students max',
      mode: 'Classroom (Amritsar)',
    },

    overview: {
      paragraphs: [
        'The banking sector remains one of the most desirable career destinations for graduates in India — combining job security, attractive salary packages, housing allowances, and a defined career ladder. IBPS (Institute of Banking Personnel Selection) alone recruits for 11 public sector banks through its PO, Clerk, SO, and RRB exams every year.',
        'What makes bank exams unique is the interview stage. At Samarth Academy, our head faculty Sidharth Sir spent years as a Bank Manager and has sat on recruitment interview panels. He teaches students not just the written exam but also how to present themselves confidently at the interview — a differentiator no other coaching institute in Amritsar can offer.',
        'Our banking batch covers all major bank exams under a single, cohesive programme. The core syllabus (Reasoning, Quant, English) is common to all; bank-specific modules (Financial Awareness for SBI, Economic Policy for RBI Grade B) are taught as add-ons.',
      ],
      examStats: [
        { iconName: 'FaUniversity', label: 'Banks Recruiting', value: '20+ Banks' },
        { iconName: 'FaRupeeSign', label: 'PO Starting Salary', value: '₹36,000+/mo' },  // TODO: VERIFY including allowances
        { iconName: 'FaCalendar', label: 'Exams Per Year', value: '5–6 Cycles' },
        { iconName: 'FaGraduationCap', label: 'Min. Eligibility', value: 'Any Graduate' },
      ],
    },

    whyChoose: [
      { iconName: 'FaUserTie', title: 'Taught by Ex-Bank Manager', description: 'Sidharth Sir worked as a Branch Manager before founding Samarth Academy. He knows exactly what banks look for — in the written exam and in the interview room.', iconBg: 'red' },
      { iconName: 'FaMicrophone', title: 'Mock Interview Practice', description: 'Full mock interview sessions with feedback — dress code, body language, banking GK, HR questions. Most students say these sessions changed their confidence entirely.', iconBg: 'orange' },
      { iconName: 'FaNewspaper', title: 'Daily Banking Current Affairs', description: 'RBI policy updates, banking news, financial awareness — delivered as a 15-minute daily capsule. Keeps your GK section interview-ready at all times.', iconBg: 'red' },
      { iconName: 'FaChartBar', title: 'Sectional Cut-off Strategy', description: 'Bank exams have sectional as well as overall cut-offs. We teach time management section-by-section so you never get eliminated on a single weak subject.', iconBg: 'orange' },
      { iconName: 'FaFileAlt', title: 'Descriptive Writing (Mains)', description: 'The SBI PO and IBPS PO Mains include a descriptive paper. We conduct dedicated essay and letter writing sessions with model answers and peer review.', iconBg: 'red' },
      { iconName: 'FaTrophy', title: 'Proven Track Record', description: '400+ banking selections since 2008. Multiple students selected in SBI PO, IBPS PO, and RBI Grade B in the same year.', iconBg: 'orange' },
    ],

    courseDetails: {
      inclusions: [
        'Quantitative Aptitude — Arithmetic, DI, Caselet DI',
        'Reasoning — Puzzles, Seating, Coding, Machine Input/Output',
        'English — RC, Error Detection, Fill-in-the-Blanks, Descriptive',
        'General/Financial Awareness — Banking + Economy + Static GK',
        'Computer Knowledge basics',
        'SBI PO-specific: Economic Policy, Financial Markets',
        'RBI Grade B-specific: Economic & Social Issues, Finance & Management',
        'Mock Interview sessions (2 rounds per student)',
        'Printed notes + 10-year previous papers + formula booklets',
        '3 full-length mock exams per week + detailed analysis',
        'Sectional time-management workshops',
        'Personalised feedback after every mock exam',
      ],
      fees: {
        original: 20000,
        discounted: 17000,
        currency: '₹',
        emiAvailable: true,
        emiNote: '₹9,000 at enrolment + ₹8,000 after 3 months. Zero interest.',
      },
    },

    syllabus: {
      subjects: [
        {
          name: 'Quantitative Aptitude',
          topics: ['Number Series', 'Simplification / Approximation', 'Percentage & Profit/Loss', 'Ratio, Proportion & Averages', 'Time & Work, Speed & Distance', 'Data Interpretation (Bar, Line, Pie, Caselet)', 'Quadratic Equations', 'Inequalities', 'Probability'],
        },
        {
          name: 'Reasoning Ability',
          topics: ['Puzzles & Seating Arrangements', 'Syllogism', 'Inequalities', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Machine Input/Output', 'Data Sufficiency', 'Alphanumeric Series'],
        },
        {
          name: 'English Language',
          topics: ['Reading Comprehension', 'Cloze Test', 'Error Detection & Correction', 'Fill in the Blanks (Double)', 'Para Jumbles', 'Sentence Improvement', 'Word Usage / Vocabulary', 'Essay Writing (Descriptive)', 'Letter Writing (Formal/Informal)'],
        },
        {
          name: 'General / Financial Awareness',
          topics: ['Banking History & Structure in India', 'RBI Functions & Monetary Policy', 'Financial Institutions (SEBI, NABARD, SIDBI)', 'Union Budget Highlights', 'Current Affairs (Monthly)', 'Static GK — International Orgs, Awards, Sports', 'Economic Terminology', 'Government Schemes'],
        },
        {
          name: 'Computer Knowledge',
          topics: ['Basics of Computer & Operating Systems', 'MS Office (Word, Excel, PowerPoint)', 'Internet & Networking Concepts', 'Input/Output Devices', 'Database Basics', 'Cybersecurity Awareness'],
        },
      ],
    },

    faqs: [
      faq('Does this course cover SBI PO separately?', 'Yes. The core module covers all bank exams. SBI PO-specific topics (Economic Policy, descriptive paper, GD) are covered in dedicated add-on sessions at no extra cost.', 0),
      faq('I am a commerce graduate. Is the course suitable for me?', 'Absolutely — in fact, commerce graduates have an advantage in the financial awareness section. The course is designed for all stream graduates.', 1),
      faq('Are mock interviews included in the fee?', 'Yes. Two rounds of mock interview practice are included for every enrolled student. Additional rounds can be arranged on request.', 2),
      faq('How often are full mock tests conducted?', 'Three full-length computer-based mock exams per week, timed and in exam conditions. Results are analysed in the next class with individual feedback.', 3),
      faq('What if I only want to prepare for IBPS Clerk, not PO?', 'We have a separate Clerk-focused batch with a lighter syllabus focus (no descriptive, lower Quant level). Fees are ₹12,000. Ask us about batch schedules.', 4),
      faq('Is RBI Grade B covered?', 'Phase 1 is covered in the standard batch. Phase 2 (ESI, Finance & Management) is offered as a separate top-up module for students targeting RBI Grade B.', 5),
      faq('What is the batch size?', 'We cap every batch at 30 students. This ensures every student gets direct attention from the teacher — not lost in a crowd of 100.', 6),
      faq('Is there a morning batch available?', 'Yes — morning (8:00 AM) and evening (5:30 PM) batches are available. Timings may vary per session. Call or WhatsApp to confirm current schedules.', 7),
      faq('Do you guarantee selection?', 'No ethical coaching institute can guarantee results — too many variables depend on the student. What we guarantee is quality teaching, structured preparation, and honest feedback.', 8),
    ],

    midCta: {
      eyebrow: '📅 New Batch Starting Soon',
      title: 'Join the Institute Behind 400+ Bank Selections',
      description: 'Learn from a real ex-Bank Manager. Free demo class available — no registration needed.',
      trustPoints: ['Ex-Bank Manager faculty', 'Mock interview included', 'Small batch — 30 students max'],
    },

    finalCta: {
      eyebrow: 'Your banking career starts with one right step',
      title: 'Take a Free Demo Class — Today',
      subtitle: 'Walk in or call us. We\'ll show you exactly what cleared these exams looks like.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 3. Punjab Police
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'punjab-police-coaching-amritsar',
    examShortName: 'Punjab Police',
    examFullName: 'Punjab Police Constable & Sub-Inspector',
    active: true,
    displayOrder: 3,
    facultyTags: ['punjab-police', 'state'],

    seo: {
      title: 'Punjab Police Coaching in Amritsar | Samarth Academy',
      description: 'Best Punjab Police Constable & SI coaching in Amritsar. Written + Physical preparation. State experts. Call +91-XXXXXXXXXX for free demo class today.',
      keywords: 'Punjab Police coaching Amritsar, Punjab Police SI coaching, constable coaching Amritsar Punjab',
      canonical: 'https://thesamarthacademy.in/punjab-police-coaching-amritsar',
      ogImage: 'https://thesamarthacademy.in/og/punjab-police-coaching.jpg',
    },

    hero: {
      badge: '👮 Punjab Police Specialists',
      headline: 'Punjab Police Coaching in',
      headlineAccent: 'Amritsar',
      subheadline: 'Complete preparation for Punjab Police Constable and Sub-Inspector exams — written test strategy, current affairs, and physical test guidance under one roof.',
      trustPoints: [
        'State-specific GK & Punjabi current affairs',
        'Written + Physical test guidance',
        'Punjab-native faculty who know the pattern',
        'Batch starting every 2 months',
      ],
    },

    quickInfo: {
      duration: '4–6 months',
      fees: '₹10,000 – ₹14,000',
      batchSize: '30 students max',
      mode: 'Classroom (Amritsar)',
    },

    overview: {
      paragraphs: [
        'Punjab Police recruitment is one of the most competitive state-level exams in North India, drawing lakhs of applications for a few thousand vacancies each cycle. The selection process tests candidates on written ability, physical fitness, and personality — making it essential to prepare all three aspects simultaneously.',
        'At Samarth Academy, our Punjab Police batch is designed specifically for candidates from Punjab. We focus on Punjab-specific General Knowledge (history, geography, culture, current events), the Punjabi language paper, and the written exam pattern as notified by Punjab Police Recruitment Board (PPHRB).',
        'Our faculty understand the physical test requirements for both Constable and Sub-Inspector posts and provide guidance on the running, long jump, and high jump standards — though the physical preparation itself is done by students at their own fitness level.',
      ],
      examStats: [
        { iconName: 'FaShieldAlt', label: 'Posts Available', value: 'Constable + SI' },   // TODO: VERIFY vacancy numbers per notification
        { iconName: 'FaRupeeSign', label: 'SI Salary', value: '₹35,400+/mo' },             // TODO: VERIFY pay level
        { iconName: 'FaGraduationCap', label: 'Constable Eligibility', value: '10+2 Pass' },
        { iconName: 'FaCalendar', label: 'Exam Frequency', value: 'As per PPHRB notification' },
      ],
    },

    whyChoose: [
      { iconName: 'FaMapMarkerAlt', title: 'Punjab-Specific Content', description: 'Dedicated modules on Punjab history, geography, rivers, Chief Ministers, and current events — content that\'s directly tested and often ignored by general-purpose institutes.', iconBg: 'red' },
      { iconName: 'FaLanguage', title: 'Punjabi Language Module', description: 'The Punjab Police written exam includes a Punjabi comprehension and grammar section. We cover this thoroughly with practice papers.', iconBg: 'orange' },
      { iconName: 'FaClipboardCheck', title: 'Exact Exam Pattern Focus', description: 'We teach exactly to the PPHRB notification syllabus — no wasted time on topics that are never tested. Pattern updated every notification cycle.', iconBg: 'red' },
      { iconName: 'FaRunning', title: 'Physical Test Guidance', description: 'We brief students on the physical test standards (running distance/time, jumps) for both male and female candidates, and suggest preparation routines.', iconBg: 'orange' },
      { iconName: 'FaNewspaper', title: 'Current Affairs (Punjab Focus)', description: 'Daily 15-minute current affairs session focused on Punjab government schemes, appointments, and events — high-weightage in the GK section.', iconBg: 'red' },
      { iconName: 'FaUsers', title: 'Peer Learning Environment', description: 'Studying alongside other Amritsar and Punjab-region students creates a competitive, peer-driven environment that accelerates preparation.', iconBg: 'orange' },
    ],

    courseDetails: {
      inclusions: [
        'General Knowledge — National + Punjab-specific',
        'Punjabi Language — Comprehension, Grammar, Translation',
        'English Language — Basic Grammar and Comprehension',
        'Mathematics — Class 10 level Arithmetic',
        'Reasoning — Logical and Non-Verbal',
        'Current Affairs (Monthly — Punjab + National)',
        'Punjab History, Culture & Geography module',
        'Previous year papers (all available years) solved in class',
        'Physical test briefing — standards, preparation approach',
        'Full-length mock exams (written) + analysis',
        'Printed notes + formula sheets for all subjects',
      ],
      fees: {
        original: 14000,
        discounted: 12000,
        currency: '₹',
        emiAvailable: true,
        emiNote: '₹6,000 at enrolment + ₹6,000 after 2 months.',
      },
    },

    syllabus: {
      subjects: [
        {
          name: 'General Knowledge',
          topics: ['Indian History & Freedom Movement', 'Indian Polity & Constitution', 'Punjab History (Sikh Heritage, Partition)', 'Punjab Geography (Rivers, Districts, Borders)', 'Indian & Punjab Economy', 'Science & Technology Basics', 'Important Days & Events', 'Sports (National + Punjab)'],
        },
        {
          name: 'Punjabi Language',
          topics: ['Gurmukhi Script Reading & Writing', 'Grammar (ਕਿਰਿਆ, ਵਿਸ਼ੇਸ਼ਣ, ਸਰਵਨਾਂਵ)', 'Passage Comprehension', 'Sentence Correction', 'Translation (English to Punjabi)', 'Vocabulary (Common Words)', 'Proverbs & Sayings'],
        },
        {
          name: 'English Language',
          topics: ['Comprehension Passages', 'Fill in the Blanks', 'Sentence Correction', 'Basic Grammar (Tenses, Articles, Prepositions)', 'Antonyms & Synonyms', 'One-Word Substitution'],
        },
        {
          name: 'Mathematics',
          topics: ['Number System', 'HCF & LCM', 'Percentage', 'Simple & Compound Interest', 'Ratio & Proportion', 'Time & Work', 'Time, Speed & Distance', 'Basic Geometry & Mensuration'],
        },
        {
          name: 'Reasoning',
          topics: ['Series (Number & Letter)', 'Analogy', 'Classification', 'Coding-Decoding', 'Direction Sense', 'Blood Relations', 'Logical Venn Diagrams', 'Non-Verbal Patterns'],
        },
      ],
    },

    faqs: [
      faq('Does this course cover both Constable and SI posts?', 'Yes. The core module covers both. SI has a slightly higher difficulty level in Maths and English, which we address in dedicated sessions.', 0),
      faq('Do I need to know Punjabi to join?', 'Basic Gurmukhi reading is helpful. We cover Punjabi language from fundamentals in our course, so beginners are welcome.', 1),
      faq('What are the physical test standards for Constable?', 'For male: 1600m run in 6 min 30 sec, long jump 11 ft, high jump 3 ft 9 inches. For female: 800m run in 4 min 30 sec. Standards may change per notification — always verify from the official PPHRB notification.', 2), // TODO: VERIFY exact standards
      faq('When is the next batch starting?', 'New batches start every 2 months. WhatsApp or call us to find out the next available date and time slot.', 3),
      faq('Is there a separate batch for SI only?', 'Currently SI and Constable candidates study together with subject-level differentiation. A separate SI-only batch is planned — ask us when it\'s available.', 4),
      faq('Do you provide previous year question papers?', 'Yes — all available previous year papers are included in the course material and are solved in class, section by section.', 5),
      faq('What if the exam notification gets delayed?', 'Preparation never goes to waste. If the notification is delayed, we extend your batch access at no extra charge until the exam is held.', 6),
      faq('Is the medium of instruction Hindi or English?', 'Classes are conducted in Hindi and Punjabi (bilingual). English terminology is explained in both languages. No language barrier.', 7),
    ],

    midCta: {
      eyebrow: '📋 Punjab Police Batch Open',
      title: 'Join Amritsar\'s Most Focused Punjab Police Coaching',
      description: 'Written exam + Punjab GK + Punjabi language — all covered. Free demo class available.',
      trustPoints: ['Punjab-specific curriculum', 'Bilingual instruction', 'Physical test briefing included'],
    },

    finalCta: {
      eyebrow: 'Serve Punjab with pride',
      title: 'Start Your Punjab Police Preparation Today',
      subtitle: 'Call us or walk into our Amritsar centre. New batch forming now.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 4. SSC CGL (specific)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'ssc-cgl-coaching-amritsar',
    examShortName: 'SSC CGL',
    examFullName: 'SSC CGL (Combined Graduate Level)',
    active: true,
    displayOrder: 4,
    facultyTags: ['ssc', 'ssc-cgl'],

    seo: {
      title: 'Best SSC CGL Coaching in Amritsar | Samarth Academy',
      description: 'Top SSC CGL coaching in Amritsar. 4-tier exam strategy, Tier 3 descriptive, officer-led teaching. ₹15,000, 9 months. 90+ CGL selections. Call +91-XXXXXXXXXX.',
      keywords: 'SSC CGL coaching Amritsar, SSC CGL preparation Amritsar, best SSC CGL institute Punjab',
      canonical: 'https://thesamarthacademy.in/ssc-cgl-coaching-amritsar',
      ogImage: 'https://thesamarthacademy.in/og/ssc-cgl-coaching.jpg',
    },

    hero: {
      badge: '🎯 90+ CGL Selections',
      headline: 'Best SSC CGL Coaching in',
      headlineAccent: 'Amritsar',
      subheadline: 'Complete 4-tier SSC CGL preparation — from Tier 1 basics to Tier 3 descriptive writing — taught by Deepika Ma\'am, an ex-GST Inspector who cleared SSC CGL herself.',
      trustPoints: [
        'Taught by an actual SSC CGL selectee',
        'All 4 tiers covered — including Tier 3 writing',
        '9-month structured programme',
        'Free demo class, join any Monday',
      ],
    },

    quickInfo: {
      duration: '9 months',
      fees: '₹15,000',
      batchSize: '30 students max',
      mode: 'Classroom (Amritsar)',
    },

    overview: {
      paragraphs: [
        'SSC CGL (Combined Graduate Level) is India\'s premier central government exam for graduate-level posts across departments like Income Tax, CBI, Audit & Accounts, Excise, Narcotics, and more. The exam is conducted in four tiers, testing candidates on quantitative ability, English, reasoning, general knowledge, and from Tier 2 onwards, advanced mathematics, statistics, and subject-specific knowledge.',
        'What most coaching institutes get wrong is Tier 3 — the descriptive paper worth 100 marks. Most centres focus only on Tiers 1 and 2, leaving students unprepared for essay and letter writing. At Samarth Academy, Tier 3 is treated as a full subject with dedicated weekly writing practice and model answers.',
        'Our head faculty, Deepika Ma\'am, cleared SSC CGL and served as a GST Inspector before transitioning to teaching. She brings not just subject knowledge but lived experience of what the exam demands — and what cleared candidates look like at each stage.',
      ],
      examStats: [
        { iconName: 'FaBriefcase', label: 'Vacancies/Year', value: '~10,000+' },   // TODO: VERIFY exact notification count
        { iconName: 'FaRupeeSign', label: 'Inspector Salary', value: '₹44,900+/mo' }, // TODO: VERIFY pay level 7 + DA
        { iconName: 'FaGraduationCap', label: 'Eligibility', value: 'Any Graduate' },
        { iconName: 'FaLayerGroup', label: 'Exam Tiers', value: '4 Tiers' },
      ],
    },

    whyChoose: [
      { iconName: 'FaUserGraduate', title: 'Ex-CGL Selectee Teaches You', description: 'Deepika Ma\'am cleared SSC CGL and worked as a GST Inspector. She teaches strategy from personal experience — not from a textbook.', iconBg: 'red' },
      { iconName: 'FaPencilAlt', title: 'Tier 3 Descriptive — Fully Covered', description: 'Weekly essay and letter writing practice with model answers. Peer review sessions. Most students credit Tier 3 preparation as their biggest edge.', iconBg: 'orange' },
      { iconName: 'FaCalculator', title: 'Tier 2 Advanced Maths', description: 'Dedicated Tier 2 module covering Statistics, Algebra, Trigonometry, and Data Interpretation at the higher difficulty level required for post-specific paper clearing.', iconBg: 'red' },
      { iconName: 'FaClipboardList', title: 'Post-Wise Guidance', description: 'Different CGL posts have different paper requirements. We guide you on which Paper to attempt based on your target post — Inspector, ASO, DEO, or AAO.', iconBg: 'orange' },
      { iconName: 'FaChartLine', title: 'Weekly Mock Exam + Analysis', description: 'Two mock exams per week timed to exact exam conditions. Individual performance charts shared after every mock. Rank within batch tracked.', iconBg: 'red' },
      { iconName: 'FaCalendarCheck', title: '9-Month Structured Timeline', description: 'Month-by-month syllabus plan from Day 1 to exam day. Never feel lost or unsure what to study next — the plan does the thinking for you.', iconBg: 'orange' },
    ],

    courseDetails: {
      inclusions: [
        'Tier 1: Quantitative Aptitude, English, Reasoning, GK (complete)',
        'Tier 2: Advanced Maths (Paper 1), English Language & Comprehension (Paper 2)',
        'Tier 2: Statistics (Paper 3 — for JSO aspirants)',
        'Tier 2: General Studies — Finance & Economics (Paper 4 — for AAO)',
        'Tier 3: Essay Writing — 8 practice essays with model answers',
        'Tier 3: Letter/Application/Precis Writing',
        'Tier 4: DEST/CPT familiarisation sessions',
        'Previous 10 years of CGL papers — Tier 1 + Tier 2 — solved in class',
        'Printed subject-wise notes + formula booklets',
        '2 full-length Tier 1 mocks + 1 Tier 2 mock per week',
        'Post-wise paper selection guidance session',
        'WhatsApp group — daily current affairs + doubt support',
      ],
      fees: {
        original: 18000,
        discounted: 15000,
        currency: '₹',
        emiAvailable: true,
        emiNote: 'Two instalments: ₹8,000 at enrolment + ₹7,000 after 3 months. Zero interest.',
      },
    },

    syllabus: {
      subjects: [
        {
          name: 'Tier 1 — Quantitative Aptitude',
          topics: ['Number System & HCF/LCM', 'Percentage & Average', 'Profit, Loss & Discount', 'Simple & Compound Interest', 'Ratio, Proportion & Partnership', 'Time & Work, Pipes & Cisterns', 'Time, Speed & Distance', 'Geometry & Mensuration', 'Trigonometry', 'Data Interpretation'],
        },
        {
          name: 'Tier 1 — English Language',
          topics: ['Reading Comprehension', 'Cloze Test', 'Fill in the Blanks', 'Error Spotting', 'Sentence Improvement', 'Para Jumbles', 'Active & Passive Voice', 'Direct & Indirect Speech', 'Vocabulary (Synonyms, Antonyms, Idioms, One-Word Sub)'],
        },
        {
          name: 'Tier 1 — General Intelligence & Reasoning',
          topics: ['Analogy', 'Classification', 'Series (Number & Alphabet)', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Syllogism', 'Non-Verbal (Figures, Mirrors, Paper Folding)', 'Embedded Figures', 'Matrix & Word Formation'],
        },
        {
          name: 'Tier 1 — General Awareness',
          topics: ['Indian History', 'Geography', 'Polity & Constitution', 'Indian Economy', 'Physics, Chemistry & Biology Basics', 'Computer Awareness', 'Current Affairs (6 months rolling)', 'Static GK — Awards, Sports, Books, Persons'],
        },
        {
          name: 'Tier 2 — Advanced Mathematics',
          topics: ['Algebra (Advanced)', 'Geometry & Coordinate Geometry', 'Trigonometry (All Identities)', 'Mensuration (2D & 3D)', 'Statistics (Mean, Median, Mode, SD)', 'Data Interpretation (Advanced Caselet & Table)', 'Percentage/Profit (Higher Difficulty)'],
        },
        {
          name: 'Tier 3 — Descriptive Writing',
          topics: ['Essay Writing (Social, Economic, Current Topics)', 'Formal Letter (Government, Complaint, Appreciation)', 'Application Writing', 'Precis Writing', 'Report Writing', 'Paragraph Writing', 'Common Errors & Editing'],
        },
      ],
    },

    faqs: [
      faq('How long does CGL preparation take?', 'Our 9-month programme is designed to take a beginner to exam-ready. If you already have a base, 6 months may be sufficient. We assess and advise on your first visit.', 0),
      faq('Is Tier 3 really important? Most institutes skip it.', 'Tier 3 is worth 100 marks and is purely qualifying — but a poor score can drop your overall rank significantly. We treat it as a full subject. This is a major differentiator of our coaching.', 1),
      faq('Which posts can I target with SSC CGL?', 'Posts include: Income Tax Inspector (ITI), Central Excise Inspector, Assistant Section Officer (CSS, MEA), Sub-Inspector (CBI, NIA, CISF), Auditor, Accountant, Junior Statistical Officer, and more — based on your Tier 2 paper selection and score.', 2),
      faq('Do I need to choose a specific post before preparing?', 'You should shortlist 2–3 target posts early — they determine which Tier 2 papers you attempt. We guide you through this in the first week of class.', 3),
      faq('What is the age limit for SSC CGL?', 'General: 18–32 years. OBC: 18–35 years. SC/ST: 18–37 years. Ex-Serviceman: as per rules. Age limit may vary slightly by post — verify from the current notification.', 4), // TODO: VERIFY exact post-wise age limits
      faq('Is there negative marking?', 'Yes — 0.50 marks deducted per wrong answer in Tier 1 MCQ. Tier 2 also has negative marking. We teach guessing strategy to handle borderline questions.', 5),
      faq('How many attempts are allowed?', 'There is no attempt limit for SSC CGL — only the age limit applies. You can attempt every year until you cross the age bar.', 6),
      faq('Can working professionals join?', 'Yes — we have an evening batch (5:30 PM – 8:30 PM) that working professionals prefer. Weekend doubt sessions are also available.', 7),
      faq('Is the study material provided?', 'Yes — comprehensive printed notes for all Tier 1 subjects and Tier 2 Maths/English, Tier 3 model answers, and 10 years of previous year papers are all included in the fee.', 8),
    ],

    midCta: {
      eyebrow: '⏳ Limited Seats Available',
      title: 'Join the CGL Batch That Produced 90+ Selections',
      description: 'Tier 1 to Tier 3 — all covered. Taught by an actual CGL selectee. Free demo every Monday.',
      trustPoints: ['All 4 tiers covered', 'Taught by ex-GST Inspector', 'EMI option available'],
    },

    finalCta: {
      eyebrow: 'Your CGL selection story starts here',
      title: 'Book Your Free Demo Class Today',
      subtitle: 'Join any Monday — no registration needed. See for yourself why 90+ students chose this path.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 5. IBPS PO (specific)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'ibps-po-coaching-amritsar',
    examShortName: 'IBPS PO',
    examFullName: 'IBPS PO (Probationary Officer)',
    active: true,
    displayOrder: 5,
    facultyTags: ['banking', 'ibps-po'],

    seo: {
      title: 'Best IBPS PO Coaching in Amritsar | Samarth Academy',
      description: 'Top IBPS PO coaching in Amritsar. All 3 stages covered — Prelims, Mains & Interview. Ex-Bank Manager faculty. ₹15,000. 100+ PO selections. Call +91-XXXXXXXXXX.',
      keywords: 'IBPS PO coaching Amritsar, IBPS PO preparation Amritsar, bank PO coaching Amritsar Punjab',
      canonical: 'https://thesamarthacademy.in/ibps-po-coaching-amritsar',
      ogImage: 'https://thesamarthacademy.in/og/ibps-po-coaching.jpg',
    },

    hero: {
      badge: '🏦 100+ PO Selections',
      headline: 'Best IBPS PO Coaching in',
      headlineAccent: 'Amritsar',
      subheadline: 'All three IBPS PO stages — Prelims, Mains, and the Personal Interview — taught by Sidharth Sir, an ex-Bank Manager who has recruited POs himself.',
      trustPoints: [
        'Taught by an ex-Bank Manager & recruiter',
        'Prelims + Mains + Interview — all 3 stages',
        'Mock interview with real feedback',
        '100+ IBPS PO selections since 2010',
      ],
    },

    quickInfo: {
      duration: '7 months',
      fees: '₹15,000',
      batchSize: '30 students max',
      mode: 'Classroom (Amritsar)',
    },

    overview: {
      paragraphs: [
        'IBPS PO is conducted by the Institute of Banking Personnel Selection to recruit Probationary Officers across 11 nationalised banks in India including Punjab National Bank, Bank of Baroda, Canara Bank, and Union Bank. The exam is held annually in three stages: Prelims (October), Mains (November), and Interview (January–February).',
        'The PO post is a prestigious entry-level officer grade with a clear promotion path to Branch Manager, Zonal Manager, and beyond. Starting compensation is approximately ₹36,000–52,000 per month including allowances, with a full package that includes HRA, DA, medical insurance, and annual increments.',
        'At Samarth Academy, our IBPS PO batch is considered our flagship banking programme. Sidharth Sir — who worked as a Branch Manager and participated in recruitment panels — teaches students exactly what banks look for in a PO candidate: analytical thinking, communication confidence, and banking knowledge. The mock interview round is modelled on the actual IBPS interview format.',
      ],
      examStats: [
        { iconName: 'FaUniversity', label: 'Banks Recruiting', value: '11 Public Banks' },
        { iconName: 'FaBriefcase', label: 'Vacancies/Year', value: '~4,000+' },    // TODO: VERIFY per IBPS CRP PO notification
        { iconName: 'FaRupeeSign', label: 'Starting Package', value: '₹52,000+/mo' }, // TODO: VERIFY with all allowances
        { iconName: 'FaCalendar', label: 'Exam Stages', value: 'Prelims → Mains → Interview' },
      ],
    },

    whyChoose: [
      { iconName: 'FaUserTie', title: 'Taught by an Ex-Recruiter', description: 'Sidharth Sir sat on IBPS interview panels as a Bank Manager. He knows what a 90-marks interview score looks like — and teaches you to produce it.', iconBg: 'red' },
      { iconName: 'FaTachometerAlt', title: 'Prelims Speed Strategy', description: 'IBPS PO Prelims is 60 minutes for 100 questions. We spend dedicated sessions on time management — which questions to attempt, which to skip, and in what order.', iconBg: 'orange' },
      { iconName: 'FaFileAlt', title: 'Mains Descriptive Preparation', description: 'The IBPS PO Mains includes a 30-minute descriptive test (Letter + Essay). We conduct 3 descriptive writing sessions per week with model answers.', iconBg: 'red' },
      { iconName: 'FaMicrophoneAlt', title: 'Personal Interview Coaching', description: 'Two full rounds of mock interview per student, with panel feedback. Banking GK, HR questions, current affairs, and confidence drills — all included.', iconBg: 'orange' },
      { iconName: 'FaDatabase', title: 'Banking Awareness Deep Dive', description: 'RBI circulars, credit policy, banking terms, government schemes, and current financial events — covered in a daily 15-minute session throughout the programme.', iconBg: 'red' },
      { iconName: 'FaTrophy', title: '100+ PO Selections', description: 'Since 2010, over 100 students from Samarth Academy have cleared IBPS PO and are now working as Probationary Officers across India\'s top public sector banks.', iconBg: 'orange' },
    ],

    courseDetails: {
      inclusions: [
        'Prelims: Reasoning Ability, Quantitative Aptitude, English Language',
        'Mains: Data Analysis & Interpretation, Reasoning & Computer Aptitude',
        'Mains: English Language (higher level), General/Economy/Banking Awareness',
        'Mains Descriptive: Letter Writing + Essay (3 sessions/week)',
        'Interview: Banking GK, HR questions, Current Affairs, Confidence drills',
        '2 Mock Interviews per student with panel feedback',
        'Weekly Prelims mocks + Full Mains simulation once/month',
        'Daily Banking Current Affairs capsule (15 min)',
        'Computer Aptitude basics for Mains',
        'Printed notes + previous 5-year IBPS PO papers solved',
        'WhatsApp group — faculty responds within 24 hours',
        'Individual performance tracking across all mocks',
      ],
      fees: {
        original: 18000,
        discounted: 15000,
        currency: '₹',
        emiAvailable: true,
        emiNote: '₹8,000 at enrolment + ₹7,000 at Mains stage. Zero interest.',
      },
    },

    syllabus: {
      subjects: [
        {
          name: 'Reasoning Ability (Prelims + Mains)',
          topics: ['Puzzles & Seating Arrangements (Linear, Circular, Floor)', 'Syllogism', 'Inequality (Direct & Coded)', 'Blood Relations', 'Direction Sense', 'Coding-Decoding', 'Machine Input/Output', 'Data Sufficiency', 'Alphanumeric Series', 'Logical Reasoning (Statement-Assumption, Cause-Effect)'],
        },
        {
          name: 'Quantitative Aptitude',
          topics: ['Number Series', 'Simplification & Approximation', 'Percentage, Profit & Loss', 'Ratio, Proportion, Average', 'Time & Work, Speed & Distance', 'Data Interpretation (Bar, Line, Pie, Caselet)', 'Quadratic Equations', 'Number System', 'Probability & Permutation-Combination'],
        },
        {
          name: 'English Language',
          topics: ['Reading Comprehension (3–4 passages)', 'Cloze Test (New Pattern)', 'Error Detection & Correction', 'Fill in the Blanks (Double/Triple)', 'Para Jumbles', 'Sentence Completion/Improvement', 'Vocabulary in Context', 'Descriptive Essay Writing', 'Formal Letter/Application Writing'],
        },
        {
          name: 'General / Banking / Economy Awareness',
          topics: ['Banking History & Structure in India', 'RBI Monetary Policy & Functions', 'SEBI, NABARD, NHB, SIDBI roles', 'Financial Inclusion Schemes', 'Union Budget Key Points', 'Economic Survey Highlights', 'Current Affairs (Monthly)', 'International Finance — IMF, World Bank, ADB', 'Banking Terminology Glossary'],
        },
        {
          name: 'Data Analysis & Interpretation (Mains)',
          topics: ['Table DI', 'Bar Graph DI', 'Line Graph DI', 'Pie Chart DI', 'Mixed/Caselet DI', 'Missing Data DI', 'Quantity Comparison', 'Data Sufficiency (High Level)'],
        },
      ],
    },

    faqs: [
      faq('What is the eligibility for IBPS PO?', 'Any graduate from a recognised university with minimum 60% marks (55% for SC/ST). Age: 20–30 years (with relaxation for reserved categories). Verify exact criteria from the official IBPS notification.', 0), // TODO: VERIFY exact % criteria
      faq('How many stages are there in IBPS PO?', 'Three stages: (1) Prelims — 60 min, 100 MCQ; (2) Mains — 3 hours + 30 min descriptive; (3) Interview — 100 marks. Final merit = 80% Mains + 20% Interview.', 1),
      faq('Can you really prepare for the interview here?', 'Yes — this is our unique strength. Sidharth Sir has been on IBPS interview panels as a Bank Manager. Mock interview sessions cover banking GK, current affairs, HR questions, and presentation skills.', 2),
      faq('What is the IBPS PO salary?', 'The basic pay for a PO (Junior Management Grade Scale I) is approximately ₹36,000/month at entry level. With DA, HRA, and other allowances, the in-hand take-home is typically ₹52,000–58,000/month. Grows significantly with promotions.', 3), // TODO: VERIFY current basic + DA rates
      faq('How many attempts are allowed for IBPS PO?', 'General/OBC: maximum 4 attempts (age permitting). SC/ST: unlimited attempts within age limit. TODO: VERIFY as IBPS policies update.', 4), // TODO: VERIFY current attempt rules
      faq('Do you offer a separate Prelims-only package?', 'No — we teach all three stages as a complete programme. Splitting preparation leads to gaps. However, students can choose to pay in instalments tied to exam stages.', 5),
      faq('How is the Mains descriptive paper evaluated?', 'It is evaluated manually by IBPS evaluators. Grammar, coherence, content relevance, and word count matter. We share evaluation criteria and model answers in our descriptive sessions.', 6),
      faq('Is the batch available for working professionals?', 'Yes — an evening batch (5:30 PM–8:30 PM, Mon–Sat) is available for working students. Weekend sessions for mock analysis are mandatory.', 7),
    ],

    midCta: {
      eyebrow: '🎯 IBPS PO Notification Expected Soon',
      title: 'Start Preparing Now — Beat the Rush',
      description: 'Every month of early preparation is a massive advantage. Free demo class to see if we\'re the right fit.',
      trustPoints: ['All 3 stages covered', 'Mock interview by ex-Bank Manager', 'EMI available'],
    },

    finalCta: {
      eyebrow: 'A bank officer career is closer than you think',
      title: 'Join Amritsar\'s Most Trusted IBPS PO Coaching',
      subtitle: 'Call us, WhatsApp us, or just walk in. Free demo class available daily.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 6. UGC NET
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'ugc-net-coaching-amritsar',
    examShortName: 'UGC NET',
    examFullName: 'UGC NET (National Eligibility Test)',
    active: true,
    displayOrder: 6,
    facultyTags: ['ugc-net', 'teaching'],

    seo: {
      title: 'Best UGC NET Coaching in Amritsar | Samarth Academy',
      description: 'Top UGC NET coaching in Amritsar for Paper 1 & Paper 2. NTA-pattern, JRF preparation included. ₹12,000. Expert faculty. Call +91-XXXXXXXXXX for a free demo.',
      keywords: 'UGC NET coaching Amritsar, NTA NET coaching Amritsar, UGC NET JRF preparation Punjab',
      canonical: 'https://thesamarthacademy.in/ugc-net-coaching-amritsar',
      ogImage: 'https://thesamarthacademy.in/og/ugc-net-coaching.jpg',
    },

    hero: {
      badge: '📚 Assistant Professor & JRF Prep',
      headline: 'Best UGC NET Coaching in',
      headlineAccent: 'Amritsar',
      subheadline: 'Complete preparation for UGC NET Paper 1 (General) and Paper 2 (Subject) — achieve eligibility for Assistant Professor or qualify JRF for a ₹37,000+/month fellowship.',
      trustPoints: [
        'Paper 1 (General) taught by expert faculty',
        'Subject-specific Paper 2 guidance available',
        'JRF-level preparation included',
        'Twice-yearly exam cycle — two chances per year',
      ],
    },

    quickInfo: {
      duration: '5–6 months',
      fees: '₹12,000',
      batchSize: '30 students max',
      mode: 'Classroom (Amritsar)',
    },

    overview: {
      paragraphs: [
        'UGC NET (National Eligibility Test), conducted by NTA, determines eligibility for the post of Assistant Professor and for Junior Research Fellowship (JRF) in Indian universities and colleges. It is offered in 83+ subjects, tested across two papers: Paper 1 (Teaching & Research Aptitude — common to all) and Paper 2 (Subject-specific).',
        'Clearing NET opens two career paths: (1) Assistant Professorship — a permanent teaching position in colleges and universities with starting pay of ₹57,700 per month (7th Pay Commission Level 10); (2) JRF — a full-time research fellowship worth ₹37,000/month for the first two years, extendable to ₹42,000/month for senior fellows.',
        'Our UGC NET programme focuses on Paper 1 comprehensively — Teaching Aptitude, Research Aptitude, Reading Comprehension, Logical Reasoning, and ICT. For Paper 2, we provide guidance for Commerce, Education, and Hindi subjects. Students of other subjects receive strategy coaching and are guided to appropriate resources.',
      ],
      examStats: [
        { iconName: 'FaChalkboardTeacher', label: 'Subjects Offered', value: '83+ Subjects' },
        { iconName: 'FaRupeeSign', label: 'JRF Fellowship', value: '₹37,000+/mo' },       // TODO: VERIFY current UGC JRF rates
        { iconName: 'FaCalendar', label: 'Exam Frequency', value: 'Twice a Year (June & Dec cycle)' }, // TODO: VERIFY NTA schedule
        { iconName: 'FaGraduationCap', label: 'Eligibility', value: 'Master\'s Degree (55%)' },
      ],
    },

    whyChoose: [
      { iconName: 'FaLightbulb', title: 'Paper 1 Mastery Programme', description: 'Paper 1 is common to all subjects and is often where candidates lose marks. Our entire Paper 1 module is structured around the NTA exam blueprint with topic-wise weightage analysis.', iconBg: 'red' },
      { iconName: 'FaSearch', title: 'Research Aptitude Focus', description: 'Research Methodology, Thesis writing, sampling, and citation formats — these are high-scoring Paper 1 units that most coaching centres skip. We cover them thoroughly.', iconBg: 'orange' },
      { iconName: 'FaRegChartBar', title: 'Data Interpretation Practice', description: 'Paper 1 includes DI and logical reasoning questions at a moderate difficulty level. We integrate 20+ practice DI sets across the course.', iconBg: 'red' },
      { iconName: 'FaCalendarAlt', title: 'Two Exam Cycles Covered', description: 'The programme runs on a 5-month cycle aligned with both the June and December NET cycles. If you miss one cycle, your preparation automatically carries to the next.', iconBg: 'orange' },
      { iconName: 'FaComments', title: 'Communication & Teaching Aptitude', description: 'Paper 1 tests your understanding of classroom communication, learning styles, and teaching methods. These are taught with real examples and scenario-based questions.', iconBg: 'red' },
      { iconName: 'FaBook', title: 'Environment & ICT Included', description: 'Environmental Studies and Information Communication Technology are tested in Paper 1. We include a dedicated module for both — two areas where students regularly lose easy marks.', iconBg: 'orange' },
    ],

    courseDetails: {
      inclusions: [
        'Paper 1: Teaching Aptitude — all 10 units',
        'Paper 1: Research Aptitude — methodology, sampling, ethics',
        'Paper 1: Reading Comprehension — 20 practice passages',
        'Paper 1: Logical Reasoning & Data Interpretation',
        'Paper 1: Information Communication Technology (ICT)',
        'Paper 1: People, Development & Environment',
        'Paper 1: Higher Education System — national + international perspectives',
        'Paper 2 guidance available for Commerce, Education, Hindi',
        'NTA mock papers (last 5 years) solved in class',
        '3 full-length mock exams per month + analysis',
        'JRF score-strategy sessions (how to reach the higher cut-off)',
        'Printed Paper 1 notes + practice question bank (500+ MCQs)',
      ],
      fees: {
        original: 15000,
        discounted: 12000,
        currency: '₹',
        emiAvailable: true,
        emiNote: '₹6,000 at enrolment + ₹6,000 after 2 months.',
      },
    },

    syllabus: {
      subjects: [
        {
          name: 'Paper 1 — Teaching & Research Aptitude',
          topics: ['Teaching Aptitude (Nature, Objectives, Methods, Characteristics)', 'Research Aptitude (Types, Process, Ethics, Thesis Writing)', 'Reading Comprehension', 'Communication (Types, Barriers, Classroom Communication)', 'Reasoning (Logical, Deductive, Inductive, Abductive)', 'Logical Diagrams & Venn Diagrams', 'Data Interpretation (Tables, Bar, Pie, Line Graphs)', 'Information & Communication Technology (ICT)', 'People, Development & Environment', 'Higher Education System (Governance, Policy, International)'],
        },
        {
          name: 'Paper 2 — Commerce (Subject)',
          topics: ['Accounting (Financial, Cost, Management)', 'Business Finance & Financial Management', 'Auditing & Corporate Governance', 'Business Laws & Legal Framework', 'Marketing Management', 'Human Resource Management', 'Business Statistics & Operations Research', 'Indian Financial System', 'Tax Laws (GST, Income Tax Basics)', 'E-Commerce & Digital Business'],
        },
        {
          name: 'Paper 2 — Education (Subject)',
          topics: ['Philosophical Foundations of Education', 'Sociological Foundations of Education', 'Psychological Foundations', 'Educational Administration & Management', 'Curriculum Development', 'Educational Technology', 'Guidance & Counselling', 'Research Methods in Education', 'Comparative Education', 'Inclusive Education'],
        },
      ],
    },

    faqs: [
      faq('What is the difference between NET and JRF?', 'Both are cleared in the same exam. JRF is the top percentile scorers (approximately top 6%) who get a monthly fellowship for research. All others who clear the cut-off qualify as NET-eligible for Assistant Professor. You don\'t apply separately — NTA determines this from your score.', 0), // TODO: VERIFY JRF % criteria
      faq('Is a Master\'s degree mandatory to appear for UGC NET?', 'Yes — you need a Master\'s degree with minimum 55% marks (50% for SC/ST/OBC-NCL/PWD). Final-year Master\'s students can also appear provisionally.', 1),
      faq('How many papers are in UGC NET?', 'Two papers in a single sitting: Paper 1 (50 MCQ, 100 marks — 1 hour) on Teaching & Research Aptitude; Paper 2 (100 MCQ, 200 marks — 2 hours) on the chosen subject. Total 3 hours.', 2),
      faq('Is there negative marking in UGC NET?', 'No — there is no negative marking for UGC NET from 2018 onwards. All questions carry 2 marks. Attempt all questions.', 3),
      faq('Do you teach Paper 2 for all 83 subjects?', 'We teach Paper 1 comprehensively for all students. Paper 2 guidance is available for Commerce, Education, and Hindi. For other subjects, we provide strategy coaching and point you to the best self-study resources.', 4),
      faq('How many times can I attempt UGC NET?', 'There is no attempt limit for UGC NET. You can appear every cycle (twice per year) until you clear it.', 5),
      faq('What jobs can I get after clearing UGC NET?', 'Assistant Professor in any UGC-recognised college or university. JRF holders can additionally pursue PhD with fellowship funding. Some state PSC and other competitive exams also give weightage to NET qualification.', 6),
      faq('When are the UGC NET exams held?', 'Typically in June (for the December cycle notification) and December (for the June cycle notification). NTA announces exact dates — check nta.ac.in for current schedule.', 7), // TODO: VERIFY current NTA schedule
      faq('Is online coaching available?', 'Currently classroom-based in Amritsar. Call us to enquire about online batch availability.', 8),
    ],

    midCta: {
      eyebrow: '📖 Next NET Batch Forming Now',
      title: 'Paper 1 Mastery + Subject Guidance — All in One Programme',
      description: 'Qualify for Assistant Professorship or JRF. Free demo class available — no commitment.',
      trustPoints: ['No negative marking strategy', 'JRF cut-off targeting', 'Paper 2 guidance for Commerce/Education/Hindi'],
    },

    finalCta: {
      eyebrow: 'Teach at the college level. Earn a research fellowship.',
      title: 'Start Your UGC NET Preparation Today',
      subtitle: 'Call or WhatsApp to enrol. Free demo class every week.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // 7. CAT
  // ══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'cat-coaching-amritsar',
    examShortName: 'CAT',
    examFullName: 'CAT (Common Admission Test for IIMs)',
    active: true,
    displayOrder: 7,
    facultyTags: ['cat', 'mba'],

    seo: {
      title: 'Best CAT Coaching in Amritsar | Samarth Academy',
      description: 'Top CAT coaching in Amritsar for IIM admissions. VARC, DILR & QA covered. ₹18,000. 95+ percentile achieved by students. Call +91-XXXXXXXXXX for a free demo.',
      keywords: 'CAT coaching Amritsar, CAT MBA coaching Amritsar, IIM preparation Punjab, CAT 2025 coaching',
      canonical: 'https://thesamarthacademy.in/cat-coaching-amritsar',
      ogImage: 'https://thesamarthacademy.in/og/cat-coaching.jpg',
    },

    hero: {
      badge: '🎓 IIM & Top MBA Aspirants',
      headline: 'Best CAT Coaching in',
      headlineAccent: 'Amritsar',
      subheadline: 'Complete CAT preparation for IIM admissions — VARC, DILR, and QA taught with an analytical, speed-focused approach. From 60 percentile to 99+ percentile.',
      trustPoints: [
        'All 3 sections — VARC, DILR, QA',
        'Scaled score + percentile strategy sessions',
        'Past CAT papers (10 years) solved in class',
        'GDPI (Group Discussion + Interview) prep included',
      ],
    },

    quickInfo: {
      duration: '8–10 months',
      fees: '₹18,000',
      batchSize: '25 students max',
      mode: 'Classroom (Amritsar)',
    },

    overview: {
      paragraphs: [
        'CAT (Common Admission Test) is India\'s most competitive management entrance exam, conducted annually by one of the IIMs on rotation. A strong CAT score opens doors to the IIMs, IITs (for MBA), FMS Delhi, MDI Gurgaon, SPJIMR, and 1,200+ other top B-schools across the country. With an MBA from a top institute, graduates enter corporate life at ₹12–30 LPA and above.',
        'CAT tests three competencies: Verbal Ability & Reading Comprehension (VARC), Data Interpretation & Logical Reasoning (DILR), and Quantitative Ability (QA). The exam has 66 questions in 2 hours, with a mix of MCQs (negative marking: -1 for wrong) and TITA (Type In The Answer — no negative marking). Scoring is percentile-based, not absolute marks.',
        'At Samarth Academy, our CAT programme is designed for serious MBA aspirants targeting 95+ percentile. We focus on accuracy over speed in early months, then shift to timed practice. GDPI preparation for calls from top institutes is built into the last 2 months of the programme.',
      ],
      examStats: [
        { iconName: 'FaGraduationCap', label: 'B-Schools Accept CAT', value: '1,200+' },
        { iconName: 'FaRupeeSign', label: 'IIM Average Package', value: '₹25 LPA+' },   // TODO: VERIFY IIM average package 2024
        { iconName: 'FaCalendar', label: 'Exam Frequency', value: 'Once a Year (November)' },
        { iconName: 'FaUsers', label: 'Applicants per Year', value: '3+ Lakh' },       // TODO: VERIFY CAT 2024 registration count
      ],
    },

    whyChoose: [
      { iconName: 'FaBrain', title: 'Analytical Teaching Approach', description: 'CAT tests thinking, not memorisation. We teach frameworks and mental shortcuts for DI sets, RC passages, and Quant problems that transfer to any question type.', iconBg: 'red' },
      { iconName: 'FaFire', title: 'DILR Specialisation', description: 'Data Interpretation & Logical Reasoning is the section most students struggle with under time pressure. We have a dedicated 6-week DILR sprint with 100+ sets — the most intensive in Amritsar.', iconBg: 'orange' },
      { iconName: 'FaBookOpen', title: 'VARC Reading Programme', description: 'Reading comprehension speed and accuracy is built over months, not weeks. We include a structured editorial reading habit from Day 1 — 30 minutes daily of curated reading material.', iconBg: 'red' },
      { iconName: 'FaPercentage', title: 'Percentile Strategy', description: 'CAT is percentile, not marks. We teach score maximisation strategy — which sections to attempt first, how to handle TITA questions, and how to manage negative marking risk.', iconBg: 'orange' },
      { iconName: 'FaComments', title: 'GDPI Preparation', description: 'Group Discussion and Personal Interview rounds are included in the last 2 months. We run actual GD sessions and individual mock PI rounds covering WAT, current affairs, and profile-based questions.', iconBg: 'red' },
      { iconName: 'FaFlask', title: 'Slot-Specific Mock Tests', description: 'CAT difficulty varies slightly between morning and afternoon slots. We analyse past slot patterns and run slot-specific mock tests in the final preparation month.', iconBg: 'orange' },
    ],

    courseDetails: {
      inclusions: [
        'VARC: Reading Comprehension (8–10 passages/session), Verbal Ability',
        'VARC: Para Jumbles, Para Summary, Odd Sentence Out',
        'DILR: DI (Tables, Graphs, Caselets, Games, Arrangements)',
        'DILR: LR (Puzzles, Venn, Grouping, Scheduling, Binary Logic)',
        'QA: Arithmetic (all topics), Algebra, Geometry, Number Theory',
        'QA: Permutation, Combination, Probability',
        'QA: Modern Maths (Progressions, Functions, Coordinate Geometry)',
        '10 years of past CAT papers solved and analysed',
        '4 full-length mock CATs per month in the final 3 months',
        'Percentile strategy and section-order optimisation sessions',
        'GDPI: Group Discussion practice (4 rounds)',
        'GDPI: Mock Personal Interviews (2 rounds per student)',
        'Shortlisting profile: college selection guide based on percentile',
      ],
      fees: {
        original: 22000,
        discounted: 18000,
        currency: '₹',
        emiAvailable: true,
        emiNote: '₹9,000 at enrolment + ₹9,000 after 4 months. Zero interest.',
      },
    },

    syllabus: {
      subjects: [
        {
          name: 'VARC — Verbal Ability & Reading Comprehension',
          topics: ['Reading Comprehension (Long Passages — 500-700 words)', 'Reading Comprehension (Short Passages)', 'Para Jumbles (Sentences in Order)', 'Para Summary (Best Summarising Sentence)', 'Odd Sentence Out (Sentence not fitting the paragraph)', 'Vocabulary in Context (High-frequency CAT words)', 'Critical Reasoning (Strengthen / Weaken / Assumption)', 'Daily Reading Habit Programme (Editorial Texts)'],
        },
        {
          name: 'DILR — Data Interpretation & Logical Reasoning',
          topics: ['Tables (Single, Combination)', 'Bar Graphs & Line Graphs', 'Pie Charts & Mix Charts', 'Caselets (Text-based DI)', 'Games & Tournaments', 'Arrangements (Linear, Circular, Complex)', 'Grouping & Selection', 'Scheduling & Sequencing', 'Venn Diagrams & Set Theory', 'Binary Logic (Truth-Teller / Liar problems)'],
        },
        {
          name: 'QA — Quantitative Ability (Arithmetic)',
          topics: ['Number System (Divisibility, Remainder, HCF/LCM)', 'Percentage & Profit/Loss', 'Simple & Compound Interest', 'Ratio, Proportion & Variation', 'Mixtures & Alligation', 'Time & Work, Pipes & Cisterns', 'Time, Speed & Distance (Trains, Boats, Circular)'],
        },
        {
          name: 'QA — Quantitative Ability (Algebra & Higher Maths)',
          topics: ['Linear & Quadratic Equations', 'Inequalities & Modulus', 'Functions & Graphs', 'Progressions (AP, GP, HP)', 'Surds & Indices', 'Logarithms', 'Permutation & Combination', 'Probability'],
        },
        {
          name: 'QA — Geometry & Modern Maths',
          topics: ['Triangles (Types, Congruence, Similarity)', 'Circles (Theorems, Tangents)', 'Quadrilaterals & Polygons', 'Mensuration (2D & 3D)', 'Coordinate Geometry (Straight Lines, Circles)', 'Trigonometry (Basic to Advanced)', 'Set Theory & Venn Diagrams'],
        },
      ],
    },

    faqs: [
      faq('What CAT score do I need for IIM Ahmedabad / Bangalore / Calcutta?', 'For IIM A, B, C — typically 99+ percentile in each section and overall. For the next tier (IIM L, I, K, Kozhikode) — 95–97 percentile. However, your profile (graduation marks, work experience, diversity) also plays a major role in shortlisting. Aim for 99+ as your target.', 0), // TODO: VERIFY current IIM cutoffs
      faq('I am an engineering student. Is CAT suitable for me?', 'Yes — engineering backgrounds typically find QA easier and need to invest more time in VARC. We customise individual study plans based on your strengths. Engineers are among the highest CAT takers.', 1),
      faq('When should I start preparing for CAT?', 'Ideally 10–12 months before the exam (which is held in November). Starting in January gives you a full year. Starting in July with intensive preparation is still possible but requires more focused effort.', 2),
      faq('How many mock tests should I give?', 'We recommend 25–30 full-length mocks in the last 3 months before CAT, in addition to sectional mocks throughout the year. Mock analysis — identifying why you got something wrong — is more important than the mock count.', 3),
      faq('Is GDPI preparation included?', 'Yes — the last 2 months of our programme include Group Discussion practice sessions and individual mock Personal Interview rounds. We cover WAT (Written Ability Test), current affairs, and profile-based HR questions.', 4),
      faq('What if I get a low percentile in my first attempt?', 'Many students clear CAT in their second or third attempt. We allow batch continuation at discounted rates for repeat students. Analysis of your first attempt is the most valuable input for the next.', 5),
      faq('Is CAT only for IIMs?', 'No — over 1,200 MBA programmes across India accept CAT scores, including FMS Delhi (free tuition), MDI Gurgaon, SPJIMR Mumbai, NITIE, and all IITs offering management programmes. You get multiple institute options from one exam.', 6),
      faq('Can a non-commerce student prepare for CAT?', 'Absolutely — CAT has no subject restriction. Commerce, Engineering, Science, Arts — all backgrounds appear and excel. Our batch always has a mix of backgrounds.', 7),
      faq('Do I need to know advanced mathematics?', 'CAT QA is Class 10–12 level mathematics. No calculus or college-level maths is tested. If you were comfortable with Class 10 maths, you can build on that. We start QA from foundational topics.', 8),
    ],

    midCta: {
      eyebrow: '🎯 CAT 2025 Batch Forming',
      title: 'From Any Percentile to Your Target IIM',
      description: 'VARC + DILR + QA + GDPI — complete CAT programme in Amritsar. Free demo class available.',
      trustPoints: ['10 years past papers solved', 'GDPI preparation included', 'Small batch — 25 students max'],
    },

    finalCta: {
      eyebrow: 'The IIM you want is 1 year of preparation away',
      title: 'Take the First Step — Free Demo Class',
      subtitle: 'Call or WhatsApp to book a session. No registration fee for the demo.',
    },
  },

]; // end seedData

// ─── runner ───────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      await LandingPage.deleteMany({});
      console.log('🗑️  Cleared existing landing pages');
    }

    let created = 0, updated = 0;
    for (const page of seedData) {
      const result = await LandingPage.findOneAndUpdate(
        { slug: page.slug },
        page,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      const isNew = result.createdAt.getTime() === result.updatedAt.getTime();
      console.log(`  ${isNew ? '✨ Created' : '♻️  Updated'}: ${page.slug}`);
      isNew ? created++ : updated++;
    }

    console.log(`\n✅ Seed complete — ${created} created, ${updated} updated`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
