const router = require("express").Router();
const { getPositions } = require("../controllers/positionController");
const { ensureAuth } = require("../middleware/authMiddleware");

router.get("/", ensureAuth, getPositions);

module.exports = router;
