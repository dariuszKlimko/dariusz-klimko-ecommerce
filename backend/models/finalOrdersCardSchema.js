const mongoose = require('mongoose')

const FinalOrdersCardSchema = new mongoose.Schema({
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
        default: true
    },
    orderComplete: {
        type: String,
        default: false
    }
},{timestamps: true})

const FinalOrdersCard = mongoose.model('FinalOrdersCard', FinalOrdersCardSchema);
const ConstFinalOrdersCard = mongoose.model('ConstFinalOrdersCard', FinalOrdersCardSchema);

module.exports = {FinalOrdersCard, ConstFinalOrdersCard};


