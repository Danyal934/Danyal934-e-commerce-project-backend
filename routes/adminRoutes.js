const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/adminMiddleware');

// Import admin controllers
const { adminLogin, getAdminProfile } = require('../controllers/adminAuthController');
const { getDashboardStats, getSalesAnalytics } = require('../controllers/adminDashboardController');
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  bulkUpdateProducts 
} = require('../controllers/adminProductController');
const { 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  updateOrderToPaid 
} = require('../controllers/adminOrderController');
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../controllers/adminUserController');

// Admin authentication
router.post('/login', adminLogin);
router.get('/profile', protect, admin, getAdminProfile);

// Dashboard routes
router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.get('/dashboard/analytics', protect, admin, getSalesAnalytics);

// Product management routes
router.route('/products')
  .get(protect, admin, getProducts)
  .post(protect, admin, createProduct);

router.route('/products/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.put('/products/bulk/update', protect, admin, bulkUpdateProducts);

// Order management routes
router.get('/orders', protect, admin, getOrders);
router.get('/orders/:id', protect, admin, getOrderById);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.put('/orders/:id/pay', protect, admin, updateOrderToPaid);

// User management routes
router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.route('/users/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;