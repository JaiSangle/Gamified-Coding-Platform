const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please add a difficulty level'],
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    points: {
      type: Number,
      required: [true, 'Please add points value'],
      default: 100,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['programming', 'math', 'science', 'language', 'other'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    test_cases: [
      {
        input: {
          type: String,
          required: true,
        },
        expected_output: {
          type: String,
          required: true,
        },
        description: String,
        is_hidden: {
          type: Boolean,
          default: false,
        }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    }
  }
);

// Reverse populate with submissions
ChallengeSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'challenge',
  justOne: false,
});

module.exports = mongoose.model('Challenge', ChallengeSchema); 