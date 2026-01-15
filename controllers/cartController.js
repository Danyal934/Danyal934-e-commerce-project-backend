const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      item => item.product.toString() !== req.params.productId
    );

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    // Find the item in cart
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Update quantity
      user.cart[cartItemIndex].quantity = quantity;
      await user.save();

      // Populate product details and return updated cart
      const populatedUser = await User.findById(req.user._id).populate('cart.product');
      res.json(populatedUser.cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCartQuantity };