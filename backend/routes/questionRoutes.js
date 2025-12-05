const express = require('express');
const Question = require('../models/Question');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET all questions (public – used by Study/Test/Admin)
router.get('/', async (req, res) => {
  try {
    const { topic, status, search, category } = req.query;
    const filter = {};

    if (topic) filter.topic = topic;
    if (status) filter.status = status;
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { questionText: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST create question (admin only)
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const question = new Question(req.body);
    const saved = await question.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// PUT update question (admin only)
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// DELETE question (admin only)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

module.exports = router;
