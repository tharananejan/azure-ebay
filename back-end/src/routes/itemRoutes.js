const express = require('express');
const router = express.Router();
const {
  addItem,
  getItems,
  getItemByIdOrSku,
  editItem,
  removeItem
} = require('../controllers/itemController');

// Manager routes for item operations
router.post('/', addItem);
router.get('/', getItems);
router.get('/:identifier', getItemByIdOrSku);
router.put('/:identifier', editItem);
router.delete('/:identifier', removeItem);

module.exports = router;
