const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
    email:{
        type: String
    },
    password:{
        type: String
    },
    adress:{
        type: String,
        default: 'adress'
    },
    userName:{
        type: String,
        default: 'name'
    },
    tel:{
        type: String,
        default: 'tel.'
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    },
    facebookId:{
        type: String,
        default: ''
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    refreshToken: { 
        type: Array
    }
},{timestamps: true})

UserSchema.plugin(findOrCreate)
const User = mongoose.model('user', UserSchema);
module.exports = User;