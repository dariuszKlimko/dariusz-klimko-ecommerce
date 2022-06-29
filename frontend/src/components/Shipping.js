import React, { useState, useContext, useRef, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import AccessTokenContext from '../contexts/AccessTokenContext'

import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';


const Shipping = (props) => {

  const urlAddShipping = '/addShipping'

  const timerRef = useRef(null)

  const [shippingMethod, setShippingMethod] = useState('')
  const [shippingPrice, setShippingPrice] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  
  const [accessToken, setAccessToken] = useContext(AccessTokenContext)

// ------------------------------------------------------------------------------------------
  useEffect(()=>{
    return () => clearTimeout(timerRef.current)
  },[])
// ---------------------handleAddShipping----------------------------------------------------
  const handleAddShipping = (e) =>{
    e.preventDefault()
    const config = {
      headers:{  
      'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
  }
    const data = {shippingMethod, shippingPrice}
    axios.post(urlAddShipping, data, config)
    .then(response=>{
      response.data==='addShippingOk' ? setConfirmMessage('Done!!!') : setConfirmMessage('Shipping method already exist!!!')
      timerRef.current = setTimeout(() => {
        setConfirmMessage('')
        setShippingMethod('')
        setShippingPrice('')
        window.location.reload()
      }, 1500)
        setShippingMethod('')
        setShippingPrice('')
    })
    .catch(error=>console.log(error,'error'))
  }
// ---------------------handleCloseShipping--------------------------------------------------
  const handleCloseShipping = () =>{
    props.handleCloseShipping()
  }
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='shipping'>
      <form onSubmit={(e)=>handleAddShipping(e)}>
        <input
          className='inputCategory'
          type='text'
          placeholder='shipping method'
          value={shippingMethod}
          onChange={(e)=>setShippingMethod(e.target.value.replace(/[^a-zA-Z]/,''))}
          required
        />
        <br/>
        <input
          className='inputCategory'
          type='number'
          min='0'
          placeholder='shipping price in PLN'
          value={parseInt(shippingPrice)}
          onChange={(e)=>setShippingPrice(e.target.value.replace(/[^0-9]/,''))}
          required
        />
        <br/>
        <Tooltip title='Add shipping' placement="top-start" arrow>
          <IconButton type='submit'>
              <AddCircleOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Close' placement="top-start" arrow>
          <IconButton onClick={()=>handleCloseShipping()}>
              <CancelOutlinedIcon />
          </IconButton>
        </Tooltip>
        <div className='serverRes'>{confirmMessage}</div>
      </form>
    </div>
  );
}

export default Shipping;