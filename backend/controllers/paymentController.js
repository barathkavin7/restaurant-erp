const asyncHandler = require('../utils/asyncHandler');
const paymentModel = require('../models/paymentModel');
const socketService = require('../services/socketService');

const listPayments = asyncHandler(async (req, res) => {
  const payments = await paymentModel.list();
  res.json({ success: true, data: payments });
});

const createPayment = asyncHandler(async (req, res) => {
  const payment = await paymentModel.create({
    orderId: req.body.orderId,
    cashierId: req.user.id,
    amount: req.body.amount,
    method: req.body.method
  });
  socketService.emitPaymentUpdate(payment);
  res.status(201).json({ success: true, message: 'Payment processed', data: payment });
});

const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await paymentModel.invoice(req.params.orderId);
  res.json({ success: true, data: invoice });
});

module.exports = {
  listPayments,
  createPayment,
  getInvoice
};
