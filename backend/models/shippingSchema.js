const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema({
    shippingMethod:{
        type: String,
        required: true
    },
    shippingPrice:{
        type: String,
        required: true
    },
},{timestamps: true})

const Shipping = mongoose.model('shipping', ShippingSchema);
const ConstShipping = mongoose.model('constshipping', ShippingSchema);

module.exports = {Shipping, ConstShipping};