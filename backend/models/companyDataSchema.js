const mongoose = require('mongoose')

const CompanyDataSchema = new mongoose.Schema({
    logo: { 
        type: String, 
        required: true 
    },
    streetAndNumber: { 
        type: String,
        required: true
    },
    postCodeAndCity: { 
        type: String,
        required: true
    }, 
    tel: { 
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    }
},{timestamps: true})


const CompanyData = mongoose.model('CompanyData', CompanyDataSchema);
const ConstCompanyData = mongoose.model('ConstCompanyData', CompanyDataSchema);

module.exports = {CompanyData, ConstCompanyData};


