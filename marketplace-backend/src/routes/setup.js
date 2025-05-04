const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Asosiy kategoriyalar
const mainCategories = [
  {
    name: "Elektronika",
    description: "Telefonlar, kompyuterlar va boshqa elektron qurilmalar",
    icon: "electronics-icon.png",
    image: "electronics-banner.jpg",
    featuredOrder: 1,
  },
  {
    name: "Kiyim-kechak",
    description: "Erkaklar, ayollar va bolalar kiyimlari",
    icon: "fashion-icon.png",
    image: "fashion-banner.jpg",
    featuredOrder: 2,
  },
  {
    name: "Uy va Bog'",
    description: "Uy jihozlari, mebel va bog' anjomlari",
    icon: "home-garden-icon.png",
    image: "home-garden-banner.jpg",
    featuredOrder: 3,
  },
  {
    name: "Go'zallik va Salomatlik",
    description: "Pardoz mahsulotlari va sog'liq uchun mahsulotlar",
    icon: "beauty-health-icon.png",
    image: "beauty-health-banner.jpg",
    featuredOrder: 4,
  },
  {
    name: "Sport va Hordiq",
    description: "Sport anjomlar va dam olish uchun mahsulotlar",
    icon: "sports-icon.png",
    image: "sports-banner.jpg",
    featuredOrder: 5,
  },
  {
    name: "Oziq-ovqat",
    description: "Oziq-ovqat mahsulotlari va ichimliklar",
    icon: "food-icon.png",
    image: "food-banner.jpg",
    featuredOrder: 6,
  },
  {
    name: "O'yinchoqlar va Bolalar",
    description: "Bolalar o'yinchoqlari va mahsulotlari",
    icon: "toys-kids-icon.png",
    image: "toys-kids-banner.jpg",
    featuredOrder: 7,
  },
  {
    name: "Avtomobil va Transport",
    description: "Avtomobil ehtiyot qismlari va aksessuarlari",
    icon: "auto-icon.png",
    image: "auto-banner.jpg",
    featuredOrder: 8,
  },
  {
    name: "Kitoblar va O'quv qo'llanmalari",
    description: "Kitoblar, darsliklar va o'quv materiallari",
    icon: "books-icon.png",
    image: "books-banner.jpg",
    featuredOrder: 9,
  },
  {
    name: "Uy hayvonlari",
    description: "Uy hayvonlari uchun oziq-ovqat va aksessuarlar",
    icon: "pets-icon.png",
    image: "pets-banner.jpg",
    featuredOrder: 10,
  },
];

// Asosiy kategoriyalarni yaratish
router.post("/init-categories", async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        error: "Admin foydalanuvchi topilmadi",
      });
    }

    // Mavjud kategoriyalarni o'chirish
    await Category.deleteMany({});

    // Yangi kategoriyalarni qo'shish
    const createdCategories = await Promise.all(
      mainCategories.map(async (category) => {
        return await Category.create({
          ...category,
          level: 0,
          parent: null,
          path: [],
          isActive: true,
          createdBy: adminUser._id,
          updatedBy: adminUser._id,
        });
      })
    );

    res.status(201).json({
      success: true,
      data: createdCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Create or verify admin user
// @route   GET /api/setup/admin
// @access  Public
router.get("/admin", async (req, res) => {
  try {
    // Admin credentials
    const adminData = {
      username: "admin",
      email: "sherzodradjabov0625@gmail.com",
      password: "Sh..25..",
      role: "admin",
      isVerified: true,
      isActive: true,
    };

    // Check if admin exists
    let admin = await User.findOne({ email: adminData.email });

    if (admin) {
      // Delete existing admin
      await User.deleteOne({ email: adminData.email });
    }

    // Create new admin
    admin = await User.create(adminData);

    res.json({
      success: true,
      message: "Admin user created successfully",
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isVerified: admin.isVerified,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({
      success: false,
      error: "Could not setup admin user",
    });
  }
});

module.exports = router;
