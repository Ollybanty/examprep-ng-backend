// to be handled by:
// Shared by register, verifyOtp, resendOtp, forgotPassword and resetPassword.

// Create a new OTP for a user and return the plain 6-digit code (to put in the email).
//   - Generate the code with crypto.randomInt(0, 1_000_000), padded to 6 digits.
//   - Delete the user's older OTPs with the same purpose.
//   - Save only the bcryptjs hash of the code, with expires_at = now + RULES.OTP_EXPIRY_MINUTES.
export async function createOtp(userId, purpose) {
  throw new Error('createOtp is not implemented yet');
}

// Check a code. Returns true if correct, false if wrong.
//   - Find the user's OTP for this purpose that hasn't expired.
//   - Wrong code: increase attempts; once attempts reach RULES.OTP_MAX_ATTEMPTS, delete the OTP.
//   - Right code: delete the OTP (a code can only be used once).
export async function checkOtp(userId, purpose, code) {
  throw new Error('checkOtp is not implemented yet');
}
