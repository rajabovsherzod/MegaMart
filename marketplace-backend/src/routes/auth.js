const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);

// Create Admin User
router.post("/create-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "User already exists"
      });
    }

    // Create admin user
    user = new User({
      email,
      password,
      role: "admin"
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({
      success: true,
      message: "Admin user created successfully",
      data: {
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
});

module.exports = router;
