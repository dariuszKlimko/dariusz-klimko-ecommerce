const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    pieces:{
        type: Number,
        min: 0,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    categoryPath:{
        type: Array,
        required: true
    },
    imgCollection:{
        type: Array,
        required: true
    }
},{timestamps: true})

const Product = mongoose.model('product', ProductSchema);
const ConstProduct = mongoose.model('constproduct', ProductSchema);
const ConstProductProduct = mongoose.model('constproductProduct', ProductSchema);

module.exports ={ Product, ConstProduct, ConstProductProduct};
