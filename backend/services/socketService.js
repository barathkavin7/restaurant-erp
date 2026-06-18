let ioInstance;

function setIo(io) {
  ioInstance = io;
}

function emit(event, payload) {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
}

function emitOrderUpdate(order) {
  emit('order:update', order);
}

function emitReservationUpdate(reservation) {
  emit('reservation:update', reservation);
}

function emitPaymentUpdate(payment) {
  emit('payment:update', payment);
}

module.exports = {
  setIo,
  emit,
  emitOrderUpdate,
  emitReservationUpdate,
  emitPaymentUpdate
};
