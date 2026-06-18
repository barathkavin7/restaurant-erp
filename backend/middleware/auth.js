const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new ApiError(401, 'Authentication token required');
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userModel.findById(payload.id);
    if (!user || user.status !== 'Active') {
      throw new ApiError(401, 'Invalid or inactive account');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, 'Invalid authentication token'));
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to access this resource'));
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorize
};
