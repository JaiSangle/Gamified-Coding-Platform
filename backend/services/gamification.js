const mongoose = require('mongoose');
const logger = require('./logger');

// Define badge types and their requirements
const BADGES = {
  FIRST_CHALLENGE: {
    id: 'first_challenge',
    name: 'First Challenge',
    description: 'Completed your first coding challenge',
    points: 50
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Achieved 100% on a challenge',
    points: 100
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Completed a challenge in under 2 seconds',
    points: 75
  },
  CHALLENGE_MASTER: {
    id: 'challenge_master',
    name: 'Challenge Master',
    description: 'Completed 10 challenges',
    points: 200
  },
  ACCURACY_KING: {
    id: 'accuracy_king',
    name: 'Accuracy King',
    description: 'Maintained 90%+ accuracy across 5 challenges',
    points: 150
  }
};

/**
 * Updates user points and badges based on challenge completion
 * 
 * @param {string} userId - MongoDB user ID
 * @param {Object} challengeResult - Result from code evaluation
 * @param {Object} challenge - Challenge details
 * @returns {Promise<Object>} Updated user stats
 */
async function updateUserProgress(userId, challengeResult, challenge) {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate points for this attempt
    const pointsEarned = calculatePoints(challengeResult, challenge);
    
    // Update user's total points
    user.points += pointsEarned;
    
    // Update challenge completion stats
    user.stats.challengesCompleted++;
    user.stats.totalAttempts++;
    
    // Update accuracy stats
    if (challengeResult.status === 'pass') {
      user.stats.successfulAttempts++;
      user.stats.currentAccuracy = calculateAccuracy(user.stats);
    }

    // Check and award new badges
    const newBadges = await checkAndAwardBadges(user, challengeResult, challenge);
    user.badges = [...new Set([...user.badges, ...newBadges])];

    // Update user record
    await user.save();

    logger.info('User progress updated', {
      userId,
      pointsEarned,
      newBadges,
      totalPoints: user.points,
      accuracy: user.stats.currentAccuracy
    });

    return {
      pointsEarned,
      newBadges,
      totalPoints: user.points,
      stats: user.stats
    };

  } catch (error) {
    logger.error('Error updating user progress:', error);
    throw error;
  }
}

/**
 * Calculates points earned for a challenge attempt
 * 
 * @param {Object} challengeResult - Result from code evaluation
 * @param {Object} challenge - Challenge details
 * @returns {number} Points earned
 */
function calculatePoints(challengeResult, challenge) {
  let points = 0;
  
  // Base points for completion
  if (challengeResult.status === 'pass') {
    points += challenge.basePoints || 50;
  }

  // Bonus points for perfect score
  if (challengeResult.score === 100) {
    points += BADGES.PERFECT_SCORE.points;
  }

  // Speed bonus
  if (challengeResult.executionTime < 2) {
    points += BADGES.SPEED_DEMON.points;
  }

  return points;
}

/**
 * Checks and awards new badges based on user progress
 * 
 * @param {Object} user - User document
 * @param {Object} challengeResult - Result from code evaluation
 * @param {Object} challenge - Challenge details
 * @returns {Promise<string[]>} Array of newly awarded badge IDs
 */
async function checkAndAwardBadges(user, challengeResult, challenge) {
  const newBadges = [];

  // First challenge badge
  if (user.stats.challengesCompleted === 1) {
    newBadges.push(BADGES.FIRST_CHALLENGE.id);
  }

  // Perfect score badge
  if (challengeResult.score === 100) {
    newBadges.push(BADGES.PERFECT_SCORE.id);
  }

  // Speed demon badge
  if (challengeResult.executionTime < 2) {
    newBadges.push(BADGES.SPEED_DEMON.id);
  }

  // Challenge master badge
  if (user.stats.challengesCompleted === 10) {
    newBadges.push(BADGES.CHALLENGE_MASTER.id);
  }

  // Accuracy king badge
  if (user.stats.currentAccuracy >= 90 && user.stats.challengesCompleted >= 5) {
    newBadges.push(BADGES.ACCURACY_KING.id);
  }

  return newBadges;
}

/**
 * Calculates user's current accuracy
 * 
 * @param {Object} stats - User statistics
 * @returns {number} Accuracy percentage
 */
function calculateAccuracy(stats) {
  if (stats.totalAttempts === 0) return 0;
  return Math.round((stats.successfulAttempts / stats.totalAttempts) * 100);
}

/**
 * Gets user's current progress and achievements
 * 
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Object>} User progress and achievements
 */
async function getUserProgress(userId) {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      points: user.points,
      badges: user.badges.map(badgeId => BADGES[badgeId.toUpperCase()]),
      stats: user.stats,
      rank: await calculateUserRank(userId)
    };
  } catch (error) {
    logger.error('Error getting user progress:', error);
    throw error;
  }
}

/**
 * Calculates user's current rank based on points
 * 
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<number>} User's rank
 */
async function calculateUserRank(userId) {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const rank = await User.countDocuments({
      points: { $gt: user.points }
    }) + 1;

    return rank;
  } catch (error) {
    logger.error('Error calculating user rank:', error);
    throw error;
  }
}

module.exports = {
  updateUserProgress,
  getUserProgress,
  BADGES
}; 