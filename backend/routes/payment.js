require('dotenv').config()
require('../passport')
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const stripe = require("stripe")(process.env.SECRET_KEY_STRIPE)
const ShoppingCard = require('../models/shoppingCardSchema')
const OrdersCard = require('../models/ordersCardSchema')
const {FinalOrdersCard} = require('../models/finalOrdersCardSchema')
const {Product} = require('../models/productSchema')
const controlFunction = require('../controlFunction')
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
const calculateOrderAmount = (products, shipping) => {
  const result = products.reduce((a,b)=>{
    return a + parseInt(b.productPrice)*parseInt(b.productQuantity)
  },0)
  return (result*100)+parseInt(shipping.shippingPrice)*100
};

const productsNameAndQuantityFunction = (products, shipping) =>{
  const result = products.map(x=>{
    return x.productTitle+'__'+'x'+x.productQuantity
  })
  const newResult = result.join(' ')+'-'+shipping.shippingMethod+' '+shipping.shippingPrice+'pln'
  return newResult
}
// ----------------------------------------------------------------------------
router.post("/create-payment-intent", async (req, res) => {
  const {products, shipping, adress, name, email} = req.body.dataToSend;
  let ordersCard_id = ''
  const ordersCard = new OrdersCard({
    email: email,
    name: name,
    adress: adress,
    shipping: shipping.shippingMethod+' '+shipping.shippingPrice+'pln',
    products: products,
  })
  ordersCard.save()
  .then((result)=>{
    ordersCard_id = result._id
  })
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(products, shipping),
    currency: "pln",
    payment_method_types: ['p24'],
    description: productsNameAndQuantityFunction(products, shipping)
  });
  res.send({
      clientSecret: paymentIntent.client_secret,
      ordersCard_id: ordersCard_id
  })
})
// ----------------------------------------------------------------------------
const totalPriceFunction = (products, shipping) => {
  const result = products.reduce((a,b)=>{
    return a + parseInt(b.productPrice)*parseInt(b.productQuantity)
  },0)
  return (result)+parseInt(shipping)
};

router.put('/paymentSuccessUpdate/:scid/:oc_id', controlFunction.passportJwt, (req, res)=>{
  ShoppingCard.findById(req.params.scid)
  .then(result1=>{
    OrdersCard.findOne({_id: req.params.oc_id})
    .then(result=>{
      const finalOrdersCard = new FinalOrdersCard({
        email: result.email,
        name: result.name,
        adress: result.adress,
        shipping: result.shipping,
        products: result.products,
      })
      finalOrdersCard.save()
      .then(result=>{
        const confirmationString = result.products.map(x=>{
          return (x.productTitle +' '+ x.productQuantity +' '+ 'pcs' +' '+'x'+' '+ x.productPrice +' '+'pln')
        })
        const shipping = result.shipping
        const totalPrice = totalPriceFunction(result.products, result.shipping.match(/\d/g).join(''))
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
          to: result.email,
          subject: 'Order summary',
          text: 'Hello '+ result.name +',\n\n'  + 'You have purchased the following products:' + '\n' +'\t'+ confirmationString.join('\n\t') +'\n\n'+'Shipping method: '+'\t'+ shipping +'\n\n'+'Total price:' +'\t'+ totalPrice+' '+'pln'+'\n\n'+'Shipping adress:'+'\t'+ result.adress +'\n\n'+'email:'+'\t'+ result.email+'\n\nThank You!\n'
        }; 
        transporter.sendMail(mailOptions, (error, info)=>{
          if (error) {
            console.log(error);
          } 
          else { 
            result1.products.forEach(x=>{
              Product.findById(x.productId)
              .then(result=>{
                result.pieces = parseInt(result.pieces) - parseInt(x.productQuantity)
                result.save()
                .then(()=>{
                  console.log('Product card updated')
                })
              })
            })
            console.log('Email sent: ' + info.response);
            OrdersCard.findOneAndDelete({_id: req.params.oc_id})
            .then(()=>{
              console.log('Orders Card Deleted')
            })
            result1.products = []
            result1.save()
            .then(()=>{
              return res.send('paymentSuccessUpdate')
            })
          }
        })
      })
    })
  })
  .catch(error=>res.status(500).send(error))
})
// ----------------------------------------------------------------------------
router.put('/paymentSuccessLocalStoreUpdate/:prid/:oc_id', (req, res)=>{
  const email = req.body.data.email
  const products = req.body.data.newLsShoppingCard
  OrdersCard.findOne({_id: req.params.oc_id})
  .then(result=>{
    const finalOrdersCard = new FinalOrdersCard({
      email: email,
      name: result.name,
      adress: result.adress,
      shipping: result.shipping,
      products: result.products,
    })
    finalOrdersCard.save()
    .then(result=>{
      const confirmationString = result.products.map(x=>{
        return (x.productTitle +' '+ x.productQuantity +' '+ 'pcs' +' '+'x'+' '+ x.productPrice +' '+'pln')
      })
      const shipping = result.shipping
      const totalPrice = totalPriceFunction(result.products, result.shipping.match(/\d/g).join(''))
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
        to: email,
        subject: 'Order completed',
        text: 'Hello '+ result.name +',\n\n'  + 'You have purchased the following products:' + '\n' +'\t'+ confirmationString.join('\n\t') +'\n\n'+'Shipping method: '+'\t'+ shipping +'\n\n'+'Total price:' +'\t'+ totalPrice+' '+'pln'+'\n\n'+'Shipping adress:'+'\t'+ result.adress +'\n\n'+'email:'+'\t'+ email+'\n\nThank You!\n'
      }; 
      transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
          console.log(error);
        } else {
          products.forEach(x=>{
            Product.findById(x.productId)
            .then(result=>{
              result.pieces = parseInt(result.pieces) - parseInt(x.productQuantity)
              result.save()
              .then(()=>{
                console.log('Product saved')
              })
            })
          })
          console.log('Email sent: ' + info.response);
          OrdersCard.findOneAndDelete({_id: req.params.oc_id})
          .then(()=>{
            console.log('Orders Card Deleted')
            return res.send('paymentSuccessUpdate')  
          })
        }
      })
    })
  })
  .catch(error=>res.status(500).send(error))
})

module.exports = router;