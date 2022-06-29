const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryName:{
        type: String,
        required: true
    },
    parentId:{
        type: String,
        required: true
    }
},{timestamps: true})

const Category = mongoose.model('category', CategorySchema);
const ConstCategory = mongoose.model('constcategory', CategorySchema);

module.exports ={ Category, ConstCategory};