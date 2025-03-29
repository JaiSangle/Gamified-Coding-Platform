const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create logger instance with environment-specific settings
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : (process.env.LOG_LEVEL || 'info'),
  format: logFormat,
  defaultMeta: { 
    service: 'gamified-learning-platform',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'development' ? 'debug' : (process.env.LOG_LEVEL || 'info')
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Write all logs error (and above) to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Write all logs to api.log
    new winston.transports.File({
      filename: path.join(logsDir, 'api.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Development-specific debug log
    ...(process.env.NODE_ENV === 'development' ? [
      new winston.transports.File({
        filename: path.join(logsDir, 'debug.log'),
        level: 'debug',
        maxsize: 5242880,
        maxFiles: 5,
        tailable: true
      })
    ] : [])
  ]
});

// Create a stream object for Morgan integration
const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Add request logging middleware with enhanced debugging
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details in development
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Incoming Request', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params
    });
  }
  
  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    // Add response body in development for non-200 responses
    if (process.env.NODE_ENV === 'development' && res.statusCode !== 200) {
      logData.responseBody = res.body;
    }

    logger.info('API Request', logData);
  });

  next();
};

// Add error logging middleware with enhanced debugging
const errorLogger = (err, req, res, next) => {
  const errorData = {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
  };

  // Add request details in development
  if (process.env.NODE_ENV === 'development') {
    errorData.requestBody = req.body;
    errorData.requestHeaders = req.headers;
  }

  logger.error('Unhandled Error', errorData);
  next(err);
};

// Add performance monitoring
const performanceLogger = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1e6;
    
    if (duration > 1000) { // Log slow requests (>1s)
      logger.warn('Slow Request Detected', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`
      });
    }
  });

  next();
};

module.exports = {
  logger,
  stream,
  requestLogger,
  errorLogger,
  performanceLogger
}; 