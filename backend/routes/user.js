require('dotenv').config()
require('../passport')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/userSchema')
const UserRegisterToken = require('../models/userRegisterTokenSchema')
const AccessToken = require('../models/accessTokenSchema')
const ShoppingCard = require('../models/shoppingCardSchema')
const controlFunction = require('../controlFunction')
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
router.get('/users', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res, next)=>{
    User.find()
    .then(result=>{
        const newResult = result.map(x=>{
            return {email:x.email, _id:x._id}
        })
        return res.send(newResult)
    })
    .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.delete('/deleteUser/:id', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res, next)=>{
    User.findByIdAndDelete(req.params.id)
    .then(result=>{
    ShoppingCard.findOneAndDelete({userId: req.params.id})
    .then(()=>{
        return result?res.send('User deleted'):next
    })
    })
    .catch(error=>res.status(500).senr(error))
})
// ----------------------------------------------------------------------------
router.delete('/deleteUserByItself/:id', controlFunction.passportJwt, (req, res, next)=>{
    User.findByIdAndDelete(req.params.id)
    .then(()=>{
        ShoppingCard.findOneAndDelete({userId: req.params.id})
        .then(()=>{
            res.clearCookie('refreshToken')
            return res.send('User deleted')
        })
    })
    .catch(error=>res.status(500).senr(error))
})
// ----------------------------------------------------------------------------
router.post('/userRegister', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(result=>{
    req.body.password = result
    User.findOne({email: req.body.email})
    .then(result=>{
        if(result){
        return res.send('Email already exist')
        }
        const user = new User(req.body);
        user.save()
        .then(result=>{
        const shoppingCard = new ShoppingCard({
            userEmail: result.email, 
            userId: result._id,
            userName: result.userName,
            userAdress: result.adress,
            userTel: result.tel
        })
        shoppingCard.save()
        .then(result=>{
            const clearProducts = result
            clearProducts.products.splice(0,1)
            clearProducts.save()
            .then(()=>{
            const userRegisterToken = new UserRegisterToken({userRegisterToken: crypto.randomBytes(16).toString('hex')} )
            userRegisterToken.save()
            .then(result=>{
                const transporter = nodemailer.createTransport(({
                    service: process.env.SERVICE_NODEMAILER,
                    host: process.env.HOST_NODEMAILER,
                    port: process.env.PORT_NODEMAILER,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_NODEMAILER,
                        pass: process.env.PASSWORD_NODEMAILER
                    }
                })); 
                const mailOptions = {
                    from: process.env.EMAIL_NODEMAILER,
                    to: req.body.email,
                    subject: 'Account verification',
                    text: 'Hello '+ req.body.email +',\n\n'  + 'Please verify your account by clicking the link: \nhttps:\/\/' + req.headers.host + '\/confirmationUserRegister\/' + req.body.email  + '\/' + userRegisterToken.userRegisterToken + '\n\nThank You!\n'
                }; 
                transporter.sendMail(mailOptions, (error, info)=>{
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    return result?res.send('Done!!!'):next()
                }
                })
            })
            })
        })
        })  
    })
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.get('/confirmationUserRegister/:email/:userRegisterToken', (req, res, next) => {
    UserRegisterToken.findOne({ userRegisterToken: req.params.userRegisterToken})
    .then(result=>{
    if(!result){
        return res.redirect(`${process.env.DOMIAN}/confirmationUserRegister/linkExpired`)
    }
    User.findOne({email: req.params.email})
    .then(result=>{
        if(!result){
            return res.redirect(`${process.env.DOMIAN}/confirmationUserRegister/noUserInDataBase`)
        } else if(result.isVerified){
            return res.redirect(`${process.env.DOMIAN}/confirmationUserRegister/userVerified`)
        } else{
        result.isVerified = true
        result.save()
        .then(result=>{
            return result?res.redirect(`${process.env.DOMIAN}/confirmationUserRegister/ok`):next()
        })
        }
    })
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {session: false}, (error, user, info) => { 
        if (error) { return next(err); }
        if (!user) { return res.send(info.message)}
        req.login(user, {session: false}, function(error) {
            if (error) { return next(error); }
            const refreshToken = jwt.sign(crypto.randomBytes(48).toString('hex'), process.env.REFRESH_TOKEN_SECRET)
            user.refreshToken.push(refreshToken)
            user.save()
            .then(result=>{
            const accessToken = new AccessToken({accessToken: jwt.sign({_id: result._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '900s'})})
            accessToken.save()
                .then(result=>{
                    if(result){
                    res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 315360000000), httpOnly: true, sameSite: 'None',  secure: true})
                    res.cookie('refreshTokenExist', true, { expires: new Date(Date.now() + 315360000000)})
                    res.send([{accessToken: accessToken.accessToken, _id: user._id, email: user.email, userName: user.userName, adress: user.adress, tel: user.tel, facebookId: user.facebookId, isAdmin: user.isAdmin}])
                    } else{
                    next()
                    }
                })
            })
            .catch(error=>res.status(500).send(error))
        })     
    })
    (req, res, next)
});
// ----------------------------------------------------------------------------
router.post('/logout', controlFunction.passportJwt, (req, res, next) => {
    User.findOne({refreshToken: req.cookies.refreshToken})
    .then(result=>{
        const index = result.refreshToken.indexOf(req.cookies.refreshToken)
        result.refreshToken.splice(index,1)
        result.save()
        .then(result=>{
            res.clearCookie('refreshToken')
            return result?res.send('You are logged out.'):next()
        })
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.post('/verifyAgain', (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(()=>{
    const userRegisterToken = new UserRegisterToken({userRegisterToken: crypto.randomBytes(16).toString('hex')} )
    userRegisterToken.save()
    .then(result=>{
        const transporter = nodemailer.createTransport(({
            service: process.env.SERVICE_NODEMAILER,
            host: process.env.HOST_NODEMAILER,
            port: process.env.PORT_NODEMAILER,
            secure: true,
            auth: {
                user: process.env.EMAIL_NODEMAILER,
                pass: process.env.PASSWORD_NODEMAILER
            }
        })); 
        const mailOptions = {
        from: process.env.EMAIL_NODEMAILER,
        to: req.body.email,
        subject: 'Account verification',
        text: 'Hello '+ req.body.email +',\n\n'  + 'Please verify your account by clicking the link: \nhttps:\/\/' + req.headers.host + '\/confirmationVerifyAgain\/' + req.body.email  + '\/' + userRegisterToken.userRegisterToken + '\n\nThank You!\n'
        }; 
        transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return result?res.send('Done'):next()
        }
        })
    })
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.get('/confirmationVerifyAgain/:email/:userRegisterToken', (req, res, next) => {
    UserRegisterToken.findOne({ userRegisterToken: req.params.userRegisterToken})
    .then(result=>{
    if(!result){
        return res.redirect(`${process.env.DOMIAN}/confirmationUserRegister/linkExpired`)
    }
    User.findOne({email: req.params.email})
    .then(result=>{
        if(!result){
            res.redirect(`${process.env.DOMIAN}/confirmationUserRegister/noUserInDataBase`)
            next()
        } else if(result.isVerified){
            return res.redirect(`${process.env.DOMIAN}/confirmationUserRegister/userVerified`)
        } else{
            result.isVerified = true
            result.save()
            .then(()=>{
                return res.redirect(`${process.env.DOMIAN}/confirmationUserRegister/ok`);
            })
        }
    })
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.post('/compareActualtPassword', controlFunction.passportJwt, (req, res, next) =>{
    User.findOne({email: req.body.actualEmail})
    .then(result=>{
    bcrypt.compare(req.body.actualPassword, result.password)
    .then(result=>{
        if(result){
            return res.send(true)
        } else{
            res.send(false)
            next()
        }
    })
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.put('/changePassword/:id', controlFunction.passportJwt, (req, res, next) => {
    hashPassword = bcrypt.hashSync(req.body.password, 10)
    User.findByIdAndUpdate(req.params.id, {password: hashPassword} , {new: true})
    .then(result=>{
        return result?res.send('Password has been successfully changed!!!'):next()
    })
    .catch(error=>res.status(500).send(error))
});
// -----------------------------------------------------------------------------
router.post('/resetPasswordLink', (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(result=>{
        const transporter = nodemailer.createTransport(({
            service: process.env.SERVICE_NODEMAILER,
            host: process.env.HOST_NODEMAILER,
            port: process.env.PORT_NODEMAILER,
            secure: true,
            auth: {
                user: process.env.EMAIL_NODEMAILER,
                pass: process.env.PASSWORD_NODEMAILER
            }
        })); 
        const mailOptions = {
        from: process.env.EMAIL_NODEMAILER,
        to: req.body.email,
        subject: 'Account verification',
        text: 'Hello '+ result.email +',\n\n'  + 'Please verify your account by clicking the link: \nhttps:\/\/' + `${process.env.DOMIAN}` + '\/confirmationResetPasswordLink\/' + result._id + '\n\nThank You!\n'
        }; 
        transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return result?res.send('Done'):next()
        }
        })
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.put('/resetPassword/:id', (req, res, next) => {
    hashPassword = bcrypt.hashSync(req.body.password, 10)
    User.findByIdAndUpdate(req.params.id, {password: hashPassword} , {new: true})
    .then(result=>{
        return result?res.send('Password has been successfully changed!!!'):next()
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.put('/updateUser/:id', controlFunction.passportJwt, (req, res, next)=>{
    User.findByIdAndUpdate(req.params.id, req.body , {new: true})
    .then(result=>{
        ShoppingCard.findOneAndUpdate({userId: req.params.id}, 
                                                                {userName: req.body.userName,
                                                                userEmail: req.body.email,
                                                                userAdress: req.body.adress,
                                                                userTel: req.body.tel
                                                                } , {new: true})
        .then(()=>{
            return result?res.send('Profile updated'):next()
        })
    })
    .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.post('/refreshAccessToken', (req, res, next)=>{
    User.findOne({refreshToken: req.cookies.refreshToken})
    .then(result=>{
        if(!result){
            return res.status(401).send('Unauthorized')
        } 
        const accessToken = new AccessToken({accessToken: jwt.sign({_id: result._id}, process.env.ACCESS_TOKEN_SECRET,  {expiresIn: '900s'})})
        accessToken.save()
        .then(result=>{
            return result?res.send({accessToken: accessToken.accessToken}):next()
        }) 
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.post('/refreshAccessTokenWithUserData',  (req, res, next) =>{
    User.findOne({refreshToken: req.cookies.refreshToken})
    .then(result=>{
        const newResult = result
        if(!result){
            return res.status(401).send('Unauthorized')
        } 
        const accessToken = new AccessToken({accessToken: jwt.sign({_id: result._id}, process.env.ACCESS_TOKEN_SECRET,  {expiresIn: '900s'})})
        accessToken.save()
        .then(result=>{
            return result?res.send([{accessToken: accessToken.accessToken, _id: newResult._id, email: newResult.email, userName: newResult.userName, adress: newResult.adress, tel: newResult.tel, facebookId: newResult.facebookId, isAdmin: newResult.isAdmin}]):next()
        })
    })
    .catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.get('/auth/facebook', passport.authenticate('facebook',  {scope: ['email']}));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: `${process.env.DOMIAN}/pageNotFound`,
                                        session: false}),(req, res)=>{
        const refreshToken = jwt.sign(crypto.randomBytes(48).toString('hex'), process.env.REFRESH_TOKEN_SECRET)
        req.user.refreshToken.push(refreshToken)
        const user = new User(req.user)
        user.save()
        .then(result=>{
            const newResult = result
            ShoppingCard.findOne({userId:result._id})
            .then(result=>{
                if(!result){
                    const shoppingCard = new ShoppingCard({
                        userEmail: newResult.email, 
                        userId: newResult._id,
                        userName: newResult.userName,
                        userAdress: newResult.adress,
                        userTel: newResult.tel
                    })
                    shoppingCard.save()
                    .then(result=>{
                        const clearProducts = result
                        clearProducts.products.splice(0,1)
                        clearProducts.save()
                        .then(()=>{
                            const accessToken = new AccessToken({accessToken: jwt.sign({_id: newResult._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '900s'})})
                            accessToken.save()
                            .then(result=>{
                                if(result){
                                    res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 315360000000), httpOnly: true, sameSite: 'None',  secure: true})
                                    res.cookie('refreshTokenExist', true, { expires: new Date(Date.now() + 315360000000)})
                                    res.redirect(`${process.env.DOMIAN}/`)
                                }
                            })
                        })
                    })
                } else if(result){
                    const accessToken = new AccessToken({accessToken: jwt.sign({_id: result._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '900s'})})
                    accessToken.save()
                    .then(result=>{
                    if(result){
                        res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 315360000000), httpOnly: true, sameSite: 'None',  secure: true})
                        res.cookie('refreshTokenExist', true, { expires: new Date(Date.now() + 315360000000)})
                        res.redirect(`${process.env.DOMIAN}/`)
                    } else{
                    next()
                    }
                })
                }
            })
        })
        .catch(error=>res.status(500).send(error))
});

module.exports = router;