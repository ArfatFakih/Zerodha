const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { 
        type: String 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    password: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
