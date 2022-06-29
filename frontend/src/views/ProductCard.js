import React, { useState, useEffect, useContext, useRef } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import ProductByCategoryPathContext from '../contexts/ProductByCategoryPathContext'
import UserDataContext from '../contexts/UserDataContext'
import AccessTokenContext from '../contexts/AccessTokenContext'
import ShoppingCardContext from '../contexts/ShoppingCardContext'
import IsAdminContext from '../contexts/IsAdminContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css";

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import CircularProgress from '@material-ui/core/CircularProgress';


const ProductCard = () => {

  const params = useParams()

  const urlAddToShoppingCard = '/addToShoppingCard'

  const timerRef = useRef(null);

  let newLocalStorage = []

  const [productQuantity, setProductQuantity] = useState(1)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [productData, setProductData] = useState('')
  const [showFlagHomeButton, setShowFlagHomeButton] = useState(true)
  const [flag, setFlag] = useState(false)

  const [productByCategoryPath, setProductByCategoryPath] = useContext(ProductByCategoryPathContext)
  const [userData, setUserData] = useContext(UserDataContext)
  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [shoppingCard, setShoppingCard] = useContext(ShoppingCardContext)
  const [isAdmin, setIsAdmin] = useContext(IsAdminContext)
  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// -----------------------------------------------------------------------------
  useEffect(()=>{
    return () => clearTimeout(timerRef.current)
  },[])
// -------------------topScrollEffect--------------------------------------------------------
  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth' })
  }, [])
// --------------------productCardEffect----------------------------------------------------
  useEffect(()=>{
  const newProductByCategoryPath =  JSON.parse(JSON.stringify(productByCategoryPath&&productByCategoryPath))
    const newProductData = newProductByCategoryPath&&newProductByCategoryPath
      .filter(x=>{
        return x._id===params._id
      })
      newProductData&&newProductData[0].imgCollection.forEach((x,i,obj)=>{
        obj[i] = {original: x, thumbnail: x, originalWidth: 640, originnalHeight: 400, thumbnailWidth:'10vw' }
      })
      setProductData(...newProductData)
  },[productByCategoryPath])
// --------------------functionProductQuantity-----------------------------------------------
  const functionProductQuantity = (productQuantity, productId) =>{
    if(userData){
      const productStock = productByCategoryPath&&productByCategoryPath.find(x=>{
        return x._id === productId
      })
      const productToCompare = shoppingCard&&shoppingCard.products.find(y=>{
        return y.productId === productId
      })
      const sumResult = parseInt(productQuantity) + parseInt(productToCompare&&productToCompare.productQuantity)
      if(sumResult>parseInt(productStock.pieces)){
        return productStock.pieces
      } else{
        return sumResult
      }
    } 
    else{
      const productStock = productByCategoryPath&&productByCategoryPath.find(x=>{
        return x._id ===productId
      })
      const lsShoppingCardData = JSON.parse(localStorage.getItem('lsShoppingCard'))
      const productToCompare = lsShoppingCardData&&lsShoppingCardData.find(y=>{
        return y.productId === productId
      })
      const sumResult = parseInt(productQuantity) + parseInt(productToCompare&&productToCompare.productQuantity)
      if(sumResult>parseInt(productStock.pieces)){
        return productStock.pieces
      } else{
        return sumResult
      }
    }
  }
// -----------------sortIconVisibilityEffect-------------------------------------------------
  useEffect(()=>{
    setSortIconVisibility(false)
  },[])
