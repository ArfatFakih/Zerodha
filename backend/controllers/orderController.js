const Order = require("../models/OrdersModel");
const Holding = require("../models/HoldingsModel");
const Position = require("../models/PositionsModel");

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).lean();
    res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Create order and update holdings & positions
const createOrder = async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save the order
    const newOrder = new Order({
      name,
      qty,
      price,
      mode,
      user: req.user._id,
    });
    await newOrder.save();

    // Update Holdings
    let holding = await Holding.findOne({ user: req.user._id, name });
    if (mode === "BUY") {
      if (holding) {
        // Update avg price and qty
        const totalQty = holding.qty + qty;
        const totalCost = holding.avg * holding.qty + price * qty;
        holding.qty = totalQty;
        holding.avg = totalCost / totalQty;
      } else {
        holding = new Holding({ user: req.user._id, name, qty, avg: price, price, net: "0", day: "0", isLoss: false });
      }
      await holding.save();
    } else if (mode === "SELL") {
      if (holding && holding.qty >= qty) {
        holding.qty -= qty;
        if (holding.qty === 0) {
          await Holding.deleteOne({ _id: holding._id });
        } else {
          await holding.save();
        }
      } else {
        return res.status(400).json({ message: "Not enough holdings to sell" });
      }
    }

    // Update Positions
    let position = await Position.findOne({ user: req.user._id, name });
    if (mode === "BUY") {
      const curQty = (position ? position.qty : 0) + qty;
      const totalCost = (position ? position.avg * position.qty : 0) + price * qty;
      const avgPrice = totalCost / curQty;
      const curPrice = price; // Latest price
      const netPL = ((curPrice - avgPrice) * curQty).toFixed(2);

      if (position) {
        position.qty = curQty;
        position.avg = avgPrice;
        position.price = curPrice;
        position.net = netPL;
      } else {
        position = new Position({
          user: req.user._id,
          name,
          product: "EQ", // example, can be dynamic
          qty: curQty,
          avg: avgPrice,
          price: curPrice,
          net: netPL,
          day: "0",
          isLoss: netPL < 0,
        });
      }
      await position.save();
    } else if (mode === "SELL") {
      if (position && position.qty >= qty) {
        position.qty -= qty;
        if (position.qty === 0) {
          await Position.deleteOne({ _id: position._id });
        } else {
          position.price = price;
          const netPL = ((position.price - position.avg) * position.qty).toFixed(2);
          position.net = netPL;
          position.isLoss = netPL < 0;
          await position.save();
        }
      }
    }

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

module.exports = { getOrders, createOrder };
