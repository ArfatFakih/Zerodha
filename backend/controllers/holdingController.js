const Holding = require("../models/HoldingsModel");

const getHoldings = async (req, res) => {
  try {
    const allHoldings = await Holding.find({ user: req.user._id }).lean();
    res.json(allHoldings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch holdings", error: error.message });
  }
};

module.exports = { getHoldings };
