const Position = require("../models/PositionsModel");

const getPositions = async (req, res) => {
  try {
    const allPositions = await Position.find({ user: req.user._id }).lean();
    res.json(allPositions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch positions", error: error.message });
  }
};

module.exports = { getPositions };
