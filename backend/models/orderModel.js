const { query, transaction } = require('../config/db');

async function getMenuItemsByIds(connection, ids) {
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await connection.execute(
    `SELECT id, name, price FROM menu_items WHERE id IN (${placeholders}) AND is_available = TRUE`,
    ids
  );
  return rows;
}

async function createOrder(data) {
  const orderId = await transaction(async (connection) => {
    const itemIds = data.items.map((item) => item.menuItemId);
    const menuItems = await getMenuItemsByIds(connection, itemIds);
    const menuById = new Map(menuItems.map((item) => [item.id, item]));

    if (menuItems.length !== itemIds.length) {
      throw new Error('One or more menu items are unavailable');
    }

    const subtotal = data.items.reduce((sum, item) => {
      const menuItem = menuById.get(item.menuItemId);
      return sum + Number(menuItem.price) * Number(item.quantity);
    }, 0);
    const tax = Number((subtotal * 0.05).toFixed(2));
    const discount = Number(data.discount || 0);
    const total = Number((subtotal + tax - discount).toFixed(2));

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (customer_id, waiter_id, table_id, order_type, status, subtotal, tax, discount, total, notes)
       VALUES (?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?)`,
      [
        data.customerId || null,
        data.waiterId || null,
        data.tableId || null,
        data.orderType || 'Dine In',
        subtotal,
        tax,
        discount,
        total,
        data.notes || null
      ]
    );

    for (const item of data.items) {
      const menuItem = menuById.get(item.menuItemId);
      const lineTotal = Number((Number(menuItem.price) * Number(item.quantity)).toFixed(2));
      await connection.execute(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, line_total, special_instruction)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderResult.insertId, item.menuItemId, item.quantity, menuItem.price, lineTotal, item.specialInstruction || null]
      );
    }

    if (data.tableId) {
      await connection.execute('UPDATE `tables` SET status = ? WHERE id = ?', ['Occupied', data.tableId]);
    }

    return orderResult.insertId;
  });
  return findById(orderId);
}

async function list({ status, customerId, activeOnly } = {}) {
  const params = [];
  let sql = `
    SELECT o.*, c.name AS customer_name, w.name AS waiter_name, t.table_number
    FROM orders o
    LEFT JOIN users c ON c.id = o.customer_id
    LEFT JOIN users w ON w.id = o.waiter_id
    LEFT JOIN \`tables\` t ON t.id = o.table_id
    WHERE 1=1
  `;
  if (status) {
    sql += ' AND o.status = ?';
    params.push(status);
  }
  if (customerId) {
    sql += ' AND o.customer_id = ?';
    params.push(customerId);
  }
  if (activeOnly) {
    sql += " AND o.status NOT IN ('Completed','Cancelled')";
  }
  sql += ' ORDER BY o.created_at DESC';
  const orders = await query(sql, params);
  return attachItems(orders);
}

async function findById(id) {
  const rows = await query(
    `SELECT o.*, c.name AS customer_name, w.name AS waiter_name, t.table_number
     FROM orders o
     LEFT JOIN users c ON c.id = o.customer_id
     LEFT JOIN users w ON w.id = o.waiter_id
     LEFT JOIN \`tables\` t ON t.id = o.table_id
     WHERE o.id = ?`,
    [id]
  );
  const orders = await attachItems(rows);
  return orders[0];
}

async function attachItems(orders) {
  if (!orders.length) return [];
  const ids = orders.map((order) => order.id);
  const placeholders = ids.map(() => '?').join(',');
  const items = await query(
    `SELECT oi.*, mi.name, mi.image_url, mc.name AS category
     FROM order_items oi
     JOIN menu_items mi ON mi.id = oi.menu_item_id
     JOIN menu_categories mc ON mc.id = mi.category_id
     WHERE oi.order_id IN (${placeholders})
     ORDER BY oi.id`,
    ids
  );
  return orders.map((order) => ({
    ...order,
    items: items.filter((item) => item.order_id === order.id)
  }));
}

async function updateStatus(id, status) {
  await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  if (status === 'Ready') {
    await query("UPDATE order_items SET item_status = 'Ready' WHERE order_id = ?", [id]);
  }
  return findById(id);
}

module.exports = {
  createOrder,
  list,
  findById,
  updateStatus
};
