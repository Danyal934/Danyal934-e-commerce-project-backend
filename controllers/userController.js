const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add or remove item from wishlist
// @route   POST /api/users/wishlist
const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const index = user.wishlist.indexOf(productId);

        if (index === -1) {
            // Add to wishlist
            user.wishlist.push(productId);
        } else {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
        }

        await user.save();

        // Return populated wishlist
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWishlist, toggleWishlist };
