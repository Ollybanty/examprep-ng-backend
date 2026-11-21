import mongoose from 'mongoose';
import { OTP_PURPOSES, TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// Account verification and password reset codes. Only the code's hash is stored.
const otpSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    purpose: { type: String, enum: Object.values(OTP_PURPOSES), required: true },
    code_hash: { type: String, required: true },
    expires_at: { type: Date, required: true },
    attempts: { type: Number, default: 0 }, // wrong guesses so far (max RULES.OTP_MAX_ATTEMPTS)
  },
  TIMESTAMPS,
);

// MongoDB deletes the document automatically once expires_at has passed (TTL index)
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ user: 1, purpose: 1 });

export const Otp = mongoose.model('Otp', otpSchema);
