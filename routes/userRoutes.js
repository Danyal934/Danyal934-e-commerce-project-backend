const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/wishlist')
    .get(protect, getWishlist)
    .post(protect, toggleWishlist);

module.exports = router;
