// Swaps the exam and subject ids on a user for their name and code
export function populateProfile(user) {
  return user.populate([
    { path: 'target_exam', select: 'name code' },
    { path: 'selected_subjects', select: 'name code' },
  ]);
}
