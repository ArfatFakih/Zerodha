const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 8000;

console.log('🔍 Starting minimal server for debugging...');
console.log('Environment variables loaded:');
console.log('MONGO_URL:', process.env.MONGO_URL ? 'Set' : 'Not set');

// Basic middleware
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Minimal server is running!",
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Basic setup complete - starting server...');

app.listen(PORT, () => {
    console.log(`🚀 MINIMAL SERVER IS RUNNING ON PORT: ${PORT}`);
});