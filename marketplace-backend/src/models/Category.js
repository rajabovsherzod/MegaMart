const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Kategoriya nomi kiritilishi shart"],
      trim: true,
      maxlength: [50, "Nom 50 ta belgidan oshmasligi kerak"],
    },
    description: {
      type: String,
      required: [true, "Kategoriya tavsifi kiritilishi shart"],
      maxlength: [500, "Tavsif 500 ta belgidan oshmasligi kerak"],
    },
    slug: {
      type: String,
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    path: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    featuredOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create category slug from the name
CategorySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  next();
});

// Virtual for subcategories
CategorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
  justOne: false,
});

// Cascade delete subcategories
CategorySchema.pre("remove", async function (next) {
  await this.model("Category").deleteMany({ parent: this._id });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
