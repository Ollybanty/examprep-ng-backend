// Thrown on purpose, e.g. throw new AppError(404, 'QUESTION_NOT_FOUND', 'Question not found')
export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
