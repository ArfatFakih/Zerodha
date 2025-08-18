const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3002;
const connectDb = require('./config/dbConnection');

connectDb();

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT:${PORT}`);
})
