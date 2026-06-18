const { query } = require('../config/db');

async function list() {
  return query(`
    SELECT t.*, u.name AS waiter_name
    FROM \`tables\` t
    LEFT JOIN users u ON u.id = t.current_waiter_id
    ORDER BY CAST(SUBSTRING(t.table_number, 2) AS UNSIGNED), t.table_number
  `);
}

async function updateStatus(id, { status, waiterId }) {
  await query(
    'UPDATE `tables` SET status = COALESCE(?, status), current_waiter_id = COALESCE(?, current_waiter_id) WHERE id = ?',
    [status || null, waiterId || null, id]
  );
  const rows = await query('SELECT * FROM `tables` WHERE id = ?', [id]);
  return rows[0];
}

module.exports = {
  list,
  updateStatus
};
