const mongoose = require('mongoose')

const AccessTokenSchema = new mongoose.Schema({
    accessToken: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        expires: 900, 
        default: Date.now()
    }
},{timestamps: true})

const AccessToken = mongoose.model('AccessToken', AccessTokenSchema);
module.exports = AccessToken;