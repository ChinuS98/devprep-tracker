// backend/routes/questions.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// simple Question schema (adjust fields to match your model)
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

// GET /api/questions  -> list questions (with optional query filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') }
      ];
    }

    const questions = await Question.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(questions);
  } catch (err) {
    console.error('GET /api/questions error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// POST /api/questions -> create a question (admin)
router.post('/', async (req, res) => {
  try {
    const q = new Question(req.body);
    await q.save();
    res.status(201).json(q);
  } catch (err) {
    console.error('POST /api/questions error:', err);
    res.status(400).json({ error: err.message || 'Bad request' });
  }
});

// GET single question
router.get('/:id', async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Not found' });
    res.json(q);
  } catch (err) {
    console.error('GET /api/questions/:id error:', err);
    res.status(400).json({ error: err.message || 'Bad request' });
  }
});

// PUT /api/questions/:id -> update
router.put('/:id', async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ error: 'Not found' });
    res.json(q);
  } catch (err) {
    console.error('PUT /api/questions/:id error:', err);
    res.status(400).json({ error: err.message || 'Bad request' });
  }
});

// DELETE /api/questions/:id
router.delete('/:id', async (req, res) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/questions/:id error:', err);
    res.status(400).json({ error: err.message || 'Bad request' });
  }
});

module.exports = router;
