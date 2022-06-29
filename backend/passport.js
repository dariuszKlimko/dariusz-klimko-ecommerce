require('dotenv').config()
const passport = require('passport')
const bcrypt = require('bcrypt')
const passportJWT = require("passport-jwt")
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy  = passportJWT.Strategy
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/userSchema')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function( email, password, done) {
       User.findOne({email: email}, async function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, {message: 'Incorrect username'}); }
        if (!await bcrypt.compare(password, user.password)) { 
            return done(null, false,  {message: 'Incorrect password'}); 
        }
        if (!user.isVerified) { 
            return done(null, false, {message: 'User is not verified'}); 
        }
            return done(null, user);
      });
    }
));
// -----------------------------------------------------------------------------------
const headerExtractor = function(req) {
    var accessToken = null;
    let authHeader = req.headers['authorization']
    accessToken = authHeader && authHeader.split(' ')[1];
    return accessToken;
};

passport.use(new JwtStrategy({
    jwtFromRequest: headerExtractor,
    secretOrKey   : process.env.ACCESS_TOKEN_SECRET
}, function(jwtPayload, done) {
    User.findById(jwtPayload, function(err, user) {
        if (err) { return done(err, false);}
        if (user) {return done(null, user);
        } else { return done(null, false);}
    })
}));
// -----------------------------------------------------------------------------------
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.DOMIAN}/auth/facebook/callback`,
    profileFields: ['id', 'email', 'displayName']
  },
  
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id, email: profile.emails[0].value, userName: profile.displayName}, function(err, user) {
      if (err) { return done(err); }
      console.log(user,'user')
      done(null, user);
    });
  }
));