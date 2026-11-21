import multer from 'multer';
import { AppError } from '../utils/AppError.js';

// One CSV in the "file" form field, kept in memory as req.file.buffer
const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB is plenty for 500 questions
  fileFilter: (req, file, callback) => {
    const isCsv = file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv');
    if (!isCsv) return callback(new AppError(400, 'INVALID_FILE', 'Upload a .csv file'));
    callback(null, true);
  },
}).single('file');

export function uploadCsv(req, res, next) {
  csvUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE' ? 'The file is too large (max 2 MB)' : err.message;
      return next(new AppError(400, 'INVALID_FILE', message));
    }
    if (err) return next(err);
    if (!req.file) return next(new AppError(400, 'INVALID_FILE', 'Attach a CSV file as "file"'));
    next();
  });
}
