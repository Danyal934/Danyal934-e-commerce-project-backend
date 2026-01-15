const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById);

module.exports = router;