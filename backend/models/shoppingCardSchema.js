const mongoose = require('mongoose')
const ShoppingCardProductSchema = require('./shoppingCardProductSchema')

const ShoppingCardSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    userEmail: { 
        type: String, 
        required: true 
    },
    userName: { 
        type: String
    },
    userAdress: { 
        type: String 
    }, 
    userTel: { 
        type: String 
    },
    products: {
        type: [ShoppingCardProductSchema],
        default: ['']
    }
},{timestamps: true})

const ShoppingCard = mongoose.model('shoppingCard', ShoppingCardSchema);
module.exports = ShoppingCard;


