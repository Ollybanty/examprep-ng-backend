// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { AppError } from '../../utils/AppError.js';
import { populateProfile } from '../../utils/populateProfile.js';

// PATCH /api/v1/users/me/settings  (Logged in)
export async function updateSettings(req, res) {
  // Only fields with a rule in settingsRules come through, so extras like role are dropped
  const settings = matchedData(req, { locations: ['body'] });

  if (Object.keys(settings).length === 0) {
    throw new AppError(400, 'NO_SETTINGS', 'Send at least one setting to update');
  }

  Object.assign(req.user, settings);
  await req.user.save();

  await populateProfile(req.user);
  res.json({ message: 'Settings updated', data: { user: req.user } });
}
