const { query } = require('../config/db');

async function categories() {
  return query('SELECT id, name, description FROM menu_categories ORDER BY name');
}

async function items({ categoryId, search, availableOnly } = {}) {
  const params = [];
  let sql = `
    SELECT mi.*, mc.name AS category
    FROM menu_items mi
    JOIN menu_categories mc ON mc.id = mi.category_id
    WHERE 1=1
  `;
  if (categoryId) {
    sql += ' AND mi.category_id = ?';
    params.push(categoryId);
  }
  if (availableOnly) {
    sql += ' AND mi.is_available = TRUE';
  }
  if (search) {
    sql += ' AND (mi.name LIKE ? OR mi.description LIKE ? OR mc.name LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  sql += ' ORDER BY mc.name, mi.name';
  return query(sql, params);
}

async function createItem(data) {
  const result = await query(
    `INSERT INTO menu_items
     (category_id, name, description, price, image_url, is_veg, spice_level, is_available)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.categoryId,
      data.name,
      data.description,
      data.price,
      data.imageUrl || null,
      data.isVeg !== false,
      data.spiceLevel || 'Mild',
      data.isAvailable !== false
    ]
  );
  const rows = await items({});
  return rows.find((item) => item.id === result.insertId);
}

async function updateItem(id, data) {
  await query(
    `UPDATE menu_items
     SET category_id = COALESCE(?, category_id),
         name = COALESCE(?, name),
         description = COALESCE(?, description),
         price = COALESCE(?, price),
         image_url = COALESCE(?, image_url),
         is_veg = COALESCE(?, is_veg),
         spice_level = COALESCE(?, spice_level),
         is_available = COALESCE(?, is_available)
     WHERE id = ?`,
    [
      data.categoryId || null,
      data.name || null,
      data.description || null,
      data.price || null,
      data.imageUrl || null,
      typeof data.isVeg === 'boolean' ? data.isVeg : null,
      data.spiceLevel || null,
      typeof data.isAvailable === 'boolean' ? data.isAvailable : null,
      id
    ]
  );
  const rows = await items({});
  return rows.find((item) => item.id === Number(id));
}

module.exports = {
  categories,
  items,
  createItem,
  updateItem
};
