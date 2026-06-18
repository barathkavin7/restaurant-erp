const { query } = require('../config/db');

async function list({ status, customerId } = {}) {
  const params = [];
  let sql = `
    SELECT r.*, u.name AS customer_name, u.email AS customer_email, t.table_number
    FROM reservations r
    JOIN users u ON u.id = r.customer_id
    LEFT JOIN \`tables\` t ON t.id = r.table_id
    WHERE 1=1
  `;
  if (status) {
    sql += ' AND r.status = ?';
    params.push(status);
  }
  if (customerId) {
    sql += ' AND r.customer_id = ?';
    params.push(customerId);
  }
  sql += ' ORDER BY r.reservation_date DESC, r.reservation_time DESC';
  return query(sql, params);
}

async function create(data) {
  const result = await query(
    `INSERT INTO reservations (customer_id, reservation_date, reservation_time, guests, special_request, status)
     VALUES (?, ?, ?, ?, ?, 'Pending')`,
    [data.customerId, data.date, data.time, data.guests, data.specialRequest || null]
  );
  const rows = await list({});
  return rows.find((reservation) => reservation.id === result.insertId);
}

async function updateStatus(id, { status, tableId }) {
  await query(
    'UPDATE reservations SET status = ?, table_id = COALESCE(?, table_id) WHERE id = ?',
    [status, tableId || null, id]
  );
  const rows = await list({});
  return rows.find((reservation) => reservation.id === Number(id));
}

module.exports = {
  list,
  create,
  updateStatus
};
