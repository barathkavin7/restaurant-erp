const env = require('../config/env');

function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || res.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    stack: env.nodeEnv === 'production' ? undefined : error.stack
  });
}

module.exports = {
  notFound,
  errorHandler
};
