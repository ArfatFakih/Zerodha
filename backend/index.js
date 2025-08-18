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

// ------------------ CORS ------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman or same-origin requests
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error("CORS policy: This origin is not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
}));

// Handle preflight requests
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));


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
    secure: true,     // must be true on HTTPS
    maxAge: 1000 * 60 * 60,  // 1 hour
  },
}));

// Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.use("/", authRoutes);



// -------- Protected data routes (per-user isolation) --------


app.get("/allHoldings", ensureAuth, async (req, res) => {
  const allHoldings = await Holding.find({ user: req.user._id }).lean();
  res.json(allHoldings);
});

app.get("/allPositions", ensureAuth, async (req, res) => {
  const allPositions = await Position.find({ user: req.user._id }).lean();
  res.json(allPositions);
});

app.get("/allOrders", ensureAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).lean();
  res.json(orders);
});

app.post("/newOrder", ensureAuth, async (req, res) => {
  const newOrder = new Order({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
    user: req.user._id, // <- tie to logged-in user
  });

  await newOrder.save();
  res.send("Order saved!");
});

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT:${PORT}`);
})

