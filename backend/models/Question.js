// backend/routes/questions.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  options: [String],
  answer: String,
  tags: [String],
  topic: String,
  createdAt: { type: Date, default: Date.now }
});
const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

// list
router.get('/', async (req,res) => {
  try {
    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [{ title: new RegExp(q,'i') }, { description: new RegExp(q,'i') }, { tags: new RegExp(q,'i') }];
    }
    const questions = await Question.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(questions);
  } catch (err) { res.status(500).json({error: err.message}); }
});

// add
router.post('/', async (req,res) => {
  try { const q = new Question(req.body); await q.save(); res.status(201).json(q); }
  catch (err) { res.status(400).json({error: err.message}); }
});

module.exports = router;
