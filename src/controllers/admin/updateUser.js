// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { User } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';

// PATCH /api/v1/admin/users/:id  (Admin)
// plan_tier lets us test Pro features before payments exist
export async function updateUser(req, res) {
  const changes = matchedData(req, { locations: ['body'] });

  if (Object.keys(changes).length === 0) {
    throw new AppError(400, 'NO_CHANGES', 'Send is_active or plan_tier to update');
  }

  // Stops the only admin from locking themselves out. ObjectIds need .equals, not ===
  if (changes.is_active === false && req.user._id.equals(req.params.id)) {
    throw new AppError(400, 'CANNOT_DEACTIVATE_SELF', "You can't deactivate your own account");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'This user was not found');

  Object.assign(user, changes);
  await user.save();

  res.json({ message: 'User updated', data: { user } });
}
