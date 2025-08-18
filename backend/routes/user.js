const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const passport = require("passport");

// Guard
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated?.()) return next();
  return res.status(401).json({ message: "Not authenticated" });
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    return res.json({ message: "Signup successful", userId: user._id });
  } catch (e) {
    return res.status(500).json({ message: "Signup failed", error: e.message });
  }
});

// Login (session-based)
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Login failed" });

    req.logIn(user, (err2) => {
      if (err2) return next(err2);
      return res.json({ message: "Login successful", user: { id: user._id, email: user.email } });
    });
  })(req, res, next);
});

// Current user
router.get("/me", ensureAuth, (req, res) => {
  res.json({ user: { id: req.user._id, email: req.user.email, username: req.user.username } });
});

// Logout
router.post("/logout", ensureAuth, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout error" });
    res.json({ message: "Logged out" });
  });
});

module.exports = { router, ensureAuth };
