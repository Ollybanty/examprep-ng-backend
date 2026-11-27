// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';
import mongoose from 'mongoose';
import { Exam, Subject, Topic, Question } from '../../models/index.js';
//import { text } from 'express';
// POST /api/v1/admin/questions
// Access: Admin
//
// Task: Create one question.
//
// Rules:
//   - Body: exam_id, subject_id, topic_id, year, stem_text, options [{label, text}], correct_option, explanation_text.
//   - Saved as "draft" with source "manual" and created_by = req.user._id.
//   - The model already checks correct_option matches an option.
//
// Spec: Tech Doc B3 (Admin CMS)
export const createQuestion =  async (req, res) => {
    const{
    exam_id, subject_id, topic_id, year, stem_text, 
    options, correct_option, explanation_text, status, source
  } = req.body;
  

  const selectedExam = await Exam.findById(exam_id);

  const selectedSubject = await Subject.findById(subject_id);

  if(topic_id){
    const selectedTopic = await Topic.findOne({
      _id: topic_id,
      subject: subject_id
    });
  }
    // create question document
    const question = new Question({
      exam: exam_id,
      subject: subject_id,
      topic: topic_id || null,
      year: year ?? null,
      stem_text, 
      options,
      correct_option,
      explanation_text,
      status,
      source,
      created_by: req.user._id
    });
    await question.save();
    return res.status(201).json({
      message:"Question created successfully",
      data: question
    });
  };