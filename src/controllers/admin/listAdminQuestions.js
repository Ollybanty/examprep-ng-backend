// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';
import {Exam, Subject, Topic, Question} from "../../models/index.js"
// GET /api/v1/admin/questions
// Access: Admin
//
// Task: List all questions (any status) for the admin panel.
//
// Rules:
//   - Query: status, exam, subject, topic, year, search (in stem_text), page, limit.
//   - Admins DO see correct_option and explanation_text.
//
// Spec: Tech Doc B3 (Admin CMS)
export async function listAdminQuestions(req, res) {
    const{
    exam_id, subject_id, topic_id, year, status, 
    page = 1, limit =10} = req.query;

      const currentPage = Number(page);
      const pageSize = Number(limit);

      const filter ={};

      if(exam_id) {
        filter.exam = exam_id;
      }

      if(subject_id){
        filter.subject = subject_id;
      }

      if(topic_id){
        filter.topic =topic_id;
      }

      if(year !== undefined){
        filter.year = Number(year);
      }

      if(status){
        filter.status =status;
      }

      const skip = (currentPage -1) * pageSize;

      const[questions, totalQuestions] = await Promise.all([
        Question.find(filter)
        .populate("exam", "name code")
        .populate("subject", "name code")
        .populate("topic", "name slug")
        .sort({created_at: -1})
        .skip(skip)
        .limit(pageSize),

        Question.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalQuestions / pageSize);
      
      return res.status(200).json({
        success: true,
        count: questions.length,
        data: questions
      });
    } 