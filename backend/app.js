require('dotenv').config()
require('./passport')
const path = require('path');
const express = require('express')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user')
const shoppingCardRoutes = require('./routes/shoppingCard')
const paymentRoutes = require('./routes/payment')
const shippingRoutes = require('./routes/shipping')
const finalOrdersCardRoutes = require('./routes/finalOrdersCard')
const companyDataRoutes = require('./routes/companyData')
const http = require('http')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const allFunction = require('./refreshCollectionInDB')


const app = express()

const port = process.env.PORT || 8000;

const dbURI = process.env.DB_MONGO;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
.then(()=>{
  http.createServer(app).listen(port)
})
.catch((err)=>console.log(err))

app.use(cors({origin: [`${process.env.DOMIAN}/`, "http://localhost:3000/"],credentials: true}))
app.use(express.json())
app.use(express.static("."));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'build')));
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// ------------------------reloadDB------------------------------------------
// setInterval(allFunction, 1200000)
// setInterval(allFunction, 10000)

// ------------------------Categories------------------------------------------
app.use(categoryRoutes)
// ------------------------Products--------------------------------------------
app.use(productRoutes)
// ------------------------Users-----------------------------------------------
app.use(userRoutes)
// ------------------------ShoppingCards---------------------------------------
app.use(shoppingCardRoutes)
// ------------------------Payments--------------------------------------------
app.use(paymentRoutes)
// ------------------------Shipping--------------------------------------------
app.use(shippingRoutes)
// ------------------------FinalOrdersCard-------------------------------------
app.use(finalOrdersCardRoutes)
// ------------------------CompanyData-------------------------------------
app.use(companyDataRoutes)
// ------------------------herokuDeploy
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// ------------------------PageNotFound----------------------------------------
app.use('/error',(req,res)=>{
  return res.status(404).end('Page not foud')
});
