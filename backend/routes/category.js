require('../passport')
const express = require('express')
const router = express.Router()
const {Category} = require('../models/categorySchema')
const controlFunction = require('../controlFunction')
const {Product} = require('../models/productSchema')
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
router.get('/allCategories', (req, res, next) => {
  Category.find()
  .then(result=>{
    return result?res.send(result):next()
    })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.post('/categories', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res, next) => {
  Category.findOne({categoryName:req.body.categoryName})
  .then(result=>{
    if(result){
      return res.send('Category name already exist!!!')
    } 
    else{
      const category = new Category(req.body)
      category.save()
      .then(result=>{
        return result?res.send(result):next()
      }) 
    }
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.put('/update/:id', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res, next) => {
  Category.findOne({categoryName:req.body.categoryName})
  .then(result=>{
    if(result){
      return res.send('Category name already exist!!!')
    } 
    else{
      Category.findById(req.params.id)
      .then(result=>{
        Product.find({categoryPath: result.categoryName})
        .then(resultProduct=>{
          resultProduct.forEach(x=>{
            if(x.categoryPath.indexOf(result.categoryName)===0){
              x.category=req.body.categoryName
            }
            x.categoryPath[x.categoryPath.indexOf(result.categoryName)] = req.body.categoryName
            x.markModified('categoryPath')
            x.save()
            .then(()=>{
                console.log('categoryPath and/or category updated')
            })
          })
        })
      })
      Category.findByIdAndUpdate(req.params.id, req.body)
      .then(result=>{
        return result?res.send(result):next()
      }) 
    }
  }).catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.delete("/delete/:id", [controlFunction.passportJwt, controlFunction.adminAuthenticate],  (req, res, next) => {
  recursiveDeleteNode=[]
  Category.find({})
  .then(result=>{
    let newArray = recursiveFunction(result, req.params.id)
    newArray.push(req.params.id)
    newArray.map(x=>{
      Category.findByIdAndDelete(x)
      .then(()=>{
        console.log('category deleted')
      })
    })
    return result?res.send(result):next()
  })
  .catch(error=>res.status(500).send(error))
})

let recursiveDeleteNode = []
const recursiveFunction = (cat, parent) =>{
  recursiveDeleteNode = cat
    .filter(x=>x.parentId==parent)
    .map(y=>{
      recursiveFunction(cat, y._id)
      return y._id
    })
  return recursiveDeleteNode
}

module.exports = router;