// --------------------handleShoppingCard---------------------------------------------------
  const handleShoppingCard = (e) =>{
    e.preventDefault()
    if(userData){
      setFlag(true)
      const config = {
        headers:{
            'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true
      }
      const id = userData[0]._id
      const shoppingCardData = {
          productId: productData._id, 
          productTitle: productData.title, 
          productQuantity: functionProductQuantity(productQuantity,productData._id),
          productPrice: productData.price,
          productImg: productData.imgCollection[0].original
      }

      if(shoppingCard.products.length == 0){
        shoppingCardData.productQuantity = productQuantity
      } 
      else{
        const newShoppingCardData = shoppingCard&&shoppingCard.products.find(x=>{
          return x.productId==shoppingCardData.productId
        })
        if(!newShoppingCardData){
          shoppingCardData.productQuantity = productQuantity
        } 
      }
      axios.put(urlAddToShoppingCard+'/'+id,shoppingCardData, config)
      .then(()=>{
        window.location.reload()
      })
      .catch(error=>console.log(error,'error'))
    } else{
      const lsShoppingCardData = JSON.parse(localStorage.getItem('lsShoppingCard'))
      const shoppingCardData = {
        _id: productData._id,
        productId: productData._id, 
        productTitle: productData.title, 
        productQuantity: functionProductQuantity(productQuantity,productData._id), 
        productPrice: productData.price,
        productImg: productData.imgCollection[0].original
      }
      if(lsShoppingCardData===null){
        shoppingCardData.productQuantity = productQuantity
        newLocalStorage.push(shoppingCardData)
        localStorage.setItem('lsShoppingCard',JSON.stringify(newLocalStorage))
        setConfirmMessage('Done!!!')
        setShowFlagHomeButton(false)
        timerRef.current = setTimeout(() => {
          setConfirmMessage('')
          setShowFlagHomeButton(true)
          window.location.reload()
        }, 1000)
      } else{
        let newLsShoppingCardData = lsShoppingCardData.find(x=>{
          return x.productId==shoppingCardData.productId
        })
        if(!newLsShoppingCardData){
          shoppingCardData.productQuantity = productQuantity
          lsShoppingCardData.push(shoppingCardData)
        } else{
          lsShoppingCardData.forEach((x,i,obj)=>{
            if(x.productId==shoppingCardData.productId){
              obj[i].productQuantity = shoppingCardData.productQuantity
            } 
          })    
        } 
        localStorage.setItem('lsShoppingCard',JSON.stringify(lsShoppingCardData))
        setConfirmMessage('Done!!!')
        setShowFlagHomeButton(false)
        timerRef.current = setTimeout(() => {
          setConfirmMessage('')
          setShowFlagHomeButton(true)
          window.location.reload()
        }, 1000)
      }   
    }
  }
// --------------------setQuantity-----------------------------------------------------------
  const setQuantity = (arg) =>{
    if(parseInt(productQuantity)<=1&&arg===-1){
      setProductQuantity(1)
    }
    else if((parseInt(productQuantity)>=parseInt(productData&&productData.pieces))&&arg===1){
      setProductQuantity(parseInt(productQuantity))
    }
    else{
      setProductQuantity(parseInt(productQuantity)+arg)
    }
  }
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div >
     {!productData&&<div className='pageNotFoundView'>
        <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
      {productData&&<div className='productCardView'>
        {/* <br/>
        <br/> */}
        <div className='productCardViewLayout'>
          <div className='productCardViewLayout1' >
            {productData&& <div className='imageGallery'>
              <ImageGallery 
                items={productData&&productData.imgCollection}
                showBullets={true}
                showIndex={true}
              />
            </div>}
          </div>
          <div className='productCardViewLayout2' >
            <h3>{productData&&productData.title}</h3>
            <h4>{productData&&productData.price} zł</h4>
            <br/>
            <div className='description' >&nbsp;&nbsp;&nbsp;&nbsp;{productData&&productData.description}</div>
            <br/>
            <br/>
            {productData&&productData.pieces} szt
            <br/>
            <br/>
            {productData&&productData.pieces!==0?<div>
              {!isAdmin&&<div className='minusButton' onClick={()=>setQuantity(-1)}>-</div>}
              {!isAdmin&&<span className='divNumberAddProduct'>
                <input
                  className='inputNumberShoppingCard'
                  name='pieces'
                  type='text'
                  value={productQuantity}
                  onKeyDown={(e) => e.key==='Enter'?handleShoppingCard(e):null}
                  onChange={(e)=>{
                    if(e.target.value.replace(/\D/,'')<=1){
                      setProductQuantity(1)
                    }
                    else{
                      if(productData&&productData.pieces>=parseInt(e.target.value.replace(/\D/,''))){
                        setProductQuantity(parseInt(e.target.value.replace(/\D/,'')))
                      }
                      else{
                        setProductQuantity(parseInt(productData&&productData.pieces))
                      }
                    }
                  }}
                />
              </span>}
              {!isAdmin&&<div className='addButton' onClick={()=>setQuantity(1)}>+</div>}
              <br/>
              <br/>
              {!isAdmin&&<Tooltip title='Add to shopping cart' placement="top-start" arrow>
                <IconButton onClick={(e)=>handleShoppingCard(e)}>
                    <AddShoppingCartIcon fontSize="large" />
                </IconButton>
              </Tooltip>}
            </div>:null}
            {userData&&flag&&<div>
              <div ><CircularProgress /><br/>loading...</div>
            </div>}
            {!userData&&<span>{confirmMessage}</span>}
          </div>
        </div>
      </div>}
    </div>
  );
}

export default ProductCard;