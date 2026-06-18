const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password is required')
  ],
  validate,
  authController.login
);

router.get('/me', authenticate, authController.me);
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').optional().trim().isLength({ min: 5 }).withMessage('Phone number is too short'),
    body('address').optional().trim().isLength({ min: 3 }).withMessage('Address is too short')
  ],
  validate,
  authController.updateProfile
);

module.exports = router;
