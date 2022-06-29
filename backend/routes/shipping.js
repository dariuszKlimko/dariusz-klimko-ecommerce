require('../passport')
const express = require('express')
const router = express.Router()
const {Shipping} = require('../models/shippingSchema')
const controlFunction = require('../controlFunction')
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
router.get('/getShipping', (req, res)=>{
  Shipping.find()
  .then(result=>{
    return res.send(result)
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.post('/addShipping', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res)=>{
  const shipping = new Shipping(req.body)
  Shipping.findOne({shippingMethod: req.body.shippingMethod})
  .then(result=>{
    if(result){
      return res.send('This shipping method already exist!!!')
    } else{
      shipping.save()
      .then(()=>{
        return res.send('addShippingOk')
      })
    }
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.put('/updateShipping/:id', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res)=>{
  Shipping.findByIdAndUpdate(req.params.id, req.body.data , {new: true})
  .then(()=>{
    return res.send('updateShipping')
  })
  .catch(error=>res.status(500).send(error));
})
// ----------------------------------------------------------------------------
router.delete('/deleteShipping/:id', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res)=>{
  Shipping.findByIdAndDelete(req.params.id)
  .then(()=>{
    return res.send('deleteteShipping')
  })
  .catch(error=>res.status(500).send(error))
})

module.exports = router;