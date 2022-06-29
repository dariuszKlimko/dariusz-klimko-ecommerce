const mongoose = require('mongoose')

const UserRegisterTokenSchema = new mongoose.Schema({
    userRegisterToken: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        expires: '55s',
        default: Date.now 
    }
},{timestamps: true})

const UserRegisterToken = mongoose.model('UserRegisterToken', UserRegisterTokenSchema);
module.exports = UserRegisterToken;