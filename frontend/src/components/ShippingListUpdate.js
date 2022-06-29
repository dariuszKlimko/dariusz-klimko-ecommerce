import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import '../App.css'
import AccessTokenContext from '../contexts/AccessTokenContext'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';


const ShippingListUpdate = (props) => {

  const urlUpdateShipping = '/updateShipping/'

  const timerRef = useRef(null)

  const [shippingMethod, setShippingMethod] = useState('')
  const [shippingPrice, setShippingPrice] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  
  const [accessToken, setAccessToken] = useContext(AccessTokenContext)

// ------------------------------------------------------------------------------------------
  useEffect(()=>{
    return () => clearTimeout(timerRef.current)
  },[])
// ---------------------effectForUpdate------------------------------------------------------
  useEffect(()=>{
    setShippingMethod(props.shippingMethod)
    setShippingPrice(props.shippingPrice)
  },[])
// ---------------------handleUpdateShipping-------------------------------------------------
  const handleUpdateShipping = (e) =>{
    e.preventDefault()
      const config = {
      headers:{  
      'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    }
    const id = props._id
    const data = {shippingMethod, shippingPrice}
    axios.put(urlUpdateShipping+id, {data}, config)
    .then(()=>{
      setConfirmMessage('Done!!!')
      timerRef.current = setTimeout(() => {
        window.location.reload()
      }, 1500)
    })
    .catch(error=>console.log(error,'error'))
  }
// ---------------------handleClose----------------------------------------------------------
  const handleClose = (param,e) =>{
    e.preventDefault()
    props.handleClose(param,e)
  }
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='shipping' style={{margin:'auto', textAlign:'center'}}>
        <input
          className='inputCategory'
          type='text'
          value={shippingMethod}
          onChange={(e)=>setShippingMethod(e.target.value.replace(/[^a-zA-Z]/,''))}
        />
        <br/>
        <input
          className='inputCategory'
          type='number'
          min='0'
          value={parseInt(shippingPrice)}
          onChange={(e)=>setShippingPrice(e.target.value.replace(/[^0-9]/,''))}
        />
        <br/>
        <Tooltip title='Update' placement="top-start" arrow>
          <IconButton onClick={(e)=>handleUpdateShipping(e)}>
              <CachedOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Update' placement="top-start" arrow>
          <IconButton onClick={(e)=>handleClose(props.shippingMethod, e)}>
              <CancelOutlinedIcon />
          </IconButton>
        </Tooltip>
        <div className='serverRes'>{confirmMessage}</div>
    </div>
  );
}

export default ShippingListUpdate;