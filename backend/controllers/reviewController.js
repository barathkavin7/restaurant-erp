const asyncHandler = require('../utils/asyncHandler');
const reviewModel = require('../models/reviewModel');

const listReviews = asyncHandler(async (req, res) => {
  const customerId = req.user && req.user.role === 'Customer' ? req.user.id : req.query.customerId;
  const reviews = await reviewModel.list({
    status: req.query.status,
    customerId
  });
  res.json({ success: true, data: reviews });
});

const publicReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewModel.list({ status: 'Approved' });
  res.json({ success: true, data: reviews });
});

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewModel.create({
    customerId: req.user.id,
    orderId: req.body.orderId,
    foodRating: req.body.foodRating,
    serviceRating: req.body.serviceRating,
    comment: req.body.comment
  });
  res.status(201).json({ success: true, message: 'Review submitted for approval', data: review });
});

const updateReviewStatus = asyncHandler(async (req, res) => {
  const review = await reviewModel.updateStatus(req.params.id, req.body.status);
  res.json({ success: true, message: 'Review moderated', data: review });
});

module.exports = {
  listReviews,
  publicReviews,
  createReview,
  updateReviewStatus
};
