require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost.model');
const Category = require('../models/Category.model');

async function getCatIds(slugs) {
  const cats = await Category.find({ slug: { $in: slugs } }).select('_id slug').lean();
  return cats.map(c => c._id);
}

const postData = [
  {
    title: 'Complete SSC CGL 2026 Syllabus: Subject-wise Breakdown',
    excerpt: 'A comprehensive guide to the SSC CGL 2026 syllabus covering all 4 tiers — Quantitative Aptitude, Reasoning, English, General Awareness, and Tier 2-4 specifics.',
    content: `<h2>Understanding SSC CGL 2026 Exam Pattern</h2>
<p>The SSC CGL (Combined Graduate Level) 2026 exam is conducted in 4 tiers. Each tier serves a specific purpose in evaluating candidates for various government posts.</p>

<h3>Tier 1: Computer-Based Test (Prelims)</h3>
<p>Tier 1 is the screening test with 100 questions across 4 sections. Each question carries 2 marks, with negative marking of 0.50 for wrong answers.</p>
<ul>
  <li><strong>General Intelligence &amp; Reasoning:</strong> 25 questions, 50 marks</li>
  <li><strong>General Awareness:</strong> 25 questions, 50 marks</li>
  <li><strong>Quantitative Aptitude:</strong> 25 questions, 50 marks</li>
  <li><strong>English Comprehension:</strong> 25 questions, 50 marks</li>
</ul>
<p>Total duration: 60 minutes. The cut-off varies by category but typically falls between 130–165 marks for general candidates.</p>

<h3>Tier 2: Mains Examination</h3>
<p>Tier 2 has 4 papers. Paper 1 (Quantitative Abilities) and Paper 2 (English Language and Comprehension) are mandatory for all candidates. Papers 3 and 4 are post-specific.</p>
<ul>
  <li><strong>Paper 1 – Quantitative Abilities:</strong> 100 questions, 200 marks, 2 hours</li>
  <li><strong>Paper 2 – English Language:</strong> 200 questions, 200 marks, 2 hours</li>
  <li><strong>Paper 3 – Statistics:</strong> For Statistical Investigator posts</li>
  <li><strong>Paper 4 – General Studies:</strong> For Assistant Audit Officer posts</li>
</ul>

<h3>Tier 3: Descriptive Paper</h3>
<p>A pen-and-paper test of 60 minutes. Candidates write essays, letters, applications, or précis in English or Hindi. Total marks: 100. This is often where candidates underperform — especially those who have not practised descriptive writing.</p>

<h3>Tier 4: Skill Test / Computer Proficiency Test</h3>
<p>Required only for specific posts like Tax Assistant (CBDT/CBIC) and Sub Inspector (CBI). It tests typing speed (DEST) or computer proficiency (CPT).</p>

<h2>Subject-wise Detailed Syllabus</h2>

<h3>Quantitative Aptitude</h3>
<ul>
  <li>Number System, HCF/LCM, Decimal Fractions</li>
  <li>Percentage, Profit and Loss, Discount</li>
  <li>Simple and Compound Interest</li>
  <li>Time, Speed, Distance — Trains, Boats, Streams</li>
  <li>Time and Work, Pipes and Cisterns</li>
  <li>Ratio and Proportion, Partnership</li>
  <li>Algebra — Linear and Quadratic Equations</li>
  <li>Geometry — Triangles, Circles, Quadrilaterals</li>
  <li>Mensuration — 2D and 3D figures</li>
  <li>Trigonometry, Heights and Distances</li>
  <li>Statistics — Mean, Median, Mode, Bar/Pie graphs</li>
</ul>

<h3>General Intelligence &amp; Reasoning</h3>
<ul>
  <li>Verbal Reasoning — Analogies, Series, Coding-Decoding</li>
  <li>Non-verbal Reasoning — Mirror Images, Cubes, Patterns</li>
  <li>Logical Reasoning — Syllogism, Statement-Conclusion</li>
  <li>Puzzles — Seating Arrangement, Direction Sense, Blood Relations</li>
  <li>Word Formation, Alphabet Series</li>
</ul>

<h3>English Language</h3>
<ul>
  <li>Reading Comprehension</li>
  <li>Cloze Test, Fill in the Blanks</li>
  <li>Sentence Correction, Error Spotting</li>
  <li>Synonyms, Antonyms, Idioms and Phrases</li>
  <li>Voice Change (Active/Passive), Direct/Indirect Speech</li>
  <li>Para Jumbles, One-word Substitution</li>
</ul>

<h3>General Awareness</h3>
<ul>
  <li><strong>History:</strong> Ancient, Medieval, Modern Indian History</li>
  <li><strong>Geography:</strong> Physical, Economic, Indian and World Geography</li>
  <li><strong>Polity:</strong> Indian Constitution, Parliament, Judiciary</li>
  <li><strong>Economics:</strong> Indian Economy, Banking, Budget</li>
  <li><strong>Science:</strong> Physics, Chemistry, Biology basics</li>
  <li><strong>Current Affairs:</strong> Last 12 months — sports, awards, policies, international events</li>
</ul>

<h2>Recommended Preparation Timeline</h2>
<p>For a 9-month preparation plan:</p>
<ul>
  <li><strong>Months 1–3:</strong> Cover the entire syllabus subject-wise. Focus on understanding concepts.</li>
  <li><strong>Months 4–6:</strong> Practice tier-wise questions. Take 1 mock test per week.</li>
  <li><strong>Months 7–8:</strong> Intensive mock test phase — 2-3 mocks per week with detailed analysis.</li>
  <li><strong>Month 9:</strong> Revision, weak area focus, descriptive paper practice.</li>
</ul>

<h2>Final Tips from Samarth Academy</h2>
<p>Most candidates lose marks not because they do not know — but because of careless mistakes, time mismanagement, and over-reliance on shortcuts without practice. Our 9-month SSC CGL program at Samarth Academy addresses all 4 tiers comprehensively with weekly mocks and personalised feedback.</p>`,
    categorySlugs: ['ssc-tips', 'exam-notifications'],
    featured: true,
    publishedAt: new Date('2026-04-15'),
  },
  {
    title: 'IBPS PO vs SBI PO: Which Should You Choose in 2026?',
    excerpt: 'A detailed comparison of IBPS PO and SBI PO — exam pattern differences, salary structure, posting locations, career growth, and which one you should target based on your goals.',
    content: `<h2>Understanding the Two Major Bank PO Exams</h2>
<p>If you are preparing for a banking career as a Probationary Officer, two major exams dominate the landscape: IBPS PO (Institute of Banking Personnel Selection — covers multiple public sector banks) and SBI PO (specifically for State Bank of India). Both are prestigious, but they differ significantly.</p>

<h2>Exam Pattern Comparison</h2>

<h3>IBPS PO 2026 Pattern</h3>
<ul>
  <li>Prelims: 100 marks, 60 minutes (English, Reasoning, Quantitative Aptitude)</li>
  <li>Mains: 200 marks, 3 hours (Reasoning + Computer Aptitude, English, Data Analysis, GA, Descriptive)</li>
  <li>Interview: 100 marks</li>
</ul>

<h3>SBI PO 2026 Pattern</h3>
<ul>
  <li>Prelims: 100 marks, 60 minutes (similar to IBPS)</li>
  <li>Mains: 250 marks (Data Analysis, Reasoning, English, GA plus Descriptive paper)</li>
  <li>Group Exercise + Interview: 50 marks</li>
</ul>

<p>SBI PO is generally considered slightly tougher due to higher difficulty in mains questions and the additional Group Discussion round.</p>

<h2>Salary Comparison</h2>
<ul>
  <li><strong>SBI PO Starting Salary:</strong> ₹52,000–₹55,000 in-hand (including allowances)</li>
  <li><strong>IBPS PO Starting Salary:</strong> ₹45,000–₹52,000 (varies by bank)</li>
</ul>

<h2>Posting and Transfer Policy</h2>
<ul>
  <li><strong>SBI PO:</strong> All-India transferable. Transfers happen every 3 years.</li>
  <li><strong>IBPS PO:</strong> State-specific for some banks (PNB, BoB are pan-India; others have regional preferences).</li>
</ul>

<h2>Career Growth</h2>
<p>SBI offers slightly faster promotions in early career. Both lead to similar senior positions over a 25–30 year career. SBI brand value internationally is also higher.</p>

<h2>Which Should You Choose?</h2>
<p><strong>Choose SBI PO if:</strong></p>
<ul>
  <li>You want a higher starting salary</li>
  <li>You do not mind all-India posting</li>
  <li>You want the prestige of India's largest bank</li>
  <li>You are confident in descriptive writing</li>
</ul>

<p><strong>Choose IBPS PO if:</strong></p>
<ul>
  <li>You prefer regional posting (closer to home)</li>
  <li>You want more attempts (IBPS conducts exams annually across multiple banks)</li>
  <li>You want a slightly less competitive exam</li>
</ul>

<h2>Best Strategy: Prepare for Both</h2>
<p>The syllabus overlaps about 85%. Most serious aspirants prepare for both simultaneously. The differences are mainly in difficulty level and mains exam structure.</p>
<p>At Samarth Academy, our 6-month Banking program covers both IBPS PO and SBI PO comprehensively, including descriptive writing practice and Group Discussion training.</p>`,
    categorySlugs: ['banking-prep', 'career-guidance'],
    featured: true,
    publishedAt: new Date('2026-04-10'),
  },
  {
    title: 'Punjab Police Constable 2026: Salary, Eligibility & Selection Process',
    excerpt: 'Complete guide to Punjab Police Constable recruitment 2026 — salary structure, eligibility criteria, physical standards, written exam pattern, and preparation strategy.',
    content: `<h2>About Punjab Police Constable Recruitment</h2>
<p>The Punjab Police Department recruits constables annually based on operational need. The selection involves a written exam, physical fitness test, and medical examination. For Punjab residents seeking a stable government career with respect and a good salary, this is one of the most popular recruitment exams.</p>

<h2>Eligibility Criteria for 2026</h2>
<ul>
  <li><strong>Age:</strong> 18–28 years (relaxation for SC/ST/OBC/PwD as per government norms)</li>
  <li><strong>Education:</strong> 10+2 (Higher Secondary) from a recognised board</li>
  <li><strong>Domicile:</strong> Must be a Punjab state resident</li>
  <li><strong>Language:</strong> Must know Punjabi (Gurmukhi script) — verified through written exam</li>
</ul>

<h2>Physical Standards</h2>
<h3>Male Candidates</h3>
<ul>
  <li>Height: Minimum 170 cm</li>
  <li>Chest: Minimum 86 cm (unexpanded), 90 cm (expanded)</li>
</ul>
<h3>Female Candidates</h3>
<ul>
  <li>Height: Minimum 158 cm</li>
</ul>

<h2>Selection Process</h2>

<h3>Phase 1: Written Examination</h3>
<ul>
  <li>General Knowledge: 25 marks</li>
  <li>Mental Ability &amp; Reasoning: 25 marks</li>
  <li>Numerical Ability: 25 marks</li>
  <li>Punjabi Language: 25 marks</li>
</ul>
<p>Total: 100 marks, 90 minutes. Negative marking of 0.25 per wrong answer.</p>

<h3>Phase 2: Physical Measurement Test (PMT)</h3>
<p>Height and chest measurement verification as per eligibility standards.</p>

<h3>Phase 3: Physical Endurance Test (PET)</h3>
<p>Race and other physical events. Failing PET disqualifies the candidate regardless of written exam marks.</p>

<h3>Phase 4: Medical Examination</h3>
<p>Standard medical fitness check by a certified medical board.</p>

<h2>Salary Structure</h2>
<ul>
  <li><strong>Pay Level:</strong> Level 5 (₹29,200–₹92,300)</li>
  <li><strong>Starting Basic Pay:</strong> ₹29,200</li>
  <li><strong>Gross Salary (with allowances):</strong> ₹38,000–₹42,000 per month</li>
  <li><strong>Allowances:</strong> DA, HRA, Travel Allowance, Uniform Allowance</li>
</ul>

<h2>Career Growth Path</h2>
<p>Constable → Head Constable → ASI → SI → Inspector → DSP. With dedication, retirement at the rank of Inspector is achievable within a 30-year career.</p>

<h2>Preparation Strategy</h2>
<ol>
  <li>Prioritise Punjabi language preparation — many candidates underestimate this section.</li>
  <li>Build physical fitness alongside written exam prep — both matter equally.</li>
  <li>Cover Punjab-specific GK thoroughly — geography, history, current government schemes.</li>
  <li>Practice 25 reasoning + 25 quantitative questions in 45 minutes under timed conditions.</li>
</ol>`,
    categorySlugs: ['punjab-police-state', 'career-guidance'],
    featured: false,
    publishedAt: new Date('2026-04-05'),
  },
  {
    title: 'How Ranjit Singh Cleared SSC CGL in His First Attempt',
    excerpt: 'Ranjit Singh from Amritsar scored 178/200 in SSC CGL Tier 1 on his first attempt. Here is his exact preparation strategy, daily schedule, and the resources he used.',
    content: `<h2>Background</h2>
<p>Ranjit Singh, 23, from Amritsar completed his B.Com in 2025 and enrolled in Samarth Academy's SSC CGL batch the same year. Eight months later, he cleared SSC CGL Tier 1 with 178/200 — scoring in the top 2% of all General category candidates.</p>

<blockquote>
  <p>"I failed twice in mock tests in my first month. But the detailed analysis sessions at Samarth Academy helped me identify exactly where I was losing marks. Everything changed after that." — Ranjit Singh</p>
</blockquote>

<h2>His Daily Schedule</h2>
<ul>
  <li><strong>6:00–8:00 AM:</strong> Quantitative Aptitude — 30 questions timed practice</li>
  <li><strong>9:00–11:00 AM:</strong> Samarth Academy class (Reasoning or English on alternate days)</li>
  <li><strong>1:00–3:00 PM:</strong> General Awareness — 2 chapters per day (NCERT + current affairs)</li>
  <li><strong>5:00–6:30 PM:</strong> Previous year papers — 1 full section timed</li>
  <li><strong>9:00–10:00 PM:</strong> Revision of the day's weak areas</li>
</ul>

<h2>Resources That Made the Difference</h2>
<ul>
  <li><strong>Quantitative Aptitude:</strong> R.S. Aggarwal + Samarth Academy's shortcut formula booklet</li>
  <li><strong>Reasoning:</strong> Previous year papers (2018–2024) — solved all 1200+ questions</li>
  <li><strong>English:</strong> Wren and Martin (grammar basics) + 500 SSC vocabulary flashcards</li>
  <li><strong>General Awareness:</strong> Lucent GK + monthly current affairs compiled by faculty</li>
</ul>

<h2>Mock Test Strategy</h2>
<p>Ranjit completed 47 full-length mock tests in the 4 months before the exam. More importantly, he spent 90 minutes analysing each mock — categorising wrong answers as "conceptual error", "calculation mistake", or "negative marking risk". This analysis habit is what separated him from peers who scored similarly but did not improve.</p>

<h2>What He Would Do Differently</h2>
<p>"I spent too much time on English in months 1 and 2. I was already strong there. I should have focused that energy on Quantitative Aptitude from the start."</p>

<h2>Message for 2026 Aspirants</h2>
<p>"Consistency beats intensity. 4 focused hours every day beats 10 scattered hours. And please — analyse your mocks. Every mock without analysis is a wasted opportunity."</p>

<p>Ranjit is currently preparing for SSC CGL Tier 2 with Samarth Academy's dedicated mains batch.</p>`,
    categorySlugs: ['success-stories', 'ssc-tips'],
    featured: true,
    publishedAt: new Date('2026-03-28'),
  },
  {
    title: 'SSC CHSL 2026 Notification: Vacancies, Eligibility & Application Dates',
    excerpt: 'SSC has released the CHSL 2026 notification with over 3,700 vacancies across LDC, JSA, PA, and DEO posts. Here are all the key dates, eligibility criteria, and how to apply.',
    content: `<h2>SSC CHSL 2026 Overview</h2>
<p>The Staff Selection Commission (SSC) has released the official Combined Higher Secondary Level (CHSL) 2026 notification. This year's recruitment drive offers 3,712 vacancies across multiple central government posts — making it one of the largest CHSL batches in recent years.</p>

<h2>Important Dates</h2>
<ul>
  <li><strong>Notification Date:</strong> March 20, 2026</li>
  <li><strong>Application Start Date:</strong> March 21, 2026</li>
  <li><strong>Last Date to Apply:</strong> April 20, 2026</li>
  <li><strong>Last Date for Fee Payment:</strong> April 21, 2026</li>
  <li><strong>Tier 1 Exam Date:</strong> June 10–25, 2026</li>
  <li><strong>Admit Card Release:</strong> 2 weeks before exam</li>
</ul>

<h2>Vacancies by Post</h2>
<ul>
  <li><strong>Lower Division Clerk (LDC) / Junior Secretariat Assistant (JSA):</strong> 1,827 posts</li>
  <li><strong>Postal Assistant / Sorting Assistant (PA/SA):</strong> 1,440 posts</li>
  <li><strong>Data Entry Operator (DEO):</strong> 445 posts</li>
</ul>

<h2>Eligibility Criteria</h2>
<h3>Educational Qualification</h3>
<p>10+2 (Higher Secondary) from any recognised board. For DEO posts in C&AG offices, a Science stream with Mathematics in 12th standard is preferred.</p>

<h3>Age Limit (as on 01 January 2026)</h3>
<ul>
  <li><strong>LDC/JSA:</strong> 18–27 years</li>
  <li><strong>PA/SA:</strong> 18–27 years</li>
  <li><strong>DEO:</strong> 18–27 years</li>
</ul>
<p>Age relaxation: SC/ST — 5 years | OBC — 3 years | PwD — 10 years.</p>

<h2>Exam Pattern</h2>
<h3>Tier 1: Computer-Based Test</h3>
<p>200 marks | 60 minutes | 100 questions with negative marking (0.50 per wrong answer)</p>
<ul>
  <li>General Intelligence (Reasoning): 25 questions, 50 marks</li>
  <li>General Awareness: 25 questions, 50 marks</li>
  <li>Quantitative Aptitude: 25 questions, 50 marks</li>
  <li>English Language: 25 questions, 50 marks</li>
</ul>

<h3>Tier 2: Descriptive Test (Pen and Paper)</h3>
<p>100 marks | 60 minutes | Essay (200–250 words) + Letter/Application (150–200 words) in English or Hindi.</p>

<h3>Tier 3: Skill Test / Typing Test</h3>
<p>Post-specific. Qualifying in nature (marks not counted for final merit).</p>

<h2>Application Fee</h2>
<ul>
  <li><strong>General/OBC/EWS:</strong> ₹100</li>
  <li><strong>SC/ST/PwD/Ex-Servicemen/Women:</strong> Exempted</li>
</ul>

<h2>How to Apply</h2>
<ol>
  <li>Visit the official SSC website: ssc.gov.in</li>
  <li>Register as a new user (or log in to existing account)</li>
  <li>Fill application form — personal details, educational qualification, preferred post</li>
  <li>Upload documents: photo (20–50KB), signature (10–20KB)</li>
  <li>Pay application fee (online: Net Banking / Debit Card / Credit Card / UPI)</li>
  <li>Download and save the confirmation page</li>
</ol>

<h2>Preparation Tips for CHSL 2026</h2>
<p>For Tier 1, the syllabus is almost identical to SSC CGL Tier 1 — if you are already preparing for CGL, CHSL requires no separate preparation. The key difference: CHSL Tier 1 is slightly easier than CGL Tier 1.</p>
<p>Focus on Tier 2 (descriptive) from Day 1. Most candidates ignore this section and lose a crucial 100 marks. Practise at least 2 essays and 2 letters per week under timed conditions.</p>`,
    categorySlugs: ['exam-notifications', 'ssc-tips'],
    featured: false,
    publishedAt: new Date('2026-03-22'),
  },
  {
    title: 'Government Job Salary After 7th Pay Commission: Complete Guide for 2026',
    excerpt: 'Confused about government job salaries? Here is a complete breakdown — pay levels, grade pay, allowances, HRA, DA, and in-hand salary calculations for all popular government posts in 2026.',
    content: `<h2>Understanding the 7th Pay Commission Structure</h2>
<p>The 7th Pay Commission (7th CPC) overhauled the government salary structure in 2016. Instead of the old Basic Pay + Grade Pay system, it introduced a single Pay Matrix with 18 levels. Understanding this matrix is essential for every government job aspirant.</p>

<h2>The Pay Matrix: Pay Levels Explained</h2>
<p>The Pay Matrix has 18 levels (Level 1 to Level 18). Most central government jobs that coaching institutes prepare you for fall between Level 1 and Level 10.</p>

<table>
  <thead>
    <tr>
      <th>Level</th>
      <th>Starting Basic Pay (₹)</th>
      <th>Typical Posts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Level 1</td>
      <td>18,000</td>
      <td>Group D (MTS, Peon)</td>
    </tr>
    <tr>
      <td>Level 2</td>
      <td>19,900</td>
      <td>Group D higher posts</td>
    </tr>
    <tr>
      <td>Level 4</td>
      <td>25,500</td>
      <td>LDC, Clerk (SSC CHSL)</td>
    </tr>
    <tr>
      <td>Level 5</td>
      <td>29,200</td>
      <td>JSA, Constable, Punjab Police</td>
    </tr>
    <tr>
      <td>Level 6</td>
      <td>35,400</td>
      <td>SI, Sub-Inspector (CAPF)</td>
    </tr>
    <tr>
      <td>Level 7</td>
      <td>44,900</td>
      <td>SSC CGL Group B posts, Inspector</td>
    </tr>
    <tr>
      <td>Level 8</td>
      <td>47,600</td>
      <td>Assistant Section Officer</td>
    </tr>
    <tr>
      <td>Level 10</td>
      <td>56,100</td>
      <td>Gazetted Officer Class 1 (IAS/IPS entry)</td>
    </tr>
  </tbody>
</table>

<h2>Key Allowances That Increase Your Take-Home</h2>

<h3>Dearness Allowance (DA)</h3>
<p>Currently 50% of basic pay (revised twice yearly based on CPI-IW). This is the biggest variable in your gross salary.</p>

<h3>House Rent Allowance (HRA)</h3>
<p>Depends on city category:</p>
<ul>
  <li><strong>X Cities</strong> (Delhi, Mumbai, Chennai, Kolkata): 27% of basic pay</li>
  <li><strong>Y Cities</strong> (Amritsar, Ludhiana, state capitals): 18% of basic pay</li>
  <li><strong>Z Cities</strong> (other towns): 9% of basic pay</li>
</ul>

<h3>Transport Allowance (TA)</h3>
<p>₹3,600–₹7,200 per month depending on pay level and city category. Plus DA on TA.</p>

<h2>Sample In-Hand Calculation: SSC CGL Inspector (Level 7)</h2>
<ul>
  <li>Basic Pay: ₹44,900</li>
  <li>DA (50%): ₹22,450</li>
  <li>HRA (18% – Y city like Amritsar): ₹8,082</li>
  <li>Transport Allowance: ₹3,600 + DA = ₹5,400</li>
  <li><strong>Gross Salary: ~₹80,832</strong></li>
  <li>Deductions (NPS 10%, CGHS, etc.): ~₹6,500</li>
  <li><strong>Net In-Hand: ~₹74,000</strong></li>
</ul>

<h2>Other Benefits</h2>
<ul>
  <li><strong>NPS (National Pension System):</strong> Government contributes 14% of basic pay — significant long-term wealth creation</li>
  <li><strong>CGHS:</strong> Comprehensive health insurance for employee and family</li>
  <li><strong>LTC (Leave Travel Concession):</strong> Travel reimbursement every 4 years (including family)</li>
  <li><strong>Subsidised Housing:</strong> Government accommodation in many cities (waitlist-based)</li>
  <li><strong>Study Leave:</strong> Paid leave for higher education</li>
</ul>

<h2>8th Pay Commission: What to Expect</h2>
<p>The 8th Pay Commission is expected to be constituted in 2026 for implementation from January 2026. Analysts estimate a 25–30% increase in basic pay across all levels. This would push a Level 7 Inspector's basic pay above ₹56,000 — with in-hand salary potentially exceeding ₹95,000 per month.</p>

<h2>Is a Government Job Worth It in 2026?</h2>
<p>Beyond salary: job security, pension, social respect, and work-life balance make government careers uniquely valuable — especially in smaller cities like Amritsar where private sector alternatives pay significantly less. The real competition is not the exam — it is the years of effort it takes to get there.</p>`,
    categorySlugs: ['career-guidance'],
    featured: false,
    publishedAt: new Date('2026-03-15'),
  },
  {
    title: 'RBI Grade B 2026: Complete Roadmap for Phase 1 & Phase 2',
    excerpt: 'RBI Grade B is one of the most prestigious banking exams in India. Here is a complete preparation roadmap covering Phase 1 MCQs, Phase 2 Economics/Finance, and the interview round.',
    content: `<h2>Why RBI Grade B?</h2>
<p>The Reserve Bank of India Grade B (DR — General) is considered the pinnacle of banking sector careers below the IAS. The starting salary of ₹1,03,000+ per month, exceptional work environment, and meaningful macroeconomic policy work make it a dream for banking aspirants willing to put in extra effort.</p>

<h2>Exam Structure</h2>

<h3>Phase 1: Objective MCQ (Online)</h3>
<p>200 marks | 120 minutes | 200 questions</p>
<ul>
  <li>General Awareness: 80 questions, 80 marks</li>
  <li>English Language: 30 questions, 30 marks</li>
  <li>Quantitative Aptitude: 30 questions, 30 marks</li>
  <li>Reasoning: 60 questions, 60 marks</li>
</ul>
<p>Negative marking: 0.25 per wrong answer. Phase 1 is a pure screening test — scores are not added to final merit.</p>

<h3>Phase 2: Descriptive / Objective (Online)</h3>
<p>Three separate papers, each on the same day:</p>
<ul>
  <li><strong>Paper 1 – Economic and Social Issues (ESI):</strong> 100 marks, 90 minutes (MCQ + Descriptive)</li>
  <li><strong>Paper 2 – English Writing (Descriptive):</strong> 100 marks, 90 minutes</li>
  <li><strong>Paper 3 – Finance and Management (FM):</strong> 100 marks, 90 minutes (MCQ + Descriptive)</li>
</ul>

<h3>Phase 3: Interview</h3>
<p>50 marks. Panel includes senior RBI officers, economists, and external domain experts. Focus: general awareness, banking knowledge, personality assessment.</p>

<h2>Subject-wise Preparation Strategy</h2>

<h3>General Awareness (Phase 1 — 80 marks)</h3>
<p>This is where Phase 1 is won or lost. Cover:</p>
<ul>
  <li>Banking and Finance: RBI functions, monetary policy, banking regulations, SEBI, IRDAI</li>
  <li>Economy: GDP, inflation, fiscal policy, budget highlights</li>
  <li>Current Affairs: Last 12 months — particularly RBI circulars, government schemes, international finance</li>
  <li>Static Banking: History of Indian banking, bank types, payment systems</li>
</ul>

<h3>Economic and Social Issues (Phase 2 — 100 marks)</h3>
<p>This paper separates serious candidates from casual ones. Topics include:</p>
<ul>
  <li>Indian economy — growth, poverty, inequality, infrastructure</li>
  <li>Agriculture, industry, services — structure and challenges</li>
  <li>Social issues — education, health, demographic dividend</li>
  <li>International trade, WTO, BOP, exchange rates</li>
  <li>Sustainable development, climate change economics</li>
</ul>
<p>Resource: NCERT Economics Class 11–12, Economic Survey, RBI Annual Report.</p>

<h3>Finance and Management (Phase 2 — 100 marks)</h3>
<ul>
  <li>Financial markets — equity, debt, derivatives, forex</li>
  <li>Company accounts — P&amp;L, Balance Sheet, ratio analysis</li>
  <li>Financial regulation — RBI, SEBI, IRDAI, PFRDA</li>
  <li>Management — organisational behaviour, HR, leadership theories</li>
</ul>

<h2>Preparation Timeline (9 months)</h2>
<ul>
  <li><strong>Months 1–2:</strong> Phase 1 subjects (Reasoning, Quant, English) — reach 70% accuracy</li>
  <li><strong>Months 3–5:</strong> ESI and FM — build conceptual depth, not just notes</li>
  <li><strong>Month 6:</strong> Phase 1 mock tests 3x per week + ESI/FM descriptive practice daily</li>
  <li><strong>Months 7–8:</strong> Phase 2 integrated mocks — time management across 3 papers</li>
  <li><strong>Month 9:</strong> Interview preparation — mock panels, current events, RBI-specific updates</li>
</ul>

<h2>Salary and Perks</h2>
<ul>
  <li><strong>Starting Gross Salary:</strong> ₹1,03,000+ per month</li>
  <li><strong>Grade Pay:</strong> Part of Officers Grade B (Scale II equivalent)</li>
  <li><strong>Additional Benefits:</strong> Subsidised housing in RBI quarters (exceptional value in Mumbai), CGHS, LTC, education allowances</li>
  <li><strong>Career Growth:</strong> Grade B → Grade C (Assistant General Manager) → Grade D → Executive Director → Deputy Governor</li>
</ul>

<h2>Is RBI Grade B Right for You?</h2>
<p>If you are willing to invest 9–12 months of focused preparation — especially for Phase 2's Economics and Finance components — RBI Grade B offers one of the best returns of any competitive exam in India. The difficulty is high, but so is the reward.</p>
<p>Samarth Academy offers a dedicated RBI Grade B programme covering all three phases. <a href="/contact">Enquire about our RBI Grade B batch</a>.</p>`,
    categorySlugs: ['banking-prep', 'career-guidance'],
    featured: false,
    publishedAt: new Date('2026-03-10'),
  },
];

async function upsertPost(postDoc, categories) {
  const existing = await BlogPost.findOne({ title: postDoc.title });
  if (existing) {
    Object.assign(existing, postDoc, { categories });
    await existing.save();
  } else {
    await new BlogPost({ ...postDoc, categories }).save();
  }
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    if (process.argv.includes('--clear')) {
      await BlogPost.deleteMany({});
      console.log('🗑️  Cleared existing blog posts');
    }

    // Verify categories exist
    const sampleCat = await Category.findOne({ slug: 'ssc-tips' });
    if (!sampleCat) {
      throw new Error('Categories not found. Run: node -r dotenv/config src/seed/categoriesSeed.js');
    }

    for (const { categorySlugs, ...postFields } of postData) {
      const categoryIds = await getCatIds(categorySlugs);
      if (categoryIds.length === 0) {
        console.warn(`⚠️  No categories found for slugs: ${categorySlugs.join(', ')} — skipping post "${postFields.title}"`);
        continue;
      }
      await upsertPost(postFields, categoryIds);
      console.log(`✓ Seeded: ${postFields.title}`);
    }

    console.log(`\n✅ Done — ${postData.length} blog posts seeded`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
