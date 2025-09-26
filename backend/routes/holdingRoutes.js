const router = require("express").Router();
const { getHoldings } = require("../controllers/holdingController");
const { ensureAuth } = require("../middleware/authMiddleware");

router.get("/", ensureAuth, getHoldings);

module.exports = router;
