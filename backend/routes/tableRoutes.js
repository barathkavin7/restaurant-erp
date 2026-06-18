const express = require('express');
const { body } = require('express-validator');
const tableController = require('../controllers/tableController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('Admin', 'Manager', 'Waiter'), tableController.listTables);
router.put(
  '/:id',
  authorize('Admin', 'Manager', 'Waiter'),
  [body('status').isIn(['Available', 'Reserved', 'Occupied', 'Cleaning'])],
  validate,
  tableController.updateTable
);

module.exports = router;
