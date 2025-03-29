const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challenge_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide a solution'],
    },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'java', 'cpp', 'ruby', 'other'],
      default: 'javascript',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'passed', 'failed'],
      default: 'pending',
    },
    score: {
      type: Number,
      default: 0,
    },
    test_results: [{
      test_case_id: {
        type: String,
        required: true,
      },
      passed: {
        type: Boolean,
        required: true,
      },
      output: String,
      error: String,
    }],
    execution_time: {
      type: Number, // in milliseconds
      default: 0,
    },
    memory_used: {
      type: Number, // in KB
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    }
  }
);

// Create a compound index to track unique submissions per user per challenge
SubmissionSchema.index({ user_id: 1, challenge_id: 1, submittedAt: -1 });

module.exports = mongoose.model('Submission', SubmissionSchema); 