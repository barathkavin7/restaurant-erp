const { query } = require('../config/db');

async function summary() {
  const [totals] = await query(`
    SELECT
      COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.total ELSE 0 END), 0) AS totalRevenue,
      COALESCE(SUM(CASE WHEN DATE(o.created_at) = CURDATE() AND o.status = 'Completed' THEN o.total ELSE 0 END), 0) AS todayRevenue,
      COUNT(*) AS totalOrders,
      SUM(CASE WHEN o.status NOT IN ('Completed','Cancelled') THEN 1 ELSE 0 END) AS activeOrders
    FROM orders o
  `);
  const [reservations] = await query('SELECT COUNT(*) AS reservations FROM reservations');
  const [customers] = await query(`
    SELECT COUNT(*) AS customers
    FROM users u JOIN roles r ON r.id = u.role_id
    WHERE r.name = 'Customer'
  `);
  return {
    ...totals,
    reservations: reservations.reservations,
    customers: customers.customers
  };
}

async function sales() {
  const daily = await query(`
    SELECT DATE(created_at) AS label, COALESCE(SUM(total), 0) AS value
    FROM orders
    WHERE status = 'Completed' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(created_at)
    ORDER BY label
  `);
  const weekly = await query(`
    SELECT YEARWEEK(created_at, 1) AS label, COALESCE(SUM(total), 0) AS value
    FROM orders
    WHERE status = 'Completed' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 8 WEEK)
    GROUP BY YEARWEEK(created_at, 1)
    ORDER BY label
  `);
  const monthly = await query(`
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS label, COALESCE(SUM(total), 0) AS value
    FROM orders
    WHERE status = 'Completed' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY label
  `);
  const topDishes = await query(`
    SELECT mi.name AS label, SUM(oi.quantity) AS value
    FROM order_items oi
    JOIN menu_items mi ON mi.id = oi.menu_item_id
    JOIN orders o ON o.id = oi.order_id
    GROUP BY mi.id, mi.name
    ORDER BY value DESC
    LIMIT 8
  `);
  return { daily, weekly, monthly, topDishes };
}

module.exports = {
  summary,
  sales
};
