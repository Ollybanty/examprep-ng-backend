import { User } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/token.js';
import { ROLES, TEACHER_STATUS } from '../utils/constants.js';

// Requires a logged-in, verified, active user and sets req.user
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Please log in to continue');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new AppError(
      401,
      'INVALID_TOKEN',
      'Your session is invalid or has expired. Log in again',
    );
  }

  // Reload the user so a deactivation or role change applies immediately
  const user = await User.findById(payload.sub);
  if (!user || !user.is_active) {
    throw new AppError(
      401,
      'INVALID_TOKEN',
      'Your session is invalid or has expired. Log in again',
    );
  }
  if (!user.is_verified) {
    throw new AppError(403, 'ACCOUNT_NOT_VERIFIED', 'Verify your account to continue');
  }

  req.user = user;
  next();
}

// Only the listed roles may continue. Use after requireAuth, e.g. requireRole(ROLES.ADMIN)
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have permission to do this');
    }
    next();
  };
}

// Teacher-only routes: the teacher must be approved by an admin. Use after requireAuth
export function requireApprovedTeacher(req, res, next) {
  if (req.user.role !== ROLES.TEACHER) {
    throw new AppError(403, 'FORBIDDEN', 'You do not have permission to do this');
  }
  if (req.user.teacher_status !== TEACHER_STATUS.APPROVED) {
    throw new AppError(
      403,
      'TEACHER_NOT_APPROVED',
      'Your teacher account is waiting for admin approval',
    );
  }
  next();
}
