const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

/**
 * @route   POST /api/submissions
 * @desc    Submit code for evaluation
 * @access  Private
 * @todo    Add authentication middleware
 */
router.post('/', async (req, res) => {
  try {
    const { challenge_id, code, language } = req.body;

    // Validate required fields
    if (!challenge_id || !code) {
      return res.status(400).json({
        success: false,
        error: 'Please provide challenge_id and code'
      });
    }

    // TODO: Get authenticated user
    // For now, using a placeholder user ID
    const user_id = '60d0fe4f5311236168a109ca';

    // Check if challenge exists
    const challenge = await Challenge.findById(challenge_id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Create submission object
    const submission = new Submission({
      user_id,
      challenge_id,
      code,
      language: language || 'javascript',
      status: 'pending', // Initially marked as pending
    });

    // Save submission to database
    await submission.save();

    // Execute code evaluation (mock implementation for now)
    const testResults = await evaluateSubmission(submission, challenge);
    
    // Update submission with results
    submission.status = testResults.allPassed ? 'passed' : 'failed';
    submission.score = testResults.score;
    submission.test_results = testResults.results;
    submission.execution_time = testResults.executionTime;
    submission.feedback = testResults.feedback;
    
    // Save updated submission
    await submission.save();

    // If submission passed, update user points
    if (submission.status === 'passed') {
      await User.findByIdAndUpdate(
        user_id,
        { $inc: { points: challenge.points } }
      );
    }

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

/**
 * @route   GET /api/submissions/user/:userId
 * @desc    Get submissions for a specific user
 * @access  Private
 * @todo    Add authentication middleware to verify user has access
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: Verify authenticated user has access to these submissions
    
    const submissions = await Submission.find({ user_id: userId })
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

/**
 * @route   GET /api/submissions/challenge/:challengeId
 * @desc    Get submissions for a specific challenge
 * @access  Private/Admin
 * @todo    Add authentication middleware to verify admin role
 */
router.get('/challenge/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;
    
    // TODO: Verify authenticated user has admin access
    
    const submissions = await Submission.find({ challenge_id: challengeId })
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching challenge submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

/**
 * Mock implementation of code evaluation
 * In a real app, this would use a sandbox environment or connect to an execution service
 * @param {Object} submission - The submission object
 * @param {Object} challenge - The challenge object
 * @returns {Object} Evaluation results
 */
async function evaluateSubmission(submission, challenge) {
  // Mock execution delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock test results
  const results = challenge.test_cases.map((testCase, index) => {
    // Mock check if code would pass this test case
    // This is where you'd actually execute the code against test cases
    const passed = Math.random() > 0.3; // 70% chance of passing for mock purposes
    
    return {
      test_case_id: `${challenge._id}_test_${index}`,
      passed,
      output: passed ? testCase.expected_output : 'Mock incorrect output',
      error: passed ? null : 'Mock error message'
    };
  });
  
  // Calculate overall results
  const passedCount = results.filter(r => r.passed).length;
  const allPassed = passedCount === results.length;
  
  // Calculate score based on pass percentage
  const score = Math.round((passedCount / results.length) * challenge.points);
  
  // Generate feedback
  let feedback = '';
  if (allPassed) {
    feedback = 'Great job! All test cases passed.';
  } else {
    feedback = `You've passed ${passedCount} out of ${results.length} test cases. Keep trying!`;
  }
  
  return {
    results,
    allPassed,
    score,
    executionTime: Math.floor(Math.random() * 1000), // Mock execution time in ms
    feedback
  };
}

module.exports = router; 