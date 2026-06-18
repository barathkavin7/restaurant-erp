const jwt = require('jsonwebtoken');
const env = require('../config/env');
const socketService = require('../services/socketService');

function configureSockets(io) {
  socketService.setIo(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) {
      return next();
    }
    try {
      socket.user = jwt.verify(token, env.jwtSecret);
      next();
    } catch (error) {
      next();
    }
  });

  io.on('connection', (socket) => {
    socket.on('join:role', (role) => {
      if (role) socket.join(`role:${role}`);
    });

    socket.on('order:watch', (orderId) => {
      if (orderId) socket.join(`order:${orderId}`);
    });
  });
}

module.exports = configureSockets;
