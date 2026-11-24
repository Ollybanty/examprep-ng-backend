// DEVELOPMENT ONLY: adds published sample questions so sessions can be tested before Block 2 exists.
// Every question starts with "[Sample]". Running it again replaces them. Run seed:taxonomy first.
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { Exam, Subject, Topic, Question } from '../src/models/index.js';
import { OPTION_LABELS, QUESTION_STATUS } from '../src/utils/constants.js';

// Each maker returns { stem, answer, wrong: [3 wrong answers], explanation } for question number i
const MATHS = {
  'Number Bases': (i) => {
    const n = 5 + i * 3;
    return {
      stem: `Convert ${n.toString(2)} (base 2) to base 10.`,
      answer: `${n}`,
      wrong: [`${n + 1}`, `${n - 1}`, `${n + 2}`],
      explanation: `Add the place values of each 1 in ${n.toString(2)}, which gives ${n}.`,
    };
  },
  'Indices and Logarithms': (i) => {
    const a = i + 2;
    const b = (i % 3) + 2;
    return {
      stem: `Simplify 2^${a} × 2^${b}.`,
      answer: `2^${a + b}`,
      wrong: [`2^${a * b}`, `4^${a + b}`, `2^${Math.abs(a - b) + 1}`],
      explanation: `When multiplying powers of the same base, add the indices: ${a} + ${b} = ${a + b}.`,
    };
  },
  'Linear Equations': (i) => {
    const x = i + 2;
    const a = (i % 4) + 2;
    const b = i + 1;
    return {
      stem: `Solve for x: ${a}x + ${b} = ${a * x + b}.`,
      answer: `x = ${x}`,
      wrong: [`x = ${x + 1}`, `x = ${x - 1}`, `x = ${x + 2}`],
      explanation: `Subtract ${b} from both sides to get ${a}x = ${a * x}, then divide by ${a}: x = ${x}.`,
    };
  },
  'Quadratic Equations': (i) => {
    const p = i + 1;
    const q = i + 3;
    return {
      stem: `Find the roots of x² − ${p + q}x + ${p * q} = 0.`,
      answer: `x = ${p} or x = ${q}`,
      wrong: [`x = −${p} or x = −${q}`, `x = ${p} or x = −${q}`, `x = ${p + 1} or x = ${q + 1}`],
      explanation: `${p} and ${q} add up to ${p + q} and multiply to ${p * q}, so (x − ${p})(x − ${q}) = 0.`,
    };
  },
  Statistics: (i) => {
    const values = [i + 2, i + 4, i + 6, i + 8, i + 10];
    const mean = i + 6;
    return {
      stem: `Find the mean of ${values.join(', ')}.`,
      answer: `${mean}`,
      wrong: [`${mean + 1}`, `${mean - 1}`, `${mean + 2}`],
      explanation: `The total is ${mean * 5}, and ${mean * 5} ÷ 5 = ${mean}.`,
    };
  },
  Probability: (i) => {
    const red = i + 2;
    const blue = i + 5;
    const total = red + blue;
    return {
      stem: `A bag has ${red} red balls and ${blue} blue balls. One ball is picked at random. What is the probability that it is red?`,
      answer: `${red}/${total}`,
      wrong: [`${blue}/${total}`, `${red}/${blue}`, `1/${total}`],
      explanation: `There are ${red} red balls out of ${total} in total, so the probability is ${red}/${total}.`,
    };
  },
};

const PHYSICS = {
  Motion: (i) => {
    const distance = (i + 2) * 10;
    const time = i + 2;
    return {
      stem: `A car travels ${distance} m in ${time} s at a steady speed. What is its speed?`,
      answer: '10 m/s',
      wrong: [`${distance * time} m/s`, `${time} m/s`, '20 m/s'],
      explanation: `Speed = distance ÷ time = ${distance} ÷ ${time} = 10 m/s.`,
    };
  },
};

// Puts the correct answer in a different position each time, so it isn't always A
function buildOptions(made, i) {
  const texts = [...made.wrong];
  const correctIndex = i % OPTION_LABELS.length;
  texts.splice(correctIndex, 0, made.answer);
  return {
    options: texts.map((text, index) => ({ label: OPTION_LABELS[index], text })),
    correct_option: OPTION_LABELS[correctIndex],
  };
}

async function addQuestions(exam, subject, makers, perTopic) {
  const docs = [];
  for (const [topicName, make] of Object.entries(makers)) {
    const topic = await Topic.findOne({ subject: subject._id, name: topicName });
    if (!topic) throw new Error(`Topic "${topicName}" not found. Run npm run seed:taxonomy first.`);

    for (let i = 0; i < perTopic; i++) {
      const made = make(i);
      docs.push({
        exam: exam._id,
        subject: subject._id,
        topic: topic._id,
        year: 2015 + (i % 10),
        stem_text: `[Sample] ${made.stem}`,
        ...buildOptions(made, i),
        explanation_text: made.explanation,
        status: QUESTION_STATUS.PUBLISHED,
      });
    }
  }
  await Question.insertMany(docs);
  return docs.length;
}

async function seedDevQuestions() {
  if (env.nodeEnv === 'production') {
    console.error('Refusing to add sample questions in production.');
    process.exit(1);
  }

  await connectDB();

  const [jamb, waec] = await Promise.all([
    Exam.findOne({ code: 'JAMB' }),
    Exam.findOne({ code: 'WAEC' }),
  ]);
  const [maths, physics] = await Promise.all([
    Subject.findOne({ code: 'mathematics' }),
    Subject.findOne({ code: 'physics' }),
  ]);
  if (!jamb || !waec || !maths || !physics) {
    throw new Error('Exams or subjects missing. Run npm run seed:taxonomy first.');
  }

  const removed = await Question.deleteMany({ stem_text: /^\[Sample\]/ });

  // 6 topics × 10 = 60 Mathematics questions per exam: enough for a JAMB (40) or WAEC (50) mock.
  // Only 8 Physics questions, so a Physics mock shows the "not enough questions" error.
  const jambMaths = await addQuestions(jamb, maths, MATHS, 10);
  const waecMaths = await addQuestions(waec, maths, MATHS, 10);
  const jambPhysics = await addQuestions(jamb, physics, PHYSICS, 8);

  console.log(`Removed ${removed.deletedCount} old sample questions.`);
  console.log(
    `Added: JAMB Mathematics ${jambMaths}, WAEC Mathematics ${waecMaths}, JAMB Physics ${jambPhysics}`,
  );
  await mongoose.disconnect();
}

seedDevQuestions().catch((err) => {
  console.error(err);
  process.exit(1);
});
