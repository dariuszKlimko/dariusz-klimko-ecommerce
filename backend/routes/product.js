require('../passport')
const express = require('express')
const router = express.Router()
const {Product} = require('../models/productSchema')
const ShoppingCard = require('../models/shoppingCardSchema')
const controlFunction = require('../controlFunction')
const cloudinary = require("cloudinary").v2;
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
router.use('/photos', express.static('photos'))
// ----------------------------------------------------------------------------
router.get('/products', (req, res, next) => {
  Product.find()
  .then(result=>{
    return result?res.send(result):next()
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.delete("/deleteProduct/:id", [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res, next) => {
  Product.findByIdAndDelete(req.params.id)
  .then(result=>{
    const toDelete = result.imgCollection.map(filePath=>{
      const newFilePath = filePath.substring(filePath.lastIndexOf(`/${process.env.YOUR_FOLDER_NAME}/`) +1);
      const nextNewFilePath = newFilePath.substring(0, newFilePath.lastIndexOf('.'))
      return nextNewFilePath
    })
    cloudinary.api.delete_resources(toDelete, (error, result) => {console.log(result, error, 'delete_resources'); })
    ShoppingCard.find({'products.productId': req.params.id})
    .then(result=>{
      result.forEach(x=>{
        x.products.forEach((y,i,obj)=>{
          if(y.productId==req.params.id){
            obj.splice(i,1)
          }
        })
      })
      result.forEach(x=>{
        x.save()
        .then(()=>{
          console.log('Product Deleted!!!')
        })
      })
      return res.send(result)
    })
  })
  .catch(error=>res.status(500).json(error))
})
// ----------------------------------------------------------------------------
router.post('/addProductCard', [controlFunction.passportJwt, controlFunction.adminAuthenticate, controlFunction.uploadFile], (req, res, next) => {
  const register = JSON.parse(req.body.uploadedFile)
  const imgCollection = []
  req.files.forEach((item)=>{
    imgCollection.push(item.path)
  });
  register.imgCollection=imgCollection;
  Product.findOne({title: register.title})
  .then(result=>{
    if(result){
      return res.send('Title already exist!!!')
    } 
    else{
      const product = new Product(register);
      product.save()
      .then(result=>{
        return result?res.send(result):next()
      }) 
    }
  }).catch(error=>res.status(500).send(error))
});
// ----------------------------------------------------------------------------
router.put('/updateProduct/:id', [controlFunction.passportJwt, controlFunction.adminAuthenticate, controlFunction.uploadFile], (req, res, next) => {
  const register = JSON.parse(req.body.uploadedFile)
  const imgCollection = []
  const toDelete = register.defImgToDelete.map(filePath=>{
    const newFilePath = filePath.substring(filePath.lastIndexOf(`/${process.env.YOUR_FOLDER_NAME}/`) +1);
    const nextNewFilePath = newFilePath.substring(0, newFilePath.lastIndexOf('.'))
    return nextNewFilePath
  })
  cloudinary.api.delete_resources(toDelete, (error, result) => {console.log('delete_resources'); })
  register.defImgCollection.forEach(x=>imgCollection.push(x))
  req.files.forEach(x=>imgCollection.push(x.path))
  register.imgCollection=imgCollection
  delete register['defImgCollection']
  delete register['defImgToDelete']

  Product.findByIdAndUpdate(req.params.id, register)
  .then(result=>{
    const firstResult = result
    ShoppingCard.find({'products.productId': firstResult._id})
    .then(result=>{
      result.forEach(x=>{
        x.products.forEach(y=>{
          if(y.productId==firstResult._id){
            y.productTitle = register.title
            y.productPrice = register.price
            y.productImg = register.imgCollection[0]
            if(y.productQuantity>register.pieces){
            y.productQuantity = register.pieces
            }
          }
        })
      })
      result.forEach(x=>{
        x.save()
        .then(()=>{
          console.log('Product and ShoppingCard updated!!!')
        })
      })
      return result?res.send('Done!!!'):next()
    })
  }) 
  .catch(error=>res.status(500).send(error))
})

module.exports = router;