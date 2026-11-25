import mongoose from 'mongoose';
import { env } from './env.js';




export async function connectDB() {
  await mongoose.connect(env.mongodbUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

// readyState 1 = connected
export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}
