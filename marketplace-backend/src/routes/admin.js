const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:userId/role
// @access  Private/Admin
router.put(
  "/users/:userId/role",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      user.role = role;
      await user.save();

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:userId/status
// @access  Private/Admin
router.put(
  "/users/:userId/status",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { isActive } = req.body;
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      user.isActive = isActive;
      await user.save();

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
router.get("/products", protect, authorize("admin"), async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("seller", "name email");
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Update product status
// @route   PUT /api/admin/products/:productId/status
// @access  Private/Admin
router.put(
  "/products/:productId/status",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const product = await Product.findById(req.params.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      product.status = status;
      await product.save();

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get("/orders", protect, authorize("admin"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort("-createdAt");
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalSellers: await User.countDocuments({ role: "seller" }),
      totalProducts: await Product.countDocuments(),
      totalOrders: await Order.countDocuments(),
      totalRevenue: await Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      pendingOrders: await Order.countDocuments({ status: "pending" }),
      activeSellers: await User.countDocuments({
        role: "seller",
        isActive: true,
      }),
      activeProducts: await Product.countDocuments({ status: "active" }),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Get seller stats
// @route   GET /api/admin/sellers/stats
// @access  Private/Admin
router.get("/sellers/stats", protect, authorize("admin"), async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("name email createdAt")
      .populate({
        path: "products",
        select: "name price stock",
      });

    const sellerStats = sellers.map((seller) => ({
      id: seller._id,
      name: seller.name,
      email: seller.email,
      joinDate: seller.createdAt,
      totalProducts: seller.products.length,
      totalSales: seller.products.reduce(
        (acc, product) => acc + product.price,
        0
      ),
      activeProducts: seller.products.filter((product) => product.stock > 0)
        .length,
    }));

    res.status(200).json({
      success: true,
      data: sellerStats,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Get category stats
// @route   GET /api/admin/categories/stats
// @access  Private/Admin
router.get(
  "/categories/stats",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const categories = await Category.find().populate("products");

      const categoryStats = categories.map((category) => ({
        id: category._id,
        name: category.name,
        totalProducts: category.products.length,
        totalSales: category.products.reduce(
          (acc, product) => acc + product.price,
          0
        ),
      }));

      res.status(200).json({
        success: true,
        data: categoryStats,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
);

module.exports = router;
