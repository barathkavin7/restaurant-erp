const asyncHandler = require('../utils/asyncHandler');
const tableModel = require('../models/tableModel');

const listTables = asyncHandler(async (req, res) => {
  const tables = await tableModel.list();
  res.json({ success: true, data: tables });
});

const updateTable = asyncHandler(async (req, res) => {
  const table = await tableModel.updateStatus(req.params.id, {
    status: req.body.status,
    waiterId: req.body.waiterId || (req.user.role === 'Waiter' ? req.user.id : null)
  });
  res.json({ success: true, message: 'Table updated', data: table });
});

module.exports = {
  listTables,
  updateTable
};
