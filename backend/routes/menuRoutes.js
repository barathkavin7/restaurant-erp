const express = require('express');
const { body } = require('express-validator');
const menuController = require('../controllers/menuController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/categories', menuController.getCategories);
router.get('/items', menuController.getItems);

router.post(
  '/items',
  authenticate,
  authorize('Admin', 'Manager'),
  [
    body('categoryId').isInt({ min: 1 }),
    body('name').trim().isLength({ min: 2 }),
    body('description').trim().isLength({ min: 10 }),
    body('price').isFloat({ min: 0 }),
    body('spiceLevel').optional().isIn(['Mild', 'Medium', 'Hot'])
  ],
  validate,
  menuController.createItem
);

router.put(
  '/items/:id',
  authenticate,
  authorize('Admin', 'Manager'),
  [
    body('price').optional().isFloat({ min: 0 }),
    body('spiceLevel').optional().isIn(['Mild', 'Medium', 'Hot'])
  ],
  validate,
  menuController.updateItem
);

module.exports = router;
