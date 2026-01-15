const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status || '';
    const search = req.query.search || '';

    let query = {};
    
    if (status) {
      query.isPaid = status === 'paid';
    }
    
    if (search) {
      query._id = search;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = req.body.isPaid !== undefined ? req.body.isPaid : order.isPaid;
      
      if (req.body.isPaid && !order.paidAt) {
        order.paidAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/admin/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid
};