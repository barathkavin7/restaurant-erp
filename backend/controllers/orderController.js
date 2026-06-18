const asyncHandler = require('../utils/asyncHandler');
const orderModel = require('../models/orderModel');
const socketService = require('../services/socketService');

const listOrders = asyncHandler(async (req, res) => {
  const customerId = req.user.role === 'Customer' ? req.user.id : req.query.customerId;
  const orders = await orderModel.list({
    status: req.query.status,
    activeOnly: req.query.activeOnly === 'true',
    customerId
  });
  res.json({ success: true, data: orders });
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.createOrder({
    customerId: req.body.customerId || (req.user.role === 'Customer' ? req.user.id : null),
    waiterId: req.user.role === 'Waiter' ? req.user.id : req.body.waiterId,
    tableId: req.body.tableId,
    orderType: req.body.orderType,
    items: req.body.items,
    discount: req.body.discount,
    notes: req.body.notes
  });
  socketService.emitOrderUpdate(order);
  res.status(201).json({ success: true, message: 'Order placed', data: order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderModel.updateStatus(req.params.id, req.body.status);
  socketService.emitOrderUpdate(order);
  res.json({ success: true, message: 'Order status updated', data: order });
});

module.exports = {
  listOrders,
  createOrder,
  updateOrderStatus
};
