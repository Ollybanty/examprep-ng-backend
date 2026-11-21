// DEVELOPMENT ONLY: creates one test account per role (password: Password123!) and prints their tokens.
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/index.js';
import { ROLES, TEACHER_STATUS } from '../src/utils/constants.js';
import { signToken } from '../src/utils/token.js';

const PASSWORD = 'Password123!';

const ACCOUNTS = [
  { full_name: 'Test Student', email: 'student@test.local', role: ROLES.STUDENT },
  {
    full_name: 'Test Teacher',
    email: 'teacher@test.local',
    role: ROLES.TEACHER,
    teacher_status: TEACHER_STATUS.APPROVED,
  },
  {
    full_name: 'Pending Teacher',
    email: 'pending.teacher@test.local',
    role: ROLES.TEACHER,
    teacher_status: TEACHER_STATUS.PENDING,
  },
  { full_name: 'Test Admin', email: 'admin@test.local', role: ROLES.ADMIN },
];

async function seedDevUsers() {
  if (env.nodeEnv === 'production') {
    console.error('Refusing to create test accounts in production.');
    process.exit(1);
  }

  await connectDB();
  const password_hash = await bcrypt.hash(PASSWORD, 10);

  console.log(`\nTest accounts (password: ${PASSWORD})\n`);
  for (const account of ACCOUNTS) {
    const user = await User.findOneAndUpdate(
      { email: account.email },
      { ...account, password_hash, is_verified: true, is_active: true },
      { upsert: true, returnDocument: 'after', runValidators: true },
    );
    console.log(`${account.email}\n  Bearer ${signToken(user)}\n`);
  }

  await mongoose.disconnect();
}

seedDevUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
