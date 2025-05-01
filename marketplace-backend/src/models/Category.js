const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a category name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  slug: {
    type: String,
    unique: true,
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create category slug from the name
CategorySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
