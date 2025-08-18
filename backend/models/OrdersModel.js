const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
    name: {
        type: String
    },
    qty: {
        type: Number
    },
    price: {
        type: Number
    },
    mode: {
        type: String
    },
}, {
    timestamps: true
})

const Order = mongoose.model("Order", OrdersSchema);

module.exports = Order;