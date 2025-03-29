const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const { generateHint, getFallbackHint } = require('../services/aiHints');

/**
 * @route   POST /api/hints
 * @desc    Get a hint for a challenge
 * @access  Private
 * @todo    Add authentication middleware
 */
router.post('/', async (req, res) => {
  try {
    const { challenge_id, code, hint_level } = req.body;
    
    // Validate input
    if (!challenge_id) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a challenge_id'
      });
    }
    
    // Find the challenge
    const challenge = await Challenge.findById(challenge_id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    // Default hint level to 1 if not provided or invalid
    const hintLevel = hint_level && [1, 2, 3].includes(parseInt(hint_level)) 
      ? parseInt(hint_level) 
      : 1;
    
    try {
      // Generate a hint using OpenAI
      const hint = await generateHint({
        challengeDescription: `${challenge.title}: ${challenge.description}`,
        userCode: code || '',
        difficulty: challenge.difficulty,
        language: req.body.language || 'javascript',
        hintLevel
      });
      
      // Return the generated hint
      res.json({
        success: true,
        data: {
          hint,
          level: hintLevel
        }
      });
    } catch (error) {
      console.warn('Failed to generate AI hint, using fallback:', error.message);
      
      // If AI generation fails, use fallback hints
      const fallbackHint = getFallbackHint({
        difficulty: challenge.difficulty,
        hintLevel
      });
      
      res.json({
        success: true,
        data: {
          hint: fallbackHint,
          level: hintLevel,
          is_fallback: true
        }
      });
    }
  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hint'
    });
  }
});

module.exports = router; 