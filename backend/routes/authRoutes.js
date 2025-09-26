const router = require("express").Router();
const { signup, login, getMe, logout } = require("../controllers/authController");
const { ensureAuth } = require("../middleware/authMiddleware");

router.get("/verify-session", ensureAuth, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});


router.post("/signup", signup);
router.post("/login", login);
router.get("/me", ensureAuth, getMe);
router.post("/logout", ensureAuth, logout);

module.exports = router;
