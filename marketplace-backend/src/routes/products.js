const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const Product = require("../models/Product");
const User = require("../models/User");

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

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
router.get("/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name profileImage",
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product.reviews,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        error: "Product already reviewed",
      });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    product.reviews.push(review);

    // Update product rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
router.put("/:id/reviews/:reviewId", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this review",
      });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    // Update product rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
router.delete("/:id/reviews/:reviewId", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this review",
      });
    }

    // Remove review
    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.params.reviewId
    );

    // Update product rating
    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

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
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Please provide a search query",
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    })
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

// @desc    Filter products
// @route   GET /api/products/filter
// @access  Public
router.get("/filter", async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      rating,
      sort = "-createdAt",
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // Build sort object
    let sortOptions = {};
    if (sort) {
      const sortFields = sort.split(",");
      sortFields.forEach((field) => {
        const order = field.startsWith("-") ? -1 : 1;
        const fieldName = field.replace("-", "");
        sortOptions[fieldName] = order;
      });
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
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

// @desc    Get user cart
// @route   GET /api/products/cart
// @access  Private
router.get("/cart", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "cart.product",
      populate: {
        path: "category seller",
        select: "name",
      },
    });

    res.status(200).json({
      success: true,
      data: user.cart,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Add to cart
// @route   POST /api/products/cart/:productId
// @access  Private
router.post("/cart/:productId", protect, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: "Not enough stock",
      });
    }

    const user = await User.findById(req.user.id);

    // Check if product already in cart
    const cartItem = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({
        product: req.params.productId,
        quantity,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.cart,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/products/cart/:productId
// @access  Private
router.put("/cart/:productId", protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: "Not enough stock",
      });
    }

    const user = await User.findById(req.user.id);
    const cartItem = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: "Product not in cart",
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.cart,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Remove from cart
// @route   DELETE /api/products/cart/:productId
// @access  Private
router.delete("/cart/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      data: user.cart,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/products/cart
// @access  Private
router.delete("/cart", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      data: user.cart,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Get user orders
// @route   GET /api/products/orders
// @access  Private
router.get("/orders", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "orderHistory",
      populate: {
        path: "items.product",
        select: "name price images",
      },
    });

    res.status(200).json({
      success: true,
      data: user.orderHistory,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Get single order
// @route   GET /api/products/orders/:orderId
// @access  Private
router.get("/orders/:orderId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const order = user.orderHistory.id(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    await order.populate({
      path: "items.product",
      select: "name price images",
    });

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
});

// @desc    Create new order
// @route   POST /api/products/orders
// @access  Private
router.post("/orders", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const user = await User.findById(req.user.id).populate("cart.product");

    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty",
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of user.cart) {
      const product = item.product;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Not enough stock for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = {
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "pending",
      createdAt: Date.now(),
    };

    // Add to user's order history
    user.orderHistory.push(order);

    // Clear user's cart
    user.cart = [];

    await user.save();

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// @desc    Update order status
// @route   PUT /api/products/orders/:orderId
// @access  Private/Admin
router.put(
  "/orders/:orderId",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const user = await User.findById(req.user.id);
      const order = user.orderHistory.id(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      order.status = status;
      await user.save();

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

module.exports = router;
