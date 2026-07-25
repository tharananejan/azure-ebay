const express = require('express');
const router = express.Router();
const {
  createCart,
  addItemToCart,
  getCartBalance,
  getCart,
  checkout,
  deleteCart,
  updateCartItemQty,
  removeItemFromCart
} = require('../controllers/cartController');

// Actor routes for cart operations
router.post('/', createCart);
router.get('/:id', getCart);
router.post('/:id/items', addItemToCart);
router.get('/:id/balance', getCartBalance);
router.post('/:id/checkout', checkout);
router.delete('/:id', deleteCart);
router.put('/:id/items/:sku', updateCartItemQty);
router.delete('/:id/items/:sku', removeItemFromCart);

module.exports = router;
