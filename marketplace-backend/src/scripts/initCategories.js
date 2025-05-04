const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");
const User = require("../models/User");

// Load env vars
dotenv.config();

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

// MongoDB ga ulanish
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB ga ulandi");

    try {
      // Admin foydalanuvchini topish
      const adminUser = await User.findOne({ role: "admin" });
      if (!adminUser) {
        throw new Error("Admin foydalanuvchi topilmadi");
      }

      // Mavjud kategoriyalarni o'chirish
      await Category.deleteMany({});
      console.log("🗑️ Mavjud kategoriyalar o'chirildi");

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

      console.log("✅ Yangi kategoriyalar yaratildi:");
      createdCategories.forEach((cat) => {
        console.log(`- ${cat.name}`);
      });
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
