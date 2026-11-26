// to be handled by: Taiwo Ganiyu
import { Exam } from '../../models/Exam.js';
// GET /api/v1/exams
// Access: Logged in
//
// Task: List the active exams (JAMB, WAEC).
//
// Rules:
//   - Only is_active exams. Return name, code, cbt_duration_minutes, cbt_question_count.
//
// Spec: PRD (Target Exams)

 const listExams = async (req, res, next) =>{
   try{
     const exams = await Exam.find({
       is_active: true
     })
     .select("name code cbt_duration_minutes cbt_question_count is_active")
     .sort({name: 1});
    
     return res.status(200).json({
       success: true,
       count:exams.length,
       data: exams
     });

   }catch(error){
     next(error)
   }
 };

export default listExams;
