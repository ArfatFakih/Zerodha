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

// Simple health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Minimal server is running!",
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Steps 1-5 complete - starting server...');

app.listen(PORT, () => {
    console.log(`🚀 MINIMAL SERVER IS RUNNING ON PORT: ${PORT}`);
});