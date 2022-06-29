import React, {useContext, useState, useEffect} from 'react'
import axios from 'axios';
import '../App.css'
import UserDataContext from '../contexts/UserDataContext';
import ShoppingCardContext from '../contexts/ShoppingCardContext'
import AccessTokenContext from '../contexts/AccessTokenContext'

import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';


const ShoppingCard = (props) => {
  
  const urlPaymentSuccessUpdate = '/paymentSuccessUpdate/'
  const urlPaymentSuccessLocalStoreUpdate = '/paymentSuccessLocalStoreUpdate/'

  const location = new URL(window.location)
  const params = new URLSearchParams(location.search)
  const flag = params.get('redirect_status')

  const [updateQuantity, setUpdateQuantity] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [adress, setAdress] = useState('')
  const [showFlag, setShowFlag] = useState(true)
  const [scid, setScid] = useState('')
  const [prid, setPrid] = useState('')
  const [paymentSuccessFlag, setPaymentSuccessFlag] = useState(false)
  const [paymentSuccessLsFlag, setPaymentSuccessLsFlag] = useState(false)
  const [serverAnswer, setServerAnswer] = useState('')

  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [userData, setUserData] = useContext(UserDataContext)
  const [shoppingCard, setShoppingCard] = useContext(ShoppingCardContext)
  const [lsUserDataFlag, setLsUserDataFlag] = useState(userData&&userData[0]);

  const oc_id = JSON.parse(localStorage.getItem('lsOrdersCard_id'))

// -----------------------------------------------------------------------------------------
  useEffect(()=>{
    if(userData){
      setLsUserDataFlag(userData&&userData[0])
    }
  },[userData])
// ---------------------handleUpdateQuantity------------------------------------------------
  const handleUpdateQuantity = (par,e) =>{
    e.preventDefault()
    const maxPieces = props.productsByCategoryPath.filter(x=>{
      return x._id==par.productId
    })
    if(par.pieces.replace(/\D/,'')<=1){
      setUpdateQuantity(1)
      props.handleUpdateQuantity({pieces: 1, productId: par.productId})
    }
    else if(par.pieces.replace(/\D/,'')>=parseInt(maxPieces[0].pieces)){
      setUpdateQuantity(parseInt(maxPieces[0].pieces))
      props.handleUpdateQuantity({pieces: parseInt(maxPieces[0].pieces), productId: par.productId})  
    }
    else{
      setUpdateQuantity(updateQuantity+1)
      props.handleUpdateQuantity({pieces:parseInt(par.pieces.replace(/\D/,'')), productId:par.productId})
    }
  }
// ---------------------setQuantityFunction------------------------------------------------
  const setQuantity = (par, e) =>{
    e.preventDefault()
    const maxPieces = props.productsByCategoryPath.filter(x=>{
      return x._id==par.productId
    })
    if(parseInt(par.pieces)<=1&&par.arg===-1){
      setUpdateQuantity(1)
      props.handleUpdateQuantity({pieces: 1, productId: par.productId})
    }
    else if(parseInt(par.pieces)>=parseInt(maxPieces[0].pieces)&&par.arg===1){
      setUpdateQuantity(parseInt(maxPieces[0].pieces))
      props.handleUpdateQuantity({pieces: parseInt(maxPieces[0].pieces), productId: par.productId})
    }
    else{
      setUpdateQuantity(updateQuantity+1)
      props.handleUpdateQuantity({pieces:(parseInt(par.pieces)+par.arg), productId:par.productId})
    }
  }
// ---------------------handleUpdate--------------------------------------------------------
  const handleUpdate = (par,e) =>{
    e.preventDefault()
    props.handleUpdate(par,e)
  }
// ---------------------handleDelete--------------------------------------------------------
  const handleDelete = (par,e) =>{
    e.preventDefault()
    props.handleDelete(par,e)
  }
// ---------------------handleDeleteAllItems-------------------------------------------------
  const handleDeleteAllItems = () =>{
    props.handleDeleteAllItems()
    window.location.reload()
  }
// ---------------------handleShippingMethodChoice----------------------------------------------
  const handleShippingMethodChoice = (x) =>{
    props.handleShippingMethodChoice(x)
  }
// ---------------------handleLsUserData-----------------------------------------------------
  const handleLsUserData = (e) =>{
    e.preventDefault()
    props.handleLsUserData({email, name, adress})
    localStorage.setItem('email',JSON.stringify(email))
    setShowFlag(!showFlag)
    setLsUserDataFlag(!lsUserDataFlag)
  }
// ----------------------handleShowFlag------------------------------------------------------
  const handleShowFlag = () =>{
    props.handleShowFlag()
  }
// ----------------------effectForPaymentResult----------------------------------------------
  const callSuccessFunction = () =>{
    return userData&&userData[0]?setPaymentSuccessFlag(true):setPaymentSuccessLsFlag(true)
  }

  useEffect(()=>{
    const newScid = shoppingCard&&shoppingCard._id
    setScid(newScid)
    const newPrid = props.products&&props.products.map(x=>{
      return x._id
    }).join(':')
    setPrid(newPrid)
    if(params.get('redirect_status')==='succeeded'){
      (scid||prid)&&callSuccessFunction()
    }  
    else if(params.get('redirect_status')==='failed'){
      window.location.href = '/paymentFail'
    }
  },[location])
// ---------------------paymentSuccessUpdate------------------------------------------------
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    let timer = null
    if(accessToken&&paymentSuccessFlag){
      const config = {
        headers:{  
        'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
        cancelToken: source.token
      }
      axios.put(urlPaymentSuccessUpdate+scid+'/'+oc_id, '', config)
      .then(()=>{
          setServerAnswer('Paymant succesfull.')
          timer = setTimeout(() => {
            localStorage.removeItem('lsOrdersCard_id')
            window.location.href='/'
            setServerAnswer('')
            }, 1000)
            // return () => {clearTimeout(timer)}
      })
      // .catch(error=>console.log(error,'error'))
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('urlGetFinalOrdersCard cleaned up');
        } else {
          console.log(error,'error')
        }
      })
    }
    return () => {
      source.cancel()
      clearTimeout(timer)
    }
  },[paymentSuccessFlag])
