const express = require('express');
const router = express.Router();
const { evaluateCode } = require('../services/codeEvaluator');
const { updateUserProgress, getUserProgress } = require('../services/gamification');
const auth = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

/**
 * @route   GET /api/challenges
 * @desc    Get all challenges with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Build query from request query parameters
    const query = {};
    
    // Filter by difficulty if provided
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Only show active challenges by default
    if (req.query.showAll !== 'true') {
      query.active = true;
    }
    
    // Execute query
    const challenges = await Challenge.find(query)
      .select('title description difficulty points category createdAt')
      .sort({ createdAt: -1 });
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

/**
 * @route   GET /api/challenges/:id
 * @desc    Get a single challenge by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    res.json(challenge);
  } catch (error) {
    console.error(`Error fetching challenge ${req.params.id}:`, error);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

/**
 * @route   POST /api/challenges
 * @desc    Create a new challenge
 * @access  Private/Admin
 * @todo    Add authentication middleware
 */
router.post('/', async (req, res) => {
  try {
    // TODO: Validate user is authenticated and has admin role
    // For now, we're using a hardcoded user ID for development
    const userId = '60d0fe4f5311236168a109ca'; // Placeholder user ID
    
    // Create challenge
    const challenge = new Challenge({
      ...req.body,
      createdBy: userId
    });
    
    // Save to database
    await challenge.save();
    
    res.status(201).json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    
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

// @route   PUT /api/challenges/:id
// @desc    Update a challenge
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    // Update challenge properties
    challenge.title = req.body.title || challenge.title;
    challenge.description = req.body.description || challenge.description;
    challenge.difficulty = req.body.difficulty || challenge.difficulty;
    challenge.points = req.body.points || challenge.points;
    challenge.category = req.body.category || challenge.category;
    
    // Save updated challenge to database
    await challenge.save();
    
    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    
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

// @route   DELETE /api/challenges/:id
// @desc    Delete a challenge
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Submit code for a challenge
router.post('/:challengeId/submit', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const challenge = await Challenge.findById(req.params.challengeId);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Evaluate the code
    const evaluationResult = await evaluateCode({
      code,
      testCases: challenge.testCases,
      language: challenge.language
    });

    // Update user progress and get gamification results
    const progressUpdate = await updateUserProgress(
      req.user.id,
      evaluationResult,
      challenge
    );

    // Record challenge completion
    await Challenge.findByIdAndUpdate(req.params.challengeId, {
      $inc: { totalSubmissions: 1 }
    });

    res.json({
      evaluation: evaluationResult,
      progress: progressUpdate
    });

  } catch (error) {
    console.error('Error processing code submission:', error);
    res.status(500).json({ message: 'Error processing submission' });
  }
});

// Get user's progress and achievements
router.get('/progress', auth, async (req, res) => {
  try {
    const progress = await getUserProgress(req.user.id);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('username points badges stats')
      .sort({ points: -1 })
      .limit(10);

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = router; 