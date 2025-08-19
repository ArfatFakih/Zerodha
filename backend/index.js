const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 8000;

console.log('🔍 Step 1: Basic setup...');
console.log('Environment variables loaded:');
console.log('MONGO_URL:', process.env.MONGO_URL ? 'Set' : 'Not set');

// Step 2: Add database connection
console.log('🔍 Step 2: Loading database...');
try {
  const connectDb = require('./config/dbConnection');
  connectDb();
  console.log('✅ Database connection loaded');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

// Step 3: Load models
console.log('🔍 Step 3: Loading models...');
try {
  const Holding = require('./models/HoldingsModel');
  const Position = require('./models/PositionsModel');
  const Order = require('./models/OrdersModel');
  console.log('✅ Models loaded successfully');
} catch (error) {
  console.error('❌ Models loading failed:', error.message);
  process.exit(1);
}

// Step 4: Load auth routes
console.log('🔍 Step 4: Loading auth routes...');
let authRoutes, ensureAuth;
try {
  const authModule = require("./routes/user");
  authRoutes = authModule.router;
  ensureAuth = authModule.ensureAuth;
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Auth routes loading failed:', error.message);
  process.exit(1);
}

// Step 6: Add Sessions
console.log('🔍 Step 6: Setting up sessions...');
try {
  const session = require("express-session");
  const MongoStore = require("connect-mongo");
  
  app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60,
    },
  }));
  console.log('✅ Sessions configured successfully');
} catch (error) {
  console.error('❌ Sessions setup failed:', error.message);
  process.exit(1);
}

// Step 7: Add Passport
console.log('🔍 Step 7: Setting up Passport...');
try {
  const passport = require("passport");
  
  // Load passport configuration
  require("./config/passport")(passport);
  
  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  console.log('✅ Passport configured successfully');
} catch (error) {
  console.error('❌ Passport setup failed:', error.message);
  console.error('❌ Full error:', error);
  process.exit(1);
}

// Step 8: Register auth routes
console.log('🔍 Step 8: Registering auth routes...');
try {
  app.use("/auth", authRoutes);
  console.log('✅ Auth routes registered successfully');
} catch (error) {
  console.error('❌ Auth routes registration failed:', error.message);
  console.error('❌ Full error:', error);
  process.exit(1);
}

// Step 9: Add protected routes one by one
console.log('🔍 Step 9: Adding protected routes...');

try {
  // First route - allHoldings
  app.get("/allHoldings", ensureAuth, async (req, res) => {
    try {
      const allHoldings = await Holding.find({ user: req.user._id }).lean();
      res.json(allHoldings);
    } catch (error) {
      console.error('Error fetching holdings:', error);
      res.status(500).json({ error: 'Failed to fetch holdings' });
    }
  });
  console.log('✅ /allHoldings route added');
  
  // Second route - allPositions  
  app.get("/allPositions", ensureAuth, async (req, res) => {
    try {
      const allPositions = await Position.find({ user: req.user._id }).lean();
      res.json(allPositions);
    } catch (error) {
      console.error('Error fetching positions:', error);
      res.status(500).json({ error: 'Failed to fetch positions' });
    }
  });
  console.log('✅ /allPositions route added');
  
} catch (error) {
  console.error('❌ Protected routes setup failed:', error.message);
  console.error('❌ Full error:', error);
  process.exit(1);
}

// Simple health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Minimal server is running!",
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Steps 1-9 complete - starting server...');

app.listen(PORT, () => {
    console.log(`🚀 MINIMAL SERVER IS RUNNING ON PORT: ${PORT}`);
});