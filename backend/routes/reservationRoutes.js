const express = require('express');
const { body } = require('express-validator');
const reservationController = require('../controllers/reservationController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/', reservationController.listReservations);
router.post(
  '/',
  authorize('Customer'),
  [
    body('date').isISO8601().withMessage('Reservation date is required'),
    body('time').matches(/^([01]\d|2[0-3]):[0-5]\d/).withMessage('Reservation time is required'),
    body('guests').isInt({ min: 1, max: 30 }).withMessage('Guests must be between 1 and 30')
  ],
  validate,
  reservationController.createReservation
);
router.put(
  '/:id/status',
  authorize('Admin', 'Manager'),
  [body('status').isIn(['Pending', 'Approved', 'Rejected'])],
  validate,
  reservationController.updateReservationStatus
);

module.exports = router;
