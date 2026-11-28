// to be handled by: Oladele Ogunyemi
import mongoose from 'mongoose';
import { matchedData } from 'express-validator';
import { Question } from '../../models/index.js';
import { QUESTION_STATUS } from '../../utils/constants.js';

const { ObjectId } = mongoose.Types;

// GET /api/v1/years?exam_id=...&subject_id=...&topic_id=...   (Logged in)
// Years with published questions, newest first, with a count so the app can hide thin years
export async function listYears(req, res) {
  const { exam_id, subject_id, topic_id } = matchedData(req, { locations: ['query'] });

  // Aggregates don't cast strings to ObjectIds like find() does
  const match = {
    status: QUESTION_STATUS.PUBLISHED,
    exam: new ObjectId(exam_id),
    subject: new ObjectId(subject_id),
    year: { $ne: null },
  };
  if (topic_id) match.topic = new ObjectId(topic_id);

  const rows = await Question.aggregate([
    { $match: match },
    { $group: { _id: '$year', question_count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
    // '$question_count' rather than 1 keeps year first
    { $project: { _id: 0, year: '$_id', question_count: '$question_count' } },
  ]);

  // An unknown exam or subject gives [] rather than a 404
  res.json({ data: rows });
}
