import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import '../App.css'
import ShoppingCardComponent from '../components/ShoppingCardComponent'
import FinalShoppingCardComponent from '../components/FinalShoppingCardComponent'
import AccessTokenContext from '../contexts/AccessTokenContext'
import UserDataContext from '../contexts/UserDataContext'
import ProductByCategoryPathContext from '../contexts/ProductByCategoryPathContext'
import ShoppingCardContext from '../contexts/ShoppingCardContext'
import ShippingListContext from '../contexts/ShippingListContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'


const ShoppingCard = () => {

  const urlDeleteAllItemsShoppingCard = '/deleteAllItems'
  const urlDeleteProductFromShoppingCard = '/deleteProductFromShoppingCard'
  const urlUpdateProductInShoppingCard = '/updateProductInShoppingCard'

  const timerRef = useRef(null);

  const [updateData, setUpdateData] = useState('')
  const [displayChildren, setDisplayChildren] = useState({})
  const [productsPrice, setProductsPrice] = useState(0)
  const [lsShoppingCardData, setLsShoppingCardData] = useState([])
  const [lsProductsPrice, setLsProductsPrice] = useState(0)
  const [refresh, setRefresh] = useState(true)
  const [lsUpdateData, setLsUpdateData] = useState('')
  const [shippingMethodChoice, setShippingMethodChoice] = useState('')
  const [totalPrice, setTotalPrice] = useState('')
  const [lsTotalPrice, setLsTotalPrice] = useState('')
  const [showFlag, setShowFlag] = useState(true)
  const [lsUserData, setLsUserData] = useState('')
  const [showFlagLsData, setShowFlagLsData] = useState(true)

  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [userData, setUserData] = useContext(UserDataContext)
  const [productsByCategoryPath, setProductsByCategoryPath] = useContext(ProductByCategoryPathContext)
  const [shoppingCard, setShoppingCard] = useContext(ShoppingCardContext)
  const [shippingList, setShippingList] = useContext(ShippingListContext)
  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

  const showFlagUser = shoppingCard&&shoppingCard.products[0]
  const showFlagLocalStorage = JSON.parse(localStorage.getItem('lsShoppingCard'))

// -----------------------------------------------------------------------------
  useEffect(()=>{
    return () => clearTimeout(timerRef.current)
  },[])
// ---------------------handleDeleteAllItems------------------------------------------------   
  const handleDeleteAllItems = () =>{
    if(userData){
      const config = {
        headers:{  
        'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true
      }
      const scid = shoppingCard._id
      axios.delete(urlDeleteAllItemsShoppingCard+'/'+scid, config)
      .then(()=>{
        localStorage.removeItem('lsOrdersCard_id')
        window.location.reload()
      })
      .catch(error=>console.log(error))
    } else{
      setLsShoppingCardData(null)
      localStorage.removeItem('lsShoppingCard')
      localStorage.removeItem('email')
      localStorage.removeItem('lsOrdersCard_id')
      setRefresh(!refresh)
    }
  }
// ---------------------updatePieces--------------------------------------------------------
  const setUpdateDataFunction = (arg) =>{
    if(userData){
      const newShoppingCard = shoppingCard&&shoppingCard.products
      .filter(x=>{
        return x.productId===arg.productId
      })
      newShoppingCard[0].productQuantity = arg.pieces
      return newShoppingCard[0]
    } 
    else{
      const newLsShoppingCardData = lsShoppingCardData.map(x=>{
        if(x.productId===arg.productId){
          x.productQuantity = arg.pieces
          return x
        } 
        else{
          return x
        }
      })
      return newLsShoppingCardData
    }
  }

  const handleUpdateQuantity = (arg) =>{
    if(userData){
      if(arg.pieces!==''){
        setUpdateData(setUpdateDataFunction(arg))
      }
    } else{
      if(arg.pieces!==''){
        setLsUpdateData(setUpdateDataFunction(arg))
      }
    }
  }
// --------------------handleDelete---------------------------------------------------------
  const handleDelete = (id, e) =>{
    e.preventDefault()
    if(userData){
      const scid = shoppingCard._id
      const config = {
        headers:{  
        'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true
      }
      axios.delete(urlDeleteProductFromShoppingCard+'/'+scid+'/'+id, config)
      .then(()=>{
        window.location.reload()
      })
      .catch(error=>console.log(error))
    } else{
      lsShoppingCardData.forEach((x,i,obj)=>{
        if(x.productId===id){
          obj.splice(i,1)
          localStorage.setItem('lsShoppingCard' ,JSON.stringify(obj))
          setRefresh(!refresh)
          if(obj.length==0){
            localStorage.removeItem('lsShoppingCard')
            setRefresh(!refresh)
          }
        }
      })
    }
  }
// --------------------handleUpdate---------------------------------------------------------
  const handleUpdate = (id, e) =>{
    if(userData){
      e.preventDefault()
      const scid = shoppingCard._id
      const config = {
        headers:{  
        'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true
      }
      axios.put(urlUpdateProductInShoppingCard+'/'+scid+'/'+id, {updateData}, config)
      .then(()=>{
        setDisplayChildren({...displayChildren, [id]: !displayChildren.id})
        timerRef.current = setTimeout(() => {
          setDisplayChildren({})
        }, 1000)
      })
    } else{
      if(lsUpdateData){
        localStorage.setItem('lsShoppingCard',JSON.stringify(lsUpdateData))
        setDisplayChildren({...displayChildren, [id]: !displayChildren.id})
        timerRef.current = setTimeout(() => {
          setDisplayChildren({})
        }, 1000)
      }
    }
  }
// --------------------handleSubmit----------------------------------------------------------
  const handleLsUserData = (arg) =>{
    setLsUserData({email: arg.email, userName: arg.name, adress: arg.adress})
    setShowFlagLsData(!showFlagLsData)
  }
// --------------------handleShowFlag--------------------------------------------------------
  const handleShowFlag = () =>{
    setShowFlag(!showFlag)
  }
// --------------------handleShippingMethodChoice--------------------------------------------
  const handleShippingMethodChoice = (x) =>{
    setShippingMethodChoice({shippingMethod: x.shippingMethod, shippingPrice: x.shippingPrice})
  }
// --------------------initialaShippingMethodChoice------------------------------------------
  useEffect(()=>{
    setShippingMethodChoice({shippingMethod: shippingList&&shippingList[0].shippingMethod, shippingPrice: shippingList&&shippingList[0].shippingPrice})
  },[shippingList])
// --------------------productsPrice---------------------------------------------------------
  useEffect(()=>{
    const newShoppingCard = shoppingCard&&shoppingCard.products
    .map(x=>{return parseInt(x.productQuantity)*parseInt(x.productPrice)})
    .reduce((a, b) =>{return a + b},0)
    setProductsPrice(newShoppingCard)
  },[shoppingCard, displayChildren])
// --------------------totalPrice-----------------------------------------------------------
  useEffect(()=>{
    setTotalPrice(parseInt(productsPrice)+parseInt(shippingMethodChoice.shippingPrice))
  },[shippingMethodChoice, productsPrice])
// --------------------effectLocalStore-----------------------------------------------------
  useEffect(()=>{
    setLsShoppingCardData(JSON.parse(localStorage.getItem('lsShoppingCard')))
  },[refresh, productsByCategoryPath, lsProductsPrice])
// --------------------lsProductsPrice---------------------------------------------------------
  useEffect(()=>{
    const newLsShoppingCardData = lsShoppingCardData&&lsShoppingCardData
    .map(x=>{return parseInt(x.productQuantity)*parseInt(x.productPrice)})
    .reduce((a, b) =>{return a + b},0)
    setLsProductsPrice(newLsShoppingCardData)
  })
// --------------------lsTotalPrice---------------------------------------------------------
  useEffect(()=>{
    setLsTotalPrice(parseInt(lsProductsPrice)+parseInt(shippingMethodChoice.shippingPrice))
  },[shippingMethodChoice, lsProductsPrice])
// --------------------updateLsShoppingCardData----------------------------------------------
  useEffect(()=>{
    if(lsShoppingCardData){
      const newLsShoppingCardData = lsShoppingCardData&&lsShoppingCardData.filter(x=>{
        return productsByCategoryPath&&productsByCategoryPath.find(y=>{
          if(x.productId===y._id){
            return x
          } 
        })
      })
      if(newLsShoppingCardData.length===0){
      }else{
        newLsShoppingCardData&&newLsShoppingCardData.forEach((x,i,obj)=>{
          const newY = productsByCategoryPath&&productsByCategoryPath.find(y=>{
            return y._id===x.productId
          })
          obj[i].productTitle = newY.title
          obj[i].productPrice = newY.price
          obj[i].productImg = newY&&newY.imgCollection[0]
          if(parseInt(x.productQuantity)>parseInt(newY.pieces)){
            obj[i].productQuantity = newY.pieces
          }
        })
        localStorage.setItem('lsShoppingCard',JSON.stringify(newLsShoppingCardData))
        setLsShoppingCardData(newLsShoppingCardData)
      }
    }
  },[productsByCategoryPath, lsProductsPrice])
// -----------------sortIconVisibilityEffect-------------------------------------------------
  useEffect(()=>{
    setSortIconVisibility(false)
  },[])

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='shoppingCardView'>
      {showFlag&&<ShoppingCardComponent
        displayChildren={displayChildren}
        productsPrice={userData?productsPrice:lsProductsPrice}
        totalPrice={userData?totalPrice:lsTotalPrice}
        userData={userData&&userData[0]}
        productsByCategoryPath={productsByCategoryPath}
        shoppingCard={userData?(shoppingCard&&shoppingCard.products):(lsShoppingCardData)}
        products={userData?(shoppingCard&&shoppingCard.products):lsShoppingCardData}
        showFlag={userData?showFlagUser:(showFlagLocalStorage&&showFlagLocalStorage[0])}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        handleDeleteAllItems={handleDeleteAllItems}
        handleUpdateQuantity={handleUpdateQuantity}
        shippingList={shippingList}
        handleShippingMethodChoice={handleShippingMethodChoice}
        handleLsUserData={handleLsUserData}
        handleShowFlag={handleShowFlag}
      />}
      {!showFlag&&<FinalShoppingCardComponent
        shippingMethodChoice={shippingMethodChoice}
        products={userData?(shoppingCard&&shoppingCard.products):lsShoppingCardData}
        productsPrice={userData?productsPrice:lsProductsPrice}
        totalPrice={userData?totalPrice:lsTotalPrice}
        userData={userData?userData[0]:lsUserData}
        shoppingCard={userData?(shoppingCard&&shoppingCard.products):lsShoppingCardData}
      />}
    </div>
  );
}

export default ShoppingCard;