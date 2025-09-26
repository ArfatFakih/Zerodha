const ensureAuth = (req, res, next) => {
  try {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please log in first.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication check failed",
      error: error.message,
    });
  }
};

module.exports = { ensureAuth };
