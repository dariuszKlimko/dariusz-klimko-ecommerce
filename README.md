#ecommerce app

## Table of contents
* [General info](#general-info)
* [Prerequire](#prerequire)
* [Technologiess](#technologies)
* [Setup](#setup)
  * [Frontend](#frontend)
  * [Backend](#backend)
* [Run app](#run-app)

## General info
This is fullstack project and this is my second app.

Here is deployed version: https://dariusz-klimko-ecommerce.herokuapp.com/

## Prerequire
 * [stripe](https://stripe.com/en-pl/) account (stripe_pubic_key, stripe_account_id, secret_key_stripe)
 * [mongodb](https://www.mongodb.com/) account (link to database)
 * generate secret for access and refresh tokens
 * [facebook for developers](https://developers.facebook.com/) account (facebook_app_id, facebook_app_secret)
 * [nodemailer](https://nodemailer.com/about/) (nodemailer_email, ndemailer_password, smtp_service, smtp_host, smtp_port)
 * [cloudinary](https://cloudinary.com/) account (cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret, cloudinary_folder_name)(create folder in cloudinary)
## Technologies
* [Node.js](https://nodejs.org/en/)
  * [Express.js](https://expressjs.com/)
  * [React.js](https://create-react-app.dev/)

## Setup
Create folder "Ecommerce".
 * ### Frontend
  Open "Ecommerce" in e.g. vscode editor and run:
  ```
  npx create-react-app frontend
  ```
  In package.json paste: 
  ```
  "proxy": "http://localhost:8000",
  ```
  Download .env file and paste into frontend folder.
  
  Open .env and paste "stripe_pubic_key" and "stripe_account_id".
  
  Replace "your_domain" with "http://localhost:3000".
  
  Open "src" folder and delete all files inside.
  
  Download frontend code from "src" in repository and paste into "src".
  ```
   public/
   src/
     components/
     contexts/
     views/
     App.css
     App.js
     App.test.js
     P24BankSectionStyles.css
     index.css
     index.js
     reportWebVitals.js
     setupTests.js
   .env
   .gitignore
   .README.md
  ```
  Go to "frontend" folder and install packages.
  ```
  cd frontend
  ```
  ```
  npm install @emotion/react@11.4.0 @emotion/styled@11.3.0 @material-ui/core@5.0.0-beta.1 @material-ui/icons@4.11.2 @material-ui/styles@4.11.4
  ```
  ```
  npm install @stripe/react-stripe-js @stripe/stripe-js
  ```
  ```
  npm install react-responsive axios js-cookie react-image-gallery react-router-dom react-social-login-buttons
  ```
 * ### Backend
 In "Ecommerce" create folder "backend".
 
 Download all files (without package.json and package-lock.json) in folders from folder "backend" from repository and paste it into Ecommerce/backend.
 ```
 backend/
   models/
   routes/
   .env
   .gitignore
   app.js
   controlFunction.js
   passport.js
   refreshCollectionInDB.js
 ```
 In file .env insert all keys and ect.
 
 * mongodb_data
 
 * random_access_token_secret
 * random_refresh_token_secret
 
 * facebook_app_id
 * facebook_app_secret
 
 * secret_key_stripe

 * nodemailer_email
 * ndemailer_password
 * smtp_service
 * smtp_host
 * smtp_port

 * your_domain = "http://localhost:3000"

 * cloudinary_cloud_name
 * cloudinary_api_key
 * cloudinary_api_secret
 * cloudinary_folder_name
 
 
 Open "backend" in e.g. vscode editor and run:
  ```
  npm init
  ```
  Install express.js.
  ```
  npm install express
  ```
  Install nodemon.
  ```
  npm install nodemon
  ```
  Open package.json file and find item "scripts" and replace it with:
  ```
  "scripts": {
    "start": "node app.js",
    "app": "nodemon app.js"
  },
  ```
  
  Go to "backend" folder and install packages.
  ```
  cd backend
  ```
  ```
  npm install bcrypt cloudinary cookie-parser cors crypto dotenv http https jsonwebtoken mongoose@5.12.5 mongoose-findorcreate
  ```
  ```
  npm install multer multer-storage-cloudinary nodemailer passport passport-facebook passport-jwt passport-local path stripe
  ```
## Run app
Run backend application.
```
cd backend
```
```
nodemon
```
Run frontend application.
```
cd frontend
```
```
npm start
```
