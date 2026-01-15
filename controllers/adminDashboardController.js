const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - 7));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Today's stats
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfToday } });
    const todayRevenue = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products
    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } })
      .sort({ countInStock: 1 })
      .limit(5);

    res.json({
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0
      },
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/dashboard/analytics
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }
    ]);

    res.json({ salesData, topProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getSalesAnalytics };