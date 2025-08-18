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
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", OrdersSchema);

module.exports = Order;