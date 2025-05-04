const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Please add a rating between 1 and 5"],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, "Please add a comment"],
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [2000, "Description cannot be more than 2000 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: [0, "Price must be greater than 0"],
  },
  images: [
    {
      type: String,
      required: [true, "Please add at least one image"],
    },
  ],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Please add a category"],
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  stock: {
    type: Number,
    required: [true, "Please add stock quantity"],
    min: [0, "Stock cannot be negative"],
  },
  reviews: [ReviewSchema],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active",
  },
  discounts: [
    {
      percentage: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update numReviews when reviews are modified
ProductSchema.pre("save", function (next) {
  if (this.reviews) {
    this.numReviews = this.reviews.length;
  }
  next();
});

// Create product slug from the name
ProductSchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
