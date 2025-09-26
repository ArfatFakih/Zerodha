const router = require("express").Router();
const { getOrders, createOrder } = require("../controllers/orderController");
const { ensureAuth } = require("../middleware/authMiddleware");

router.get("/", ensureAuth, getOrders);
router.post("/", ensureAuth, createOrder);

module.exports = router;
