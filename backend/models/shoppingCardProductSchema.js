const mongoose = require('mongoose')

const ShoppingCardProductSchema = new mongoose.Schema({
    productId: { 
        type: String, 
    },
    productTitle: { 
        type: String,  
    },
    productQuantity: { 
        type: String, 
    },
    productPrice: { 
        type: String,  
    },
    productImg: { 
        type: String
    }
},{timestamps: true})

module.exports = ShoppingCardProductSchema;