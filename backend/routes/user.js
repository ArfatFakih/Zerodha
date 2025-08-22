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
      
      // Log successful login for debugging
      console.log(`User ${user.email} logged in successfully. Session ID: ${req.sessionID}`);
      
      return res.json({ 
        message: "Login successful", 
        user: { 
          id: user._id, 
          email: user.email, 
          username: user.username 
        } 
      });
    });
  })(req, res, next);
});

// Current user
router.get("/me", ensureAuth, (req, res) => {
  res.json({ user: { id: req.user._id, email: req.user.email, username: req.user.username } });
});

// Session verification endpoint
router.get("/verify-session", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: { 
        id: req.user._id, 
        email: req.user.email, 
        username: req.user.username 
      } 
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Fixed Logout - properly destroy session
router.post("/logout", (req, res) => {
  const sessionId = req.sessionID;
  const userEmail = req.user?.email || 'unknown';
  
  console.log(`Logging out user: ${userEmail}, Session ID: ${sessionId}`);
  
  req.logout((err) => {
    if (err) {
      console.error('Passport logout error:', err);
      return res.status(500).json({ message: "Logout error" });
    }
    
    // Destroy the session completely
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: "Session destroy error" });
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      
      console.log(`Successfully logged out user: ${userEmail}`);
      res.json({ message: "Logged out successfully" });
    });
  });
});

// Alternative logout route that doesn't require authentication (for cleanup)
router.post("/force-logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Force logout session destroy error:', err);
      }
    });
  }
  
  res.clearCookie('connect.sid', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });
  
  res.json({ message: "Force logout completed" });
});

module.exports = { router, ensureAuth };