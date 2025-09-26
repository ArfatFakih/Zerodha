const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const connectDb = require("./config/dbConnection");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const holdingRoutes = require("./routes/holdingRoutes");
const positionRoutes = require("./routes/positionRoutes");

const app = express();
const PORT = process.env.PORT || 3002;

connectDb();

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("vercel.app") ||
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
// app.set("trust proxy", 1);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/holdings", holdingRoutes);
app.use("/positions", positionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
