const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { logger, stream, requestLogger, errorLogger, performanceLogger } = require('./services/logger');
const connectDB = require('./config/db');

// Import routes
const challengeRoutes = require('./routes/challenges');
const submissionRoutes = require('./routes/submissions');
const hintRoutes = require('./routes/hints');
const leaderboardRoutes = require('./routes/leaderboard');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream }));
app.use(requestLogger);
app.use(performanceLogger);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Mount routes
app.use('/api/challenges', challengeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/hints', hintRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('Connected to MongoDB', {
    uri: process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'),
    environment: process.env.NODE_ENV || 'development'
  });
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
    type: error.name,
    code: error.code
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', {
    reason: reason.message,
    stack: reason.stack,
    promise: promise.toString()
  });
  process.exit(1);
});

module.exports = app; 