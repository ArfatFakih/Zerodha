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
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
},{
    timestamps: true
});

const Position = mongoose.model("Position", PositionsSchema);

module.exports = Position;