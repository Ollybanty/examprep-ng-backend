// Creates or updates the exams, subjects and topics. Safe to re-run.
import mongoose from 'mongoose';
import '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { Exam, Subject, Topic } from '../src/models/index.js';

// CBT mock length per subject (to confirm with the team): JAMB 40 questions/30 min, WAEC 50 questions/60 min
const EXAMS = [
  { code: 'JAMB', name: 'JAMB (UTME)', cbt_question_count: 40, cbt_duration_minutes: 30 },
  { code: 'WAEC', name: 'WAEC (WASSCE)', cbt_question_count: 50, cbt_duration_minutes: 60 },
];

// Based on the JAMB and WAEC syllabuses
const SUBJECTS = {
  english: {
    name: 'English Language',
    topics: [
      'Comprehension',
      'Summary',
      'Lexis and Structure',
      'Synonyms',
      'Antonyms',
      'Sentence Completion',
      'Concord (Subject-Verb Agreement)',
      'Tenses',
      'Idioms and Figurative Expressions',
      'Vowels and Consonants',
      'Stress and Intonation',
      'Rhymes',
    ],
  },
  mathematics: {
    name: 'Mathematics',
    topics: [
      'Number Bases',
      'Fractions, Decimals and Approximations',
      'Indices and Logarithms',
      'Surds',
      'Sets',
      'Variation',
      'Linear Equations',
      'Quadratic Equations',
      'Inequalities',
      'Sequences and Series',
      'Matrices and Determinants',
      'Mensuration',
      'Trigonometry',
      'Coordinate Geometry',
      'Differentiation',
      'Integration',
      'Statistics',
      'Probability',
    ],
  },
  physics: {
    name: 'Physics',
    topics: [
      'Measurements and Units',
      'Motion',
      "Newton's Laws of Motion",
      'Work, Energy and Power',
      'Equilibrium of Forces',
      'Simple Harmonic Motion',
      'Pressure',
      'Heat and Temperature',
      'Gas Laws',
      'Waves',
      'Light (Reflection and Refraction)',
      'Sound',
      'Electrostatics',
      'Current Electricity',
      'Magnetism and Electromagnetic Induction',
      'Modern Physics',
    ],
  },
  chemistry: {
    name: 'Chemistry',
    topics: [
      'Separation of Mixtures',
      'Atomic Structure',
      'Periodic Table',
      'Chemical Bonding',
      'Stoichiometry and the Mole Concept',
      'Gas Laws',
      'Acids, Bases and Salts',
      'Oxidation and Reduction',
      'Electrolysis',
      'Chemical Equilibrium',
      'Rates of Reaction',
      'Energy Changes',
      'Metals and their Compounds',
      'Non-metals and their Compounds',
      'Organic Chemistry',
      'Water and Solutions',
    ],
  },
  biology: {
    name: 'Biology',
    topics: [
      'Living Things and Classification',
      'Cell Structure and Function',
      'Nutrition',
      'Transport in Plants and Animals',
      'Respiration',
      'Excretion',
      'Support and Movement',
      'Reproduction',
      'Growth and Development',
      'Coordination and the Nervous System',
      'Ecology',
      'Genetics and Heredity',
      'Evolution',
      'Diseases and Health',
    ],
  },
  economics: {
    name: 'Economics',
    topics: [
      'Basic Concepts of Economics',
      'Economic Systems',
      'Demand and Supply',
      'Elasticity',
      'Theory of Production',
      'Cost and Revenue',
      'Market Structures',
      'National Income',
      'Money and Inflation',
      'Financial Institutions',
      'Public Finance',
      'International Trade',
      'Population and Labour',
      'Agriculture and Industry in Nigeria',
      'Economic Development and Planning',
    ],
  },
};

async function seedTaxonomy() {
  await connectDB();

  const examIds = [];
  for (const exam of EXAMS) {
    const doc = await Exam.findOneAndUpdate({ code: exam.code }, exam, {
      upsert: true,
      returnDocument: 'after',
      runValidators: true,
    });
    examIds.push(doc._id);
  }
  console.log(`Exams: ${EXAMS.map((e) => e.code).join(', ')}`);

  // All 6 MVP subjects are offered by both JAMB and WAEC
  let topicCount = 0;
  for (const [code, { name, topics }] of Object.entries(SUBJECTS)) {
    const subject = await Subject.findOneAndUpdate(
      { code },
      { code, name, exams: examIds },
      { upsert: true, returnDocument: 'after', runValidators: true },
    );
    for (const topicName of topics) {
      await Topic.updateOne(
        { subject: subject._id, name: topicName },
        { $setOnInsert: { subject: subject._id, name: topicName } },
        { upsert: true },
      );
      topicCount += 1;
    }
  }
  console.log(`Subjects: ${Object.keys(SUBJECTS).length}, topics: ${topicCount}`);

  await mongoose.disconnect();
}

seedTaxonomy().catch((err) => {
  console.error(err);
  process.exit(1);
});