// ---------------------paymentSuccessLocalStoreUpdate------------------------------------------------
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    let timer = null
    if(paymentSuccessLsFlag){
      const lsShoppingCard = JSON.parse(localStorage.getItem('lsShoppingCard'))
      const email = JSON.parse(localStorage.getItem('email'))
      console.log(email,'email effect')
      const newLsShoppingCard = lsShoppingCard.map(x=>{
        return {productId:x.productId, productQuantity: x.productQuantity}
      })
      const data = {email, newLsShoppingCard}
      axios.put(urlPaymentSuccessLocalStoreUpdate+prid+'/'+oc_id, {data}, {cancelToken: source.token})
      .then(()=>{
        setServerAnswer('Paymant succesfull')
        timer = setTimeout(() => {
          localStorage.removeItem('lsShoppingCard')
          localStorage.removeItem('email')
          localStorage.removeItem('lsOrdersCard_id')
          setServerAnswer('')
          window.location.href='/'
        }, 1000)
        // return () => {clearTimeout(timer)}
      })
      // .catch(error=>console.log(error,'error'))
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('urlPaymentSuccessLocalStoreUpdate cleaned up');
        } else {
          console.log(error,'error')
        }
      })
    }
    return () => {
      source.cancel()
      clearTimeout(timer)
    }
  },[paymentSuccessLsFlag])

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div>
       {(paymentSuccessFlag||paymentSuccessLsFlag)&&<div style={{ margin:'auto', textAlign:'center'}}>
        {!serverAnswer&&<div className='pageNotFoundView'>
          <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
        </div>}
        {serverAnswer&&<div style={{marginTop:'15vh'}}>
        <h1 className='serverRes'>{serverAnswer}</h1>
        <div >
            <ThumbUpAltOutlinedIcon fontSize='large'/>
        </div>
      </div>} 
    </div>}
      {(!paymentSuccessFlag||!paymentSuccessLsFlag)&&<div>
        {!props.showFlag&&!flag&&(props.shoppingCard&&!props.shoppingCard[0]||props.shoppingCard===null)&&<h1 style={{marginTop:'20vh'}}>No items to display.</h1>}
        {!props.shoppingCard&&userData&&<div className='pageNotFoundView'>
          <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
        </div>}
        <div className='shoppingCardResponsive'>
        {!flag&&<div className='shoppingCardResponsiveDiv1'>
          {props.shoppingCard&&props.shoppingCard.map(x=>
            <ul style={{padding:'0', listStyleType:'none', overflowX:'auto', whiteSpace:'nowrap'}} key={x._id}>
              <div style={{display:'flex', alignItems:'center'}}>
              <div><img className='finalOrdersCardImg' src={x.productImg} alt='shoppingCard' width='60px' height='38px'/></div>
                &nbsp;
                &nbsp;
                &nbsp;
              <div>{x.productTitle}</div>
                &nbsp;
                &nbsp;
                <div >{x.productPrice} pln/szt</div> 
                &nbsp;
                &nbsp;
                &nbsp;
              <div >
              <div className='minusButtonSCard' onClick={(e)=>setQuantity({arg:-1, pieces: x.productQuantity, productId:x.productId}, e)}>-</div>
              <span className='divAddProduct'>
                <input 
                  className='inputShoppingCard'
                  namne='pieces'
                  type='text'
                  value={x.productQuantity}
                  onKeyDown={(e) => e.key==='Enter'?handleUpdate(x._id,e):null}
                  onChange={(e)=>{
                      handleUpdateQuantity({pieces:e.target.value, productId:x.productId},e)
                  }}
                />
              </span>
              <div className='addButtonSCard' onClick={(e)=>setQuantity({arg:+1, pieces: x.productQuantity, productId:x.productId}, e)}>+</div>
                pcs
              </div>
              &nbsp;
                &nbsp;
                &nbsp;
              <Tooltip title='Update' placement="top-start" arrow>
                <IconButton onClick={(e)=>handleUpdate(x._id,e)}>
                  <CachedOutlinedIcon />
                </IconButton>
              </Tooltip>
              <div>{props.displayChildren[x._id]&&'OK!'}</div>
              <Tooltip title='Delete' placement="top-start" arrow>
                <IconButton onClick={(e)=>{if(window.confirm('Delete the item?')){handleDelete(x._id,e)}}}>
                  <DeleteForeverOutlinedIcon />
                </IconButton>
              </Tooltip>
              &nbsp;
              &nbsp;
              </div>
            <hr/>
            </ul>
          )}
          {props.showFlag&&<br/>}
          {props.showFlag&&<Tooltip title='Delete all items' placement="top-start" arrow>
            <IconButton onClick={()=>{if(window.confirm('Delete all items?')){handleDeleteAllItems()}}}>
              <DeleteForeverOutlinedIcon  fontSize='large'/>
            </IconButton>
          </Tooltip>}
          </div>}
          {!flag&&<div className='shoppingCardResponsiveDiv2'>
          {props.showFlag&&<br/>}
          {props.showFlag&&<h4>Products price: {props.productsPrice} pln</h4>}
          {props.showFlag&&<h4>Shipping method:</h4>}
          {props.showFlag&&!props.shippingList&&!props.shippingList&&<div className='pageNotFoundView'>
            <div><CircularProgress/><br/>loading...</div>
          </div>}
          {props.showFlag&&props.shippingList&&props.shippingList.map(x=><div style={{wordWrap:'break-word'}} key={x._id}>
          <input 
            type='radio'
            name='shippinglist'
            value={x}
            defaultChecked={props.shippingList[0].shippingMethod===x.shippingMethod?true:false}
            onChange={()=>handleShippingMethodChoice(x)}
          />
          {x.shippingMethod}&nbsp;&nbsp;{x.shippingPrice}&nbsp;pln
          </div>)}
          {props.showFlag&&<h3>Total price:</h3>}
          {props.showFlag&&<h2>{props.totalPrice}&nbsp;pln</h2>}
          {!props.userData&&!showFlag&&props.showFlag&&<div>
            <h4>email: {email}</h4>
            <h4>name: {name}</h4>
            <h4>adress: {adress}</h4>
          </div>}
          {!props.userData&&showFlag&&props.showFlag&&(props.productsPrice=='0'?false:true)&&<div>
            <form onSubmit={(e)=>handleLsUserData(e)}>
            <div className='inputDivAddProduct'>
              <input
                className='inputAddProduct'
                required
                type='text'
                placeholder='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              </div>
              <br/>
              <div className='inputDivAddProduct'>
              <input
                className='inputAddProduct'
                required
                type='text'
                placeholder='name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
              </div>
              <br/>
              <div className='inputDivAddProduct'>
              <input
                className='inputAddProduct'
                required
                type='text'
                placeholder='adress'
                value={adress}
                onChange={(e)=>setAdress(e.target.value)}
              />
              </div>
              <br/>
              <Button className='loginButton'  variant='contained' color='inherit' type='submit'>Submit Your data</Button>
            </form>
            <br/>
          </div>}
          {((props.productsPrice)||(!props.showFlagLsData&&props.productsPrice))&&lsUserDataFlag&&(props.showFlag)&&props.showFlag?<Button className='loginButton' variant='contained' onClick={()=>handleShowFlag()}>Finalize transaction</Button>:''}
          </div>}
        </div>
      </div>}
    </div>
  );
}

export default ShoppingCard;