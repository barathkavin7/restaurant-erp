const asyncHandler = require('../utils/asyncHandler');
const menuModel = require('../models/menuModel');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await menuModel.categories();
  res.json({ success: true, data: categories });
});

const getItems = asyncHandler(async (req, res) => {
  const items = await menuModel.items({
    categoryId: req.query.categoryId,
    search: req.query.search,
    availableOnly: req.query.availableOnly === 'true'
  });
  res.json({ success: true, data: items });
});

const createItem = asyncHandler(async (req, res) => {
  const item = await menuModel.createItem(req.body);
  res.status(201).json({ success: true, message: 'Menu item created', data: item });
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await menuModel.updateItem(req.params.id, req.body);
  res.json({ success: true, message: 'Menu item updated', data: item });
});

module.exports = {
  getCategories,
  getItems,
  createItem,
  updateItem
};
