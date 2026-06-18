const asyncHandler = require('../utils/asyncHandler');
const reservationModel = require('../models/reservationModel');
const socketService = require('../services/socketService');

const listReservations = asyncHandler(async (req, res) => {
  const customerId = req.user.role === 'Customer' ? req.user.id : req.query.customerId;
  const reservations = await reservationModel.list({
    status: req.query.status,
    customerId
  });
  res.json({ success: true, data: reservations });
});

const createReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationModel.create({
    customerId: req.user.id,
    date: req.body.date,
    time: req.body.time,
    guests: req.body.guests,
    specialRequest: req.body.specialRequest
  });
  socketService.emitReservationUpdate(reservation);
  res.status(201).json({ success: true, message: 'Reservation submitted', data: reservation });
});

const updateReservationStatus = asyncHandler(async (req, res) => {
  const reservation = await reservationModel.updateStatus(req.params.id, {
    status: req.body.status,
    tableId: req.body.tableId
  });
  socketService.emitReservationUpdate(reservation);
  res.json({ success: true, message: 'Reservation updated', data: reservation });
});

module.exports = {
  listReservations,
  createReservation,
  updateReservationStatus
};
