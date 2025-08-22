const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3002;
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const connectDb = require('./config/dbConnection');
const Holding = require('./models/HoldingsModel');
const Position = require('./models/PositionsModel');
const Order = require('./models/OrdersModel');

const { router: authRoutes, ensureAuth } = require("./routes/user");

connectDb();

// CORS configuration - more specific for your Vercel domains
app.use(
  cors({
    origin: [
      "https://zerodha-orzy-gypy78cjm-arfat-fakihs-projects.vercel.app", // Your dashboard
      "https://zerodha-b03g67fs6-arfat-fakihs-projects.vercel.app",      // Your login/signup
      /^https:\/\/.*\.vercel\.app$/, // Any vercel app (for deployments)
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
  })
);

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());

app.set("trust proxy", 1);

// Sessions (MongoDB store)
app.use(session({
  name: 'connect.sid', // Explicit session cookie name
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URL,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true, // Since you're using HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours (longer session)
    domain: undefined // Let browser handle domain
  },
}));

// Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware to log session info for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Session ID: ${req.sessionID}, Authenticated: ${req.isAuthenticated ? req.isAuthenticated() : false}`);
  next();
});

// Auth routes
app.use("/", authRoutes);

// -------- Protected data routes (per-user isolation) --------

app.get("/allHoldings", ensureAuth, async (req, res) => {
  try {
    const allHoldings = await Holding.find({ user: req.user._id }).lean();
    res.json(allHoldings);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ message: 'Error fetching holdings' });
  }
});

app.get("/allPositions", ensureAuth, async (req, res) => {
  try {
    const allPositions = await Position.find({ user: req.user._id }).lean();
    res.json(allPositions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ message: 'Error fetching positions' });
  }
});

app.get("/allOrders", ensureAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).lean();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

app.post("/newOrder", ensureAuth, async (req, res) => {
  try {
    const newOrder = new Order({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
      user: req.user._id, // tie to logged-in user
    });

    await newOrder.save();
    console.log(`Order saved for user: ${req.user.email}`);
    res.json({ message: "Order saved successfully!" });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Error saving order' });
  }
});

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT:${PORT}`);
});