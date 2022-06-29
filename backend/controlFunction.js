const passport = require('passport')
const multer = require('multer')
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.YOUR_API_KEY,
    api_secret: process.env.YOUR_API_SECRET
});
  
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.YOUR_FOLDER_NAME,

    },
});

const upload = multer({ storage: storage });
// ----------------------------------------------------------------------
const middleware = {
    passportJwt: passport.authenticate('jwt', { session: false}),
    uploadFile: upload.array('uploadedFile', 10),
    adminAuthenticate: (req, res, next)=>{return req.user.isAdmin ? next() : res.status(401).send('Unauthorized')}
}
// ----------------------------------------------------------------------
module.exports = {
    passportJwt: middleware.passportJwt,
    adminAuthenticate: middleware.adminAuthenticate,
    uploadFile: middleware. uploadFile
}