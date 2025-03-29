const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: String,
        enum: ['first_challenge', 'perfect_score', 'speed_demon', 'challenge_master', 'accuracy_king'],
      },
    ],
    stats: {
      challengesCompleted: {
        type: Number,
        default: 0,
      },
      totalAttempts: {
        type: Number,
        default: 0,
      },
      successfulAttempts: {
        type: Number,
        default: 0,
      },
      currentAccuracy: {
        type: Number,
        default: 0,
      },
    },
    completedChallenges: [
      {
        challengeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Challenge',
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        score: Number,
        executionTime: Number,
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user's progress
UserSchema.methods.getProgress = function() {
  return {
    points: this.points,
    badges: this.badges,
    stats: this.stats,
    completedChallenges: this.completedChallenges.length,
  };
};

module.exports = mongoose.model('User', UserSchema); 