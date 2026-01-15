const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for admin user
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if user is admin
      if (user.role !== 'admin' && user.role !== 'editor') {
        return res.status(403).json({ message: 'Not authorized as admin' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { adminLogin, getAdminProfile };