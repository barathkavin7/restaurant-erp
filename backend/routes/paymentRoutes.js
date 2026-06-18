const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('Admin', 'Manager', 'Cashier'), paymentController.listPayments);
router.get('/invoice/:orderId', authorize('Admin', 'Manager', 'Cashier', 'Customer'), paymentController.getInvoice);
router.post(
  '/',
  authorize('Admin', 'Cashier'),
  [
    body('orderId').isInt({ min: 1 }),
    body('amount').isFloat({ min: 0 }),
    body('method').isIn(['Cash', 'Card', 'Simulated Online Payment'])
  ],
  validate,
  paymentController.createPayment
);

module.exports = router;
