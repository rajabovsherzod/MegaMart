const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// CORS middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Load Models
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Order = require("./models/Order");

// O'zbekcha tarjimalar
const translations = {
  actions: {
    new: "Yangi",
    edit: "Tahrirlash",
    show: "Ko'rish",
    delete: "O'chirish",
    list: "Ro'yxat",
    search: "Qidirish",
    filter: "Filtrlash",
    save: "Saqlash",
    cancel: "Bekor qilish",
  },
  buttons: {
    save: "Saqlash",
    addNewItem: "Yangi qo'shish",
    filter: "Filtrlash",
    applyChanges: "O'zgarishlarni saqlash",
    resetFilter: "Filtrni tozalash",
    confirmRemovalMany: "O'chirishni tasdiqlash",
    confirmRemovalMany_plural: "O'chirishni tasdiqlash",
    logout: "Chiqish",
    login: "Kirish",
  },
  labels: {
    navigation: "Navigatsiya",
    pages: "Sahifalar",
    selectedRecords: "Tanlangan (${selected})",
    filters: "Filtrlar",
    adminVersion: "Admin: ${version}",
    loginWelcome: "MegaMart Admin Paneliga Xush Kelibsiz",
    User: "Foydalanuvchilar",
    Category: "Kategoriyalar",
    Product: "Mahsulotlar",
    Order: "Buyurtmalar",
  },
  properties: {
    name: "Nomi",
    description: "Tavsifi",
    parent: "Asosiy kategoriya",
    level: "Daraja",
    path: "Yo'l",
    icon: "Ikonka",
    image: "Rasm",
    isActive: "Faol",
    featuredOrder: "Ko'rsatish tartibi",
    createdBy: "Yaratdi",
    updatedBy: "Tahrirladi",
    createdAt: "Yaratilgan vaqt",
    updatedAt: "Yangilangan vaqt",
    slug: "URL manzil",
    username: "Foydalanuvchi nomi",
    email: "Email",
    password: "Parol",
    role: "Roli",
  },
  messages: {
    successfullyCreated: "Muvaffaqiyatli yaratildi",
    successfullyUpdated: "Muvaffaqiyatli yangilandi",
    successfullyDeleted: "Muvaffaqiyatli o'chirildi",
    thereWereValidationErrors: "Xatoliklar mavjud",
    confirmDelete: "O'chirishni tasdiqlaysizmi?",
  },
};

// AdminJS Configuration
AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        navigation: {
          name: "Foydalanuvchilar",
          icon: "User",
        },
        properties: {
          password: { isVisible: false },
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          username: { isTitle: true },
          role: {
            availableValues: [
              { value: "user", label: "Foydalanuvchi" },
              { value: "seller", label: "Sotuvchi" },
              { value: "admin", label: "Admin" },
            ],
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
        },
      },
    },
    {
      resource: Category,
      options: {
        navigation: {
          name: "Kategoriyalar",
          icon: "Categories",
        },
        properties: {
          name: {
            isTitle: true,
            position: 1,
          },
          description: {
            type: "textarea",
            position: 2,
          },
          parent: {
            type: "reference",
            reference: "Category",
            position: 3,
            description: "Agar bu asosiy kategoriya bo'lsa bo'sh qoldiring",
          },
          featuredOrder: {
            type: "number",
            position: 4,
            description: "Ko'rsatish tartibi (kichik raqam = yuqorida)",
          },
          isActive: {
            position: 5,
            type: "boolean",
          },
          icon: {
            position: 6,
            description: "Kategoriya ikonkasi (ixtiyoriy)",
          },
          image: {
            position: 7,
            description: "Kategoriya banner rasmi (ixtiyoriy)",
          },
          subcategories: {
            type: "reference",
            reference: "Category",
            isArray: true,
            components: {
              show: AdminJS.bundle("./components/category-show"),
            },
            position: 8,
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: false,
            },
          },
          _id: { isVisible: false },
          slug: { isVisible: false },
          level: { isVisible: false },
          path: { isVisible: false },
          createdAt: { isVisible: false },
          updatedAt: { isVisible: false },
          createdBy: { isVisible: false },
          updatedBy: { isVisible: false },
        },
        actions: {
          new: {
            before: async (request) => {
              return request;
            },
          },
          edit: {
            before: async (request) => {
              return request;
            },
          },
          list: {
            after: async (response) => {
              return response;
            },
          },
          show: {
            after: async (response) => {
              const record = response.record;
              const subcategories = await Category.find({
                parent: record.params._id,
              });
              record.params.subcategories = subcategories.map((sub) => ({
                _id: sub._id.toString(),
                name: sub.name,
                description: sub.description,
                isActive: sub.isActive,
              }));
              return response;
            },
          },
        },
      },
    },
    {
      resource: Product,
      options: {
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          name: { isTitle: true },
          description: { type: "textarea" },
          price: {
            type: "number",
            props: {
              min: 0,
            },
          },
        },
      },
    },
    {
      resource: Order,
      options: {
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          status: {
            availableValues: [
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ],
          },
        },
      },
    },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "MegaMart Admin",
    logo: false,
    favicon: "/favicon.ico",
  },
  locale: {
    language: "uz",
    translations,
  },
  dashboard: {
    component: AdminJS.bundle("./components/dashboard"),
  },
});

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      try {
        // Find user by email and include password
        const user = await User.findOne({ email }).select("+password");

        if (!user || user.role !== "admin") {
          return null;
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return null;
        }

        return user;
      } catch (error) {
        console.error("Admin authentication error:", error);
        return null;
      }
    },
    cookieName: "adminjs",
    cookiePassword: "complex-secure-password-for-cookie",
  },
  null,
  {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "super-secret-key",
  }
);

// Mount AdminJS
app.use(adminJs.options.rootPath, adminRouter);

// Body parser middleware - AFTER AdminJS setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/seller", require("./routes/seller"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/setup", require("./routes/setup"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: Object.values(err.errors).map((val) => val.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} already exists`,
    });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${
    process.env.NODE_ENV || "development"
  } mode on port ${PORT}
📂 Admin panel: http://localhost:${PORT}/admin
🔗 API base URL: http://localhost:${PORT}/api
  `);
});
