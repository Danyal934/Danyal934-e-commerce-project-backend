const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      totalPrice 
    } = req.body;
    
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrderById };