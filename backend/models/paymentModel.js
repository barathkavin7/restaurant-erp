const { query, transaction } = require('../config/db');
const orderModel = require('./orderModel');

async function create({ orderId, cashierId, amount, method }) {
  const paymentId = await transaction(async (connection) => {
    const reference = `${method.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`;
    const [result] = await connection.execute(
      `INSERT INTO payments (order_id, cashier_id, amount, method, status, transaction_reference)
       VALUES (?, ?, ?, ?, 'Paid', ?)`,
      [orderId, cashierId || null, amount, method, reference]
    );
    await connection.execute("UPDATE orders SET status = 'Completed' WHERE id = ?", [orderId]);
    return result.insertId;
  });
  return findById(paymentId);
}

async function findById(id) {
  const rows = await query(
    `SELECT p.*, o.total, u.name AS cashier_name
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     LEFT JOIN users u ON u.id = p.cashier_id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
}

async function list() {
  return query(
    `SELECT p.*, o.total, u.name AS cashier_name
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     LEFT JOIN users u ON u.id = p.cashier_id
     ORDER BY p.paid_at DESC`
  );
}

async function invoice(orderId) {
  const order = await orderModel.findById(orderId);
  const payments = await query('SELECT * FROM payments WHERE order_id = ? ORDER BY paid_at DESC', [orderId]);
  return { order, payments };
}

module.exports = {
  create,
  list,
  invoice
};
