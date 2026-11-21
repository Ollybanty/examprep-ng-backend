import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

// Formats every error as { error: { code, message } }. Express 5 forwards async errors here, so no try/catch.
export function errorHandler(err, req, res, next) {
  // Invalid JSON body
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 400, 'INVALID_JSON', 'Your JSON is not valid');
  }

  // Body over the limit set in app.js
  if (err.type === 'entity.too.large') {
    return sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'Request body is too large');
  }

  // Errors we threw on purpose
  if (err instanceof AppError) {
    return sendError(res, err.status, err.code, err.message);
  }

  // A Mongoose schema rule failed
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return sendError(res, 400, 'VALIDATION_ERROR', message);
  }

  // Invalid MongoDB id, e.g. /questions/abc
  if (err instanceof mongoose.Error.CastError) {
    return sendError(res, 400, 'INVALID_ID', `Invalid ${err.path}`);
  }

  // A unique value already exists, e.g. a registered email
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    return sendError(res, 409, 'DUPLICATE_VALUE', `This ${field} is already in use`);
  }

  // Anything else is a bug: log it and hide the details from the client
  console.error(err);
  return sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong on the server');
}

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}
