import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// The invitee uses the emailed token to create an admin account. Only the token's hash is stored.
const adminInviteSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    token_hash: { type: String, required: true },
    invited_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expires_at: { type: Date, required: true },
    accepted_at: { type: Date, default: null },
  },
  TIMESTAMPS,
);

adminInviteSchema.index({ token_hash: 1 }, { unique: true });
adminInviteSchema.index({ email: 1 });

export const AdminInvite = mongoose.model('AdminInvite', adminInviteSchema);
