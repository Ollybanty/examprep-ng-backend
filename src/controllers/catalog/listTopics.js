// to be handled by: Taiwo Ganiyu
import mongoose from 'mongoose';
import { notImplemented } from '../../utils/notImplemented.js';
import { Topic, Subject } from '../../models/index.js';

// GET /api/v1/topics
// Access: Logged in
//
// Task: List the topics in a subject.
//
// Rules:
//   - Query: ?subject=<subject id> (required, 400 if missing).
//   - Only is_active topics, sorted by name.
//
// Spec: Tech Doc B2.1
export async function listTopics(req, res) {
  const {subject, parent } = req.query;
  const filter = {
    is_active: true
  };
  
  if(subject){
    let selectedSubject;

    if (mongoose.isValidObjectId(subject)){
      selectedSubject = await Subject.findOne({
        _id: subject,
        is_active: true
    });
    } else{
      selectedSubject = await Subject.findOne({
        code: subject.toLowerCase(),
        is_active: true
      });
    }
    filter.subject = selectedSubject._id;
  }

  if(parent ==="true"){
    filter.parentTopic = {$ne: null};
  }
  if(parent === "false"){
    filter.parentTopic = null;
  }

  const topics = await Topic.find(filter)
  .select("name subject description")
  .populate("subject", "name code")
  .sort({name: 1});
  return res.status(200).json({
    data: topics
  });
}

