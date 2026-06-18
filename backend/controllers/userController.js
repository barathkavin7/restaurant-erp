const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');

const listUsers = asyncHandler(async (req, res) => {
  const users = await userModel.list(req.query);
  res.json({ success: true, data: users });
});

const listRoles = asyncHandler(async (req, res) => {
  const roles = await userModel.roles();
  res.json({ success: true, data: roles });
});

const createUser = asyncHandler(async (req, res) => {
  const roles = await userModel.roles();
  const requestedRole = req.body.role || 'Customer';
  const role = roles.find((item) => item.name === requestedRole || item.id === Number(req.body.roleId));
  if (!role) {
    throw new ApiError(422, 'Valid role is required');
  }
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await userModel.create({
    roleId: role.id,
    name: req.body.name,
    email: req.body.email,
    passwordHash,
    phone: req.body.phone,
    address: req.body.address,
    status: req.body.status
  });
  res.status(201).json({ success: true, message: 'User created', data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userModel.updateUser(req.params.id, req.body);
  res.json({ success: true, message: 'User updated', data: user });
});

module.exports = {
  listUsers,
  listRoles,
  createUser,
  updateUser
};
