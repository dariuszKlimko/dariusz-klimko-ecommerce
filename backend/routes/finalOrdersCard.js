require('../passport')
const express = require('express')
const router = express.Router()
const {FinalOrdersCard} = require('../models/finalOrdersCardSchema')
const controlFunction = require('../controlFunction')
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
router.post('/userFinalOrdersCard', controlFunction.passportJwt, (req, res)=>{
  FinalOrdersCard.find({email: req.body.data})
  .then(result=>{
    return res.send(result)
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.get('/getFinalOrdersCard', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res)=>{
  FinalOrdersCard.find()
  .then(result=>{
    return res.send(result)
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.put('/updateFinalOrdersCard/:id', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res)=>{
  FinalOrdersCard.findByIdAndUpdate(req.params.id, {orderComplete: req.body.data} , {new: true})
  .then(()=>{
    return res.send('FinalOrdersCard updated')
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.delete('/deleteFinalOrdersCard/:id', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res)=>{
  FinalOrdersCard.findByIdAndDelete(req.params.id)
  .then(()=>{
    return res.send('FinalOrdersCard deleted')
    
  })
  .catch(error=>res.status(500).send(error))
})

module.exports = router;