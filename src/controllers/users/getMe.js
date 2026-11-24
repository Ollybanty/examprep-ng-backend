// to be handled by: Oladele Ogunyemi
import { populateProfile } from '../../utils/populateProfile.js';

// GET /api/v1/users/me  (Logged in)
export async function getMe(req, res) {
  await populateProfile(req.user);
  res.json({ data: { user: req.user } });
}
