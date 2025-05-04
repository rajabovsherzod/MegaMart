const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

// @desc    Get seller dashboard stats
// @route   GET /api/seller/stats
// @access  Private/Seller
router.get("/stats", protect, authorize("seller"), async (req, res) => {
  try {
    const stats = {
      totalProducts: await Product.countDocuments({ seller: req.user.id }),
      totalOrders: await Order.countDocuments({
        "items.product.seller": req.user.id,
      }),
      totalRevenue: await Order.aggregate([
        {
          $match: { "items.product.seller": req.user.id, status: "completed" },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      pendingOrders: await Order.countDocuments({
        "items.product.seller": req.user.id,
        status: "pending",
      }),
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

// @desc    Get seller products
// @route   GET /api/seller/products
// @access  Private/Seller
router.get("/products", protect, authorize("seller"), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate("category")
      .sort("-createdAt");

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

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private/Seller
router.get("/orders", protect, authorize("seller"), async (req, res) => {
  try {
    const orders = await Order.find({ "items.product.seller": req.user.id })
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

// @desc    Update order status
// @route   PUT /api/seller/orders/:orderId
// @access  Private/Seller
router.put(
  "/orders/:orderId",
  protect,
  authorize("seller"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      // Check if order belongs to seller
      const sellerItem = order.items.find(
        (item) => item.product.seller.toString() === req.user.id
      );

      if (!sellerItem) {
        return res.status(401).json({
          success: false,
          error: "Not authorized to update this order",
        });
      }

      order.status = status;
      await order.save();

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// @desc    Create discount
// @route   POST /api/seller/discounts
// @access  Private/Seller
router.post("/discounts", protect, authorize("seller"), async (req, res) => {
  try {
    const { productId, percentage, startDate, endDate } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Check if product belongs to seller
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to add discount to this product",
      });
    }

    const discount = {
      percentage,
      startDate,
      endDate,
    };

    product.discounts.push(discount);
    await product.save();

    res.status(201).json({
      success: true,
      data: discount,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Get seller discounts
// @route   GET /api/seller/discounts
// @access  Private/Seller
router.get("/discounts", protect, authorize("seller"), async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.id,
      "discounts.0": { $exists: true },
    }).select("name price discounts");

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Update product stock
// @route   PUT /api/seller/products/:productId/stock
// @access  Private/Seller
router.put(
  "/products/:productId/stock",
  protect,
  authorize("seller"),
  async (req, res) => {
    try {
      const { stock } = req.body;
      const product = await Product.findById(req.params.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      // Check if product belongs to seller
      if (product.seller.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: "Not authorized to update this product",
        });
      }

      product.stock = stock;
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

module.exports = router;
