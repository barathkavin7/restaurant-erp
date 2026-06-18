const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');

function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword || user.status !== 'Active') {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user);
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: sanitizeUser(user)
    }
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: sanitizeUser(req.user)
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userModel.updateProfile(req.user.id, req.body);
  res.json({
    success: true,
    message: 'Profile updated',
    data: sanitizeUser(user)
  });
});

module.exports = {
  login,
  me,
  updateProfile
};
