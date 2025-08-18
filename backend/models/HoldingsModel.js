const mongoose = require('mongoose');

const HoldingsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number
    },
    avg: {
        type: Number
    },
    price: {
        type: Number
    },
    net: {
        type: String
    },
    day: {
        type: String
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
},{
    timestamps: true
});

const Holding = mongoose.model("Holding", HoldingsSchema);

module.exports = Holding;