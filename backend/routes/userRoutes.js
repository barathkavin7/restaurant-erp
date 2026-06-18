const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('Admin', 'Manager'));
router.get('/', userController.listUsers);
router.get('/roles', userController.listRoles);
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('role').optional().isIn(['Admin', 'Manager', 'Waiter', 'Chef', 'Cashier', 'Customer']),
    body('roleId').optional().isInt({ min: 1, max: 6 })
  ],
  validate,
  userController.createUser
);
router.put(
  '/:id',
  [
    body('status').optional().isIn(['Active', 'Inactive']),
    body('roleId').optional().isInt({ min: 1, max: 6 })
  ],
  validate,
  userController.updateUser
);

module.exports = router;
