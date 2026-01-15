const express = require('express');
const router = express.Router();
const { createOrder, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder);

router.route('/:id')
  .get(protect, getOrderById);

module.exports = router;