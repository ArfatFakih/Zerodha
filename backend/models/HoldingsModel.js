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
    }
},{
    timestamps: true
});

const Holding = mongoose.model("Holding", HoldingsSchema);

module.exports = Holding;