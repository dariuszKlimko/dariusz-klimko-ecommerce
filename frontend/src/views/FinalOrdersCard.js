import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import '../App.css'
import AccessTokenContext from '../contexts/AccessTokenContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


const FinalOrdersCard = () => {

  const urlGetFinalOrdersCard = '/getFinalOrdersCard'
  const urlUpdateFinalOrdersCard = '/updateFinalOrdersCard/'
  const urlDeleteFinalOrdersCard = '/deleteFinalOrdersCard/'

  const timerRef = useRef(null);

  const [ordersCompleted, setOrdersCompleted] = useState('')
  const [paymantCompleted, setPaymantCompleted] = useState('')
  const [serverRes, setServerRes] = useState('')
  const [flagUpdate, setFlagUpdate] = useState(false)
  const [flagDelete, setFlagDelete] = useState(false)

  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// -----------------------------------------------------------------------------------------
  useEffect(()=>{
    return () => clearTimeout(timerRef.current)
  },[])
// --------------------getFinalOrdersCard----------------------------------------------------
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if(accessToken){
      const config = {
        headers:{
            'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
        cancelToken: source.token
      }
      axios.get(urlGetFinalOrdersCard, config)
      .then(response=>{
        const dataPayment = response.data.filter(x=>{
          return x.orderComplete==='false'
        })
        setPaymantCompleted(dataPayment)

        const dataComplete = response.data.filter(x=>{
          return x.orderComplete==='true'
        })
        setOrdersCompleted(dataComplete)

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
    return () => source.cancel()
  },[accessToken])
// ------------------handelUpdateFinalOrdersCard---------------------------------------------
  const handelUpdateFinalOrdersCard = (id, e) =>{
    setFlagUpdate(true)
    const config = {
      headers:{
          'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    }
    const data = true
    axios.put(urlUpdateFinalOrdersCard+id, {data}, config)
    .then(response=>{
      setServerRes(response.data)
      timerRef.current = setTimeout(()=>{
        setServerRes('')
        window.location.reload()
      },1500)
    })
    .catch(error=>console.log(error,'error'))
  }
// -----------------sortIconVisibilityEffect-------------------------------------------------
  useEffect(()=>{
    setSortIconVisibility(false)
  },[])
// -----------------handelDeleteFinalOrdersCard----------------------------------------------
  const handelDeleteFinalOrdersCard = (id, e) =>{
    setFlagDelete(true)
    const config = {
      headers:{
          'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    }
    const data = true
    axios.delete(urlDeleteFinalOrdersCard+id, config)
    .then(response=>{
      setServerRes(response.data)
      timerRef.current = setTimeout(()=>{
        setServerRes('')
        window.location.reload()
      },1500)
    })
    .catch(error=>console.log(error,'error')) 
  }
// -----------------------setFlagsFalse------------------------------------------------------
  useEffect(()=>{
    setFlagUpdate(false)
    setFlagDelete(false)
  },[serverRes])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div>
      {!paymantCompleted&&!ordersCompleted&&<div className='pageNotFoundView'>
        <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
      <div className='finalOrdersCardView'>
        <div className='finalOrdersCardViewLayout'>
          <h3>Paymant completed</h3><hr/><hr/><hr/>
          <br/>
          {paymantCompleted&&paymantCompleted.map((x)=><div style={{ margin:'auto', textAlign:'center'}} key={x._id}>
              {x.products.map((y)=><div style={{margin:'auto', width:'10vw'}} key={y._id}>
                <div style={{display:'flex', justifyContent:'left', alignItems:'center', width:'6vw'}}>
                <img className='finalOrdersCardImg' src={y.productImg}  alt='Product' width='100%' height='auto'/>&nbsp;&nbsp;
                  {y.productTitle}&nbsp;&nbsp;
                  {y.productQuantity}pcs&nbsp;&nbsp;
                  {y.productPrice}pln
                </div>
                <br/>
              </div>)}
            <div>
              <h5>{x.createdAt.substr(0,10)}</h5>
              <h5>{x.email}</h5>
              <h5>{x.adress}</h5>
              <h5>{x.shipping}</h5>
            </div>
            <Button className='finalOrdersButton'  variant='contained' color='inherit' onClick={(e)=>{if(window.confirm('Order completed?')){handelUpdateFinalOrdersCard(x._id, e)}}}><div style={{fontSize:'1vw', whiteSpace:'nowrap'}}>Order completed</div></Button>
            {flagUpdate&&<div className='pageNotFoundView'>
              <div ><CircularProgress/><br/>loading...</div>
            </div>}
            <br/>
            <hr/>
            <br/>
          </div>)}
        </div>
        <div className='finalOrdersCardViewLayout'>
          <h3>Orders completed</h3><hr/><hr/><hr/>
          <br/>
          {ordersCompleted&&ordersCompleted.map((x)=><div style={{ margin:'auto', textAlign:'center'}} key={x._id}>
              {x.products.map((y)=><div style={{margin:'auto', width:'10vw'}} key={y._id}>
                <div style={{display:'flex', justifyContent:'left', alignItems:'center', width:'6vw'}}>
                <img className='finalOrdersCardImg'  src={y.productImg}  alt='product' width='100%' height='auto'/>&nbsp;&nbsp;
                  {y.productTitle}&nbsp;&nbsp;
                  {y.productQuantity}pcs&nbsp;&nbsp;
                  {y.productPrice}pln
                </div>
                <br/> 
              </div>)}
            <div>
              <h5>{x.createdAt.substr(0,10)}</h5>
              <h5>{x.email}</h5>
              <h5>{x.adress}</h5>
              <h5>{x.shipping}</h5>
            </div>
            <Button className='finalOrdersButton'  variant='contained' color='inherit' onClick={(e)=>{if(window.confirm('Delete the item?')){handelDeleteFinalOrdersCard(x._id, e)}}}><div style={{fontSize:'1vw'}}>Delete</div></Button>
            {flagDelete&&<div className='pageNotFoundView'>
              <div ><CircularProgress/><br/>loading...</div>
            </div>}
            <br/>
            <hr/>
            <br/>
          </div>)}
        </div>
      </div>
    </div>
  );
}

export default FinalOrdersCard;