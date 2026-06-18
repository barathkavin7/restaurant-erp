const { query } = require('../config/db');

const baseSelect = `
  SELECT u.id, u.role_id, r.name AS role, u.name, u.email, u.password_hash, u.phone,
         u.address, u.status, u.created_at, u.updated_at
  FROM users u
  JOIN roles r ON r.id = u.role_id
`;

async function findByEmail(email) {
  const rows = await query(`${baseSelect} WHERE u.email = ? LIMIT 1`, [email]);
  return rows[0];
}

async function findById(id) {
  const rows = await query(`${baseSelect} WHERE u.id = ? LIMIT 1`, [id]);
  return rows[0];
}

async function list({ role, search } = {}) {
  const params = [];
  let sql = `${baseSelect} WHERE 1=1`;
  if (role) {
    sql += ' AND r.name = ?';
    params.push(role);
  }
  if (search) {
    sql += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  sql += ' ORDER BY u.created_at DESC';
  const rows = await query(sql, params);
  return rows.map(({ password_hash, ...user }) => user);
}

async function create({ roleId, name, email, passwordHash, phone, address, status = 'Active' }) {
  const result = await query(
    `INSERT INTO users (role_id, name, email, password_hash, phone, address, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [roleId, name, email, passwordHash, phone || null, address || null, status]
  );
  return findById(result.insertId);
}

async function updateProfile(id, { name, phone, address }) {
  await query(
    'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), address = COALESCE(?, address) WHERE id = ?',
    [name || null, phone || null, address || null, id]
  );
  return findById(id);
}

async function updateUser(id, { roleId, status, name, phone, address }) {
  await query(
    `UPDATE users
     SET role_id = COALESCE(?, role_id),
         status = COALESCE(?, status),
         name = COALESCE(?, name),
         phone = COALESCE(?, phone),
         address = COALESCE(?, address)
     WHERE id = ?`,
    [roleId || null, status || null, name || null, phone || null, address || null, id]
  );
  return findById(id);
}

async function roles() {
  return query('SELECT id, name, description FROM roles ORDER BY id');
}

module.exports = {
  findByEmail,
  findById,
  list,
  create,
  updateProfile,
  updateUser,
  roles
};
