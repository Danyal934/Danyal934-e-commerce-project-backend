const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

router.route('/:productId')
  .delete(protect, removeFromCart)
  .put(protect, updateCartQuantity);

module.exports = router;