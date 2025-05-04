const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Load env vars
dotenv.config();

const adminData = {
  username: "admin",
  email: "sherzodradjabov0625@gmail.com",
  password: "Sh..25..",
  role: "admin",
  isVerified: true,
  isActive: true,
};

// MongoDB ga ulanish
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB ga ulandi");

    try {
      // Mavjud admin foydalanuvchini tekshirish
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log("ℹ️ Admin foydalanuvchi allaqachon mavjud");
        return;
      }

      // Parolni hashlash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Admin yaratish
      const admin = await User.create({
        ...adminData,
        password: hashedPassword,
      });

      console.log("✅ Admin foydalanuvchi yaratildi:");
      console.log(`- Username: ${admin.username}`);
      console.log(`- Email: ${admin.email}`);
      console.log(`- Role: ${admin.role}`);
    } catch (error) {
      console.error("❌ Xatolik:", error.message);
    }

    // MongoDB dan uzilish
    await mongoose.disconnect();
    console.log("👋 MongoDB dan uzildi");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB ga ulanishda xatolik:", err);
    process.exit(1);
  });
