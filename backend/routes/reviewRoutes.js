const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/public', reviewController.publicReviews);
router.use(authenticate);
router.get('/', reviewController.listReviews);
router.post(
  '/',
  authorize('Customer'),
  [
    body('foodRating').isInt({ min: 1, max: 5 }),
    body('serviceRating').isInt({ min: 1, max: 5 }),
    body('comment').trim().isLength({ min: 8, max: 700 })
  ],
  validate,
  reviewController.createReview
);
router.put(
  '/:id/status',
  authorize('Admin', 'Manager'),
  [body('status').isIn(['Pending', 'Approved', 'Rejected'])],
  validate,
  reviewController.updateReviewStatus
);

module.exports = router;
