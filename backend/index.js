const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 8000; // Changed to match your env
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

// Debug environment variables
console.log('Environment variables loaded:');
console.log('MONGO_URL:', process.env.MONGO_URL ? 'Set' : 'Not set');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Not set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('DASHBOARD_URL:', process.env.DASHBOARD_URL);

const connectDb = require('./config/dbConnection');
const Holding = require('./models/HoldingsModel');
const Position = require('./models/PositionsModel');
const Order = require('./models/OrdersModel');

let authRoutes, ensureAuth;

try {
  const authModule = require("./routes/user");
  authRoutes = authModule.router;
  ensureAuth = authModule.ensureAuth;
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
  process.exit(1);
}

connectDb();

// ------------------ CORS ------------------
// Filter out undefined/null values and ensure valid URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL
].filter(url => url && typeof url === 'string' && url.trim().length > 0);

console.log('Allowed Origins:', allowedOrigins); // Debug log

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / curl / same-origin
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy: This origin is not allowed"), false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(bodyParser.json());

// ------------------ Sessions ------------------
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: {
    httpOnly: true,
    sameSite: "none", // important for cross-origin cookies
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    maxAge: 1000 * 60 * 60,  // 1 hour
  },
}));

// Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Auth routes - wrapped in try-catch
try {
  app.use("/auth", authRoutes);
  console.log('Auth routes registered successfully');
} catch (error) {
  console.error('Error registering auth routes:', error.message);
}

// -------- Protected data routes (per-user isolation) --------

app.get("/allHoldings", ensureAuth, async (req, res) => {
  try {
    const allHoldings = await Holding.find({ user: req.user._id }).lean();
    res.json(allHoldings);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
});

app.get("/allPositions", ensureAuth, async (req, res) => {
  try {
    const allPositions = await Position.find({ user: req.user._id }).lean();
    res.json(allPositions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

app.get("/allOrders", ensureAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).lean();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post("/newOrder", ensureAuth, async (req, res) => {
  try {
    const newOrder = new Order({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
      user: req.user._id, // <- tie to logged-in user
    });

    await newOrder.save();
    res.json({ message: "Order saved!", order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});