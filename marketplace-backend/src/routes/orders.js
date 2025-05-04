const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("orderHistory");
    res.json({
      success: true,
      data: user.orderHistory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const user = await User.findById(req.user.id);

    // Create new order
    const order = {
      items,
      totalAmount,
      shippingAddress,
      status: "pending",
      createdAt: Date.now(),
    };

    // Add to user's order history
    user.orderHistory.push(order);

    // Clear user's cart
    user.cart = [];

    await user.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const order = user.orderHistory.id(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
