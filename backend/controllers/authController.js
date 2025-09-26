const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/UserModel");

// Signup
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    return res.status(201).json({ message: "Signup successful", userId: user._id });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// Login
const login = (req, res, next) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login failed" });
      }

      req.logIn(user, (err2) => {
        if (err2) return next(err2);
        return res.json({
          message: "Login successful",
          user: { id: user._id, email: user.email },
        });
      });
    })(req, res, next);
  } catch (error) {
    return res.status(500).json({ message: "Login error", error: error.message });
  }
};

// Current user
const getMe = (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Fetching user failed", error: error.message });
  }
};

// Logout
const logout = (req, res) => {
  try {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout error" });

      // 🔹 destroy session and clear cookie
      req.session.destroy(() => {
        res.clearCookie("connect.sid", { path: "/" });
        res.json({ message: "Logged out" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};


module.exports = {
  signup,
  login,
  getMe,
  logout,
};
