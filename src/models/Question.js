import mongoose from 'mongoose';
import {
  QUESTION_STATUS,
  QUESTION_SOURCES,
  OPTION_LABELS,
  TIMESTAMPS,
} from '../utils/constants.js';

const { Schema } = mongoose;

const optionSchema = new Schema(
  {
    label: { type: String, enum: OPTION_LABELS, required: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const questionSchema = new Schema(
  {
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', default: null }, // imported questions may not have one yet
    year: { type: Number, min: 1970, max: 2100, default: null },

    stem_text: { type: String, required: true, trim: true }, // the question itself
    options: {
      type: [optionSchema],
      validate: {
        validator: (options) => options.length >= 2 && options.length <= OPTION_LABELS.length,
        message: `A question needs between 2 and ${OPTION_LABELS.length} options`,
      },
    },
    correct_option: { type: String, enum: OPTION_LABELS, required: true },
    explanation_text: { type: String, trim: true, default: '' },

    status: { type: String, enum: Object.values(QUESTION_STATUS), default: QUESTION_STATUS.DRAFT },
    version: { type: Number, default: 1 }, // goes up each time a question is corrected
    source: {
      type: String,
      enum: Object.values(QUESTION_SOURCES),
      default: QUESTION_SOURCES.MANUAL,
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  TIMESTAMPS,
);

questionSchema.index({ status: 1, exam: 1, subject: 1, topic: 1, year: 1 });

// IMPORTANT: only runs on save()/create(). Edit questions with question.save(), never findByIdAndUpdate.
questionSchema.pre('validate', function () {
  const labels = this.options.map((option) => option.label);
  if (this.correct_option && !labels.includes(this.correct_option)) {
    this.invalidate('correct_option', 'correct_option must match one of the options');
  }

  // Content gate: no publishing without an explanation and a topic (PRD section 5)
  if (this.status === QUESTION_STATUS.PUBLISHED) {
    if (!this.explanation_text) {
      this.invalidate('explanation_text', 'A question cannot be published without an explanation');
    }
    if (!this.topic) {
      this.invalidate('topic', 'A question cannot be published without a topic');
    }
  }
});

questionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Question = mongoose.model('Question', questionSchema);
