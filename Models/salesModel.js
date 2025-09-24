const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    Region: {
        type: String
    },
    Country: {
        type: String
    },
    ItemType: {
        type: String
    },
    SalesChannel: {
        type: String
    },
    OrderPriority: {
        type: String
    },
    OrderDate: {
        type: Date
    },
    OrderId: {
        type: String,
        unique: true
    },
    ShipDate: {
        type: Date
    },
    UnitsSold: {
        type: Number
    },
    UnitPrice: {
        type: Number
    },
    UnitCost: {
        type: Number
    },
    TotalRevenue: {
        type: Number
    },
    TotalCost: {
        type: Number
    },
    TotalProfit: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Sales = mongoose.model("Sales", salesSchema)
module.exports = Sales