const { query } = require('../config/db');

async function list({ status, customerId } = {}) {
  const params = [];
  let sql = `
    SELECT r.*, u.name AS customer_name
    FROM reviews r
    JOIN users u ON u.id = r.customer_id
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
  sql += ' ORDER BY r.created_at DESC';
  return query(sql, params);
}

async function create(data) {
  const result = await query(
    `INSERT INTO reviews (customer_id, order_id, food_rating, service_rating, comment, status)
     VALUES (?, ?, ?, ?, ?, 'Pending')`,
    [data.customerId, data.orderId || null, data.foodRating, data.serviceRating, data.comment]
  );
  const rows = await list({});
  return rows.find((review) => review.id === result.insertId);
}

async function updateStatus(id, status) {
  await query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
  const rows = await list({});
  return rows.find((review) => review.id === Number(id));
}

module.exports = {
  list,
  create,
  updateStatus
};
