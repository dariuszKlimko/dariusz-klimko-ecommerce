const cloudinary = require("cloudinary").v2;
const {Product, ConstProduct} = require('./models/productSchema');
const {Category, ConstCategory} = require('./models/categorySchema');
const {FinalOrdersCard, ConstFinalOrdersCard} = require('./models/finalOrdersCardSchema');
const {CompanyData, ConstCompanyData} = require('./models/companyDataSchema')
const {Shipping, ConstShipping} = require('./models/shippingSchema')
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.YOUR_API_KEY,
  api_secret: process.env.YOUR_API_SECRET
});
// ----------------------------------------------------------------------
const productsDB = () =>{
  Product.deleteMany()
  .then(()=>{
    cloudinary.api.delete_resources_by_prefix(`${process.env.YOUR_FOLDER_NAME}/`, (result) => {console.log('resources deleted')})
    ConstProduct.find()
    .then(result=>{
      Product.insertMany(result)
      .then(resultProduct=>{
        resultProduct.forEach(x=>{
          x.imgCollection = []
          x.save()
        })
      })
      .then(()=>{
        result.map(x=>{
          x.imgCollection.map(y=>{
            cloudinary.uploader.upload(process.env.CLOUDINARY_FULL_PATH_TO_PICTURE, 
            { folder: process.env.CLOUDINARY_FOLDER_WITCH_PICTURE, 
              public_id: y+'_'+x.title },
            (error, resultCloudinary) => {
              const extract = decodeURI(resultCloudinary.url).match(/\_(.*)\./).pop();
              Product.findOne({title: extract})
              .then(resultExtract=>{
                resultExtract.imgCollection.push(decodeURI(resultCloudinary.url))
                resultExtract.save()
              })
            });
          })
        })
        console.log('product reloaded')
      })
    })
  })
  .catch(error => console.log(error,'error'))
}
// ----------------------------------------------------------------------
const categoriesDB = () =>{
 Category.deleteMany()
  .then(()=>{
    ConstCategory.find()
    .then(result=>{
      Category.insertMany(result)
      .then(()=>{
        console.log('category reloaded')
      })
    })
  })
  .catch(error => console.log(error,'error'))
}
// ----------------------------------------------------------------------
const finalOrdersCardsDB = () =>{
  FinalOrdersCard.deleteMany()
  .then(()=>{
    ConstFinalOrdersCard.find()
    .then(result=>{
      FinalOrdersCard.insertMany(result)
      .then(()=>{
        console.log('finalOrdersCards reloaded')
      })
    })
  })
  .catch(error => console.log(error,'error'))
}
// ----------------------------------------------------------------------
const companyDataDB = () =>{
  CompanyData.deleteMany()
  .then(()=>{
    ConstCompanyData.find()
    .then(result=>{
      CompanyData.insertMany(result)
      .then(()=>{
        console.log('companyData reloaded')
      })
    })
  })
  .catch(error => console.log(error,'error'))
}
// ----------------------------------------------------------------------
const shippingDB = () =>{
  Shipping.deleteMany()
  .then(()=>{
    ConstShipping.find()
    .then(result=>{
      Shipping.insertMany(result)
      .then(()=>{
        console.log('shipping reloaded')
      })
    })
  })
  .catch(error => console.log(error,'error'))
}
// ----------------------------------------------------------------------
const allFunction = () =>{
  productsDB()
  categoriesDB()
  finalOrdersCardsDB()
  companyDataDB()
  shippingDB()
}
// ----------------------------------------------------------------------
module.exports = allFunction;
