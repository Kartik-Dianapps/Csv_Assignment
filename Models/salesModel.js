const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    Region: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    },
    ItemType: {
        type: String
    },
    SalesChannel: {
        type: String,
        required: true
    },
    OrderPriority: {
        type: String,
        required: true
    },
    OrderDate: {
        type: Date,
        required: true
    },
    OrderId: {
        type: String,
        unique: true,
        required: true
    },
    ShipDate: {
        type: Date,
        required: true
    },
    UnitsSold: {
        type: Number,
        required: true
    },
    UnitPrice: {
        type: Number,
        required: true
    },
    UnitCost: {
        type: Number,
        required: true
    },
    TotalRevenue: {
        type: Number,
        required: true
    },
    TotalCost: {
        type: Number,
        required: true
    },
    TotalProfit: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Sales = mongoose.model("Sales", salesSchema)
module.exports = Sales