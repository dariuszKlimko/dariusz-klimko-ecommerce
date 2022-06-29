require('../passport')
const express = require('express')
const router = express.Router()
const ShoppingCard = require('../models/shoppingCardSchema')
const controlFunction = require('../controlFunction')
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
router.put('/addToShoppingCard/:id', controlFunction.passportJwt, (req,res,next)=>{
  ShoppingCard.findOne({userId:req.params.id})
    .then(result=>{
      const newResult = result
      if(newResult.products.length===0){
        newResult.products.push(req.body)
        newResult.save()
        .then(()=>{
          return res.send('Shopping card updated')
        })
      } else{
        const nextResult = result.products.find(x=>x.productId==req.body.productId)
        if(nextResult!==undefined){
          newResult.products.forEach(x=>{
            if(x.productId===req.body.productId){
              x.productQuantity = req.body.productQuantity
              newResult.save()
              .then((result)=>{
                return res.send('Shopping card updated')
              })
            }
          })
        } else{
          newResult.products.push(req.body)
          newResult.save()
          .then(()=>{
            return res.send('Shopping card updated')
          })
        }
      }
  }).catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.put('/addToShoppingCardNotLoggedUser/:id', controlFunction.passportJwt, (req,res,next)=>{
  const lastIndexOfLsShoppingCardArray = req.body.lsShoppingCard.length-1
  ShoppingCard.findOne({userId:req.params.id})
    .then(result=>{
      const newResult = result
      if(newResult.products.length===0){
        req.body.lsShoppingCard.forEach((x, index)=>{
          newResult.products.push({
            productId: x.productId,
            productTitle: x.productTitle,
            productQuantity: x.productQuantity,
            productPrice: x.productPrice,
            productImg: x.productImg
          })
          if(lastIndexOfLsShoppingCardArray==index){
            newResult.save()
            .then(()=>{
              return res.send('Shopping card updated')
            })
          }
        })
      } 
      else{
        req.body.lsShoppingCard.forEach((x, index)=>{
          const nextResult = result.products.find(z=>z.productId==x.productId)
          if(nextResult!==undefined){
            newResult.products.forEach(y=>{
              if(y.productId===x.productId){
                y.productQuantity = parseInt(y.productQuantity) + parseInt(x.productQuantity)
                if(lastIndexOfLsShoppingCardArray==index){
                  newResult.save()
                  .then((result)=>{
                    return res.send('Shopping card updated')
                  })
                }
              }
            })
          } else{
            newResult.products.push(x)
            if(lastIndexOfLsShoppingCardArray==index){
              newResult.save()
              .then(()=>{
                return res.send('Shopping card updated')
              })
            }
          }
        })
      }
  }).catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.post('/getShoppingCard', controlFunction.passportJwt, (req, res, next)=>{
  ShoppingCard.findOne({userId: req.body.id})
  .then(result=>{
    return res.send(result)
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.put('/updateProductInShoppingCard/:scid/:id', controlFunction.passportJwt, (req, res, next)=>{
  ShoppingCard.findById(req.params.scid)
  .then(result=>{
    result.products.forEach(x=>{
      if(x._id==req.params.id){
        x.productQuantity=req.body.updateData.productQuantity
        result.save()
        .then(result=>{
          return res.send(result)
        })
      } else{
        return
      }
    })
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.delete('/deleteAllItems/:scid', controlFunction.passportJwt, (req, res, next)=>{
  ShoppingCard.findById(req.params.scid)
  .then(result=>{
    result.products = []
    result.save()
    .then(()=>{
      return res.send('Items deleted')
    })
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.delete('/deleteProductFromShoppingCard/:scid/:id', controlFunction.passportJwt, (req, res, next)=>{
  ShoppingCard.findById(req.params.scid)
  .then(result=>{
    const newResult = result.products
    .filter(x=>x._id!=req.params.id)
    result.products = newResult
    result.save()
    .then(()=>{
      return res.send('Item deleted')
    })
  })
  .catch(error=>res.status(500).send(error))
})

module.exports = router;