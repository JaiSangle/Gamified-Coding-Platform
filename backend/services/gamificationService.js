const User = require('../models/User');

/**
 * Award points to a user
 * @param {string} userId - The user ID
 * @param {number} points - The points to award
 * @param {string} source - The source of the points (challenge, login, etc.)
 * @returns {Object} Updated user data
 */
exports.awardPoints = async (userId, points, source) => {
  try {
    // Find user and update score
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { score: points } },
      { new: true }
    );

    // Log point activity for analytics (would be expanded in a real implementation)
    console.log(`Awarded ${points} points to ${userId} from ${source}`);

    // Check if any badges should be awarded
    await this.checkBadgeEligibility(userId);

    return user;
  } catch (error) {
    console.error('Error awarding points:', error);
    throw new Error('Failed to award points');
  }
};

/**
 * Award a badge to a user
 * @param {string} userId - The user ID
 * @param {Object} badge - The badge details
 * @returns {Object} Updated user data
 */
exports.awardBadge = async (userId, badge) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          badges: {
            name: badge.name,
            description: badge.description,
            earnedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    console.log(`Awarded badge "${badge.name}" to ${userId}`);
    return user;
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw new Error('Failed to award badge');
  }
};

/**
 * Check if user is eligible for any badges
 * @param {string} userId - The user ID
 * @returns {boolean} Whether any badges were awarded
 */
exports.checkBadgeEligibility = async (userId) => {
  try {
    const user = await User.findById(userId);
    let badgesAwarded = false;

    // Example badge conditions
    const badgeConditions = [
      {
        name: 'First Steps',
        description: 'Complete your first challenge',
        condition: user.completedChallenges.length >= 1,
      },
      {
        name: 'Persistent Learner',
        description: 'Complete 10 challenges',
        condition: user.completedChallenges.length >= 10,
      },
      {
        name: 'Coding Master',
        description: 'Reach 1000 points',
        condition: user.score >= 1000,
      },
    ];

    // Check existing badges
    const existingBadges = user.badges.map(badge => badge.name);

    for (const badge of badgeConditions) {
      if (badge.condition && !existingBadges.includes(badge.name)) {
        await this.awardBadge(userId, badge);
        badgesAwarded = true;
      }
    }

    return badgesAwarded;
  } catch (error) {
    console.error('Error checking badge eligibility:', error);
    throw new Error('Failed to check badges');
  }
};

/**
 * Get a user's level based on points
 * @param {number} points - The user's points
 * @returns {Object} Level data
 */
exports.getUserLevel = (points) => {
  // Define level thresholds
  const levels = [
    { level: 1, threshold: 0, title: 'Novice' },
    { level: 2, threshold: 100, title: 'Beginner' },
    { level: 3, threshold: 300, title: 'Apprentice' },
    { level: 4, threshold: 600, title: 'Advanced' },
    { level: 5, threshold: 1000, title: 'Expert' },
    { level: 6, threshold: 1500, title: 'Master' },
    { level: 7, threshold: 2500, title: 'Grandmaster' },
    { level: 8, threshold: 4000, title: 'Legend' },
  ];

  // Find user's level
  let userLevel = levels[0];
  for (const level of levels) {
    if (points >= level.threshold) {
      userLevel = level;
    } else {
      break;
    }
  }

  // Calculate progress to next level
  const nextLevel = levels.find(level => level.level === userLevel.level + 1);
  let progressToNext = 100;
  let pointsToNext = 0;
  
  if (nextLevel) {
    pointsToNext = nextLevel.threshold - points;
    progressToNext = Math.floor(
      ((points - userLevel.threshold) / (nextLevel.threshold - userLevel.threshold)) * 100
    );
  }

  return {
    ...userLevel,
    progressToNext,
    pointsToNext,
  };
}; 