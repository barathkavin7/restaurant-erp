const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/', orderController.listOrders);
router.post(
  '/',
  authorize('Admin', 'Manager', 'Waiter', 'Customer'),
  [
    body('orderType').isIn(['Dine In', 'Takeaway', 'Delivery']),
    body('items').isArray({ min: 1 }),
    body('items.*.menuItemId').isInt({ min: 1 }),
    body('items.*.quantity').isInt({ min: 1, max: 50 })
  ],
  validate,
  orderController.createOrder
);
router.put(
  '/:id/status',
  authorize('Admin', 'Manager', 'Waiter', 'Chef', 'Cashier'),
  [body('status').isIn(['Pending', 'Accepted', 'Preparing', 'Ready', 'Out For Delivery', 'Completed', 'Cancelled'])],
  validate,
  orderController.updateOrderStatus
);

module.exports = router;
