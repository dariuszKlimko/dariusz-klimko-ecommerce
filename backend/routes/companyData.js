require('../passport')
const express = require('express')
const router = express.Router()
const {CompanyData} = require('../models/companyDataSchema')
const controlFunction = require('../controlFunction')
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
router.get('/companyData', (req, res)=>{
  CompanyData.find()
  .then(result=>{
    return res.send(result)
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.put('/putCompanyData', [controlFunction.passportJwt, controlFunction.adminAuthenticate], (req, res)=>{
  console.log(req.body, 'put')
  CompanyData.findOneAndUpdate(req.body.email, 
    {
      logo: req.body.logo,
      streetAndNumber: req.body.streetAndNumber,
      postCodeAndCity: req.body.postCodeAndCity,
      tel: req.body.tel,
      email: req.body.email
    } , {new: true})
  .then(()=>{
    return res.send('Company data updated')
  })
  .catch(error=>res.status(500).send(error))
})

module.exports = router;