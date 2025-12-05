// backend/models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },       // e.g., DSA, JS, Angular
    questionText: { type: String, required: true },

    type: {
      type: String,
      enum: ['subjective', 'mcq'],
      default: 'subjective'
    },

    // subjective answer
    answer: { type: String },

    // MCQ fields
    options: [{ type: String }],
    correctOptionIndex: { type: Number },

    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    status: {
      type: String,
      enum: ['To Learn', 'In Progress', 'Mastered'],
      default: 'To Learn'
    },

    category: { type: String },        // JavaScript, Angular, HTML/CSS, etc.
    tags: [{ type: String }],

    resourceLink: { type: String },
    sourceType: { type: String },
    uiPattern: { type: String },
    figmaUrl: { type: String },

    lastReviewedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
