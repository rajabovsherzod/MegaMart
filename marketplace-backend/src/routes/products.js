const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("seller", "name email");
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("seller", "name email");
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
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Seller
router.post("/", protect, authorize("seller", "admin"), async (req, res) => {
  try {
    req.body.seller = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
router.put("/:id", protect, authorize("seller", "admin"), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Make sure user is product seller
    if (
      product.seller.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this product",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
router.delete(
  "/:id",
  protect,
  authorize("seller", "admin"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      // Make sure user is product seller
      if (
        product.seller.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(401).json({
          success: false,
          error: "Not authorized to delete this product",
        });
      }

      await product.remove();

      res.status(200).json({
        success: true,
        data: {},
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
