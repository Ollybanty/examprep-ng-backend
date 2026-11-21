// Creates the first admin from ADMIN_* in .env. Run once: npm run seed:admin
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/index.js';
import { ROLES } from '../src/utils/constants.js';

async function seedAdmin() {
  if (!env.adminName || !env.adminEmail || !env.adminPassword) {
    console.error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');
    process.exit(1);
  }
  if (env.adminPassword.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: env.adminEmail.toLowerCase() });
  if (existing) {
    console.log(
      `A user with ${env.adminEmail} already exists (role: ${existing.role}). Nothing changed.`,
    );
  } else {
    await User.create({
      full_name: env.adminName,
      email: env.adminEmail,
      password_hash: await bcrypt.hash(env.adminPassword, 10),
      role: ROLES.ADMIN,
      is_verified: true,
    });
    console.log(`Admin account created for ${env.adminEmail}.`);
  }

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
