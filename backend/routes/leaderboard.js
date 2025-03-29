const express = require('express');
const router = express.Router();
const User = require('../models/User');
const logger = require('../services/logger');

/**
 * @route   GET /api/leaderboard
 * @desc    Get paginated leaderboard of users sorted by points
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters'
      });
    }

    // Get total count of users for pagination
    const totalUsers = await User.countDocuments();

    // Get paginated users sorted by points
    const users = await User.find()
      .select('username points badges stats')
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Add rank to each user
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1
    }));

    logger.info('Leaderboard fetched successfully', {
      page,
      limit,
      totalUsers,
      totalPages
    });

    res.json({
      success: true,
      data: {
        users: rankedUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching leaderboard'
    });
  }
});

/**
 * @route   GET /api/leaderboard/top
 * @desc    Get top N users by points
 * @access  Public
 */
router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Validate limit parameter
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit parameter'
      });
    }

    const topUsers = await User.find()
      .select('username points badges stats')
      .sort({ points: -1 })
      .limit(limit)
      .lean();

    // Add rank to each user
    const rankedUsers = topUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    logger.info('Top users fetched successfully', { limit });

    res.json({
      success: true,
      data: rankedUsers
    });

  } catch (error) {
    logger.error('Error fetching top users:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching top users'
    });
  }
});

/**
 * @route   GET /api/leaderboard/user/:userId
 * @desc    Get user's rank and surrounding users
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const contextSize = 2; // Number of users to show before and after

    // Find user and their rank
    const user = await User.findById(userId)
      .select('username points badges stats')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's rank
    const userRank = await User.countDocuments({
      points: { $gt: user.points }
    }) + 1;

    // Get surrounding users
    const surroundingUsers = await User.find({
      points: { $lte: user.points }
    })
      .select('username points badges stats')
      .sort({ points: -1 })
      .limit(contextSize * 2 + 1)
      .lean();

    // Add ranks to surrounding users
    const rankedSurroundingUsers = surroundingUsers.map((u, index) => ({
      ...u,
      rank: userRank - contextSize + index
    }));

    logger.info('User rank context fetched successfully', {
      userId,
      userRank,
      contextSize
    });

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          rank: userRank
        },
        surroundingUsers: rankedSurroundingUsers
      }
    });

  } catch (error) {
    logger.error('Error fetching user rank context:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user rank context'
    });
  }
});

module.exports = router; 