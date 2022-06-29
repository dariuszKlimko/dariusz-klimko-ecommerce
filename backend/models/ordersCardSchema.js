const mongoose = require('mongoose')

const OrdersCardSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String,
        required: true
    },
    adress: { 
        type: String,
        required: true
    }, 
    shipping: { 
        type: String,
        required: true
    }, 
    products: {
        type: Array,
        required: true
    },
    paymentComplete: {
        type: String,
        default: false
    },
    orderComplete: {
        type: String,
        default: false
    },
    createdAt: {
        type: Date,
        expires: 2592000,
        default: Date.now()
    }

},{timestamps: true})

const OrdersCard = mongoose.model('OrdersCard', OrdersCardSchema);
module.exports = OrdersCard;


