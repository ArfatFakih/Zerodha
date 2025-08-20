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

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("vercel.app") || // allow any vercel.app frontend
        origin.startsWith("http://localhost:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());

// Sessions (Mongo store keeps sessions across restarts)
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true,           // set true if you serve over HTTPS
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

//Normal change

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT:${PORT}`);
})