const mongoose = require('mongoose');

const PositionsSchema = new mongoose.Schema({
    product: {
        type: String
    },
    name: {
        type: String
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
    isLoss: {
        type: Boolean
    }
},{
    timestamps: true
});

const Position = mongoose.model("Position", PositionsSchema);

module.exports = Position;