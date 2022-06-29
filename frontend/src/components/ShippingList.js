import React, { useState, useContext, useRef, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import Shipping from '../components/Shipping'
import ShippingListUpdate from '../components/ShippingListUpdate'
import AccessTokenContext from '../contexts/AccessTokenContext'
import ShippingListContext from '../contexts/ShippingListContext'

import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListItem from '@material-ui/core/ListItem';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';


const ShippingList = () => {

  const urlDeleteShipping= '/deleteShipping/'

  const timerRef = useRef(null)

  const [confirmMessage, setConfirmMessage] = useState('')
  const [displayChildren, setDisplayChildren] = useState({})
  const [showAddShippingFlag, setShowAddShippingFlag] = useState(false)

  const [shippingList, setShippingList] = useContext(ShippingListContext)
  const [accessToken, setAccessToken] = useContext(AccessTokenContext)

// ------------------------------------------------------------------------------------------
  useEffect(()=>{
    return () => clearTimeout(timerRef.current)
  },[])
// ---------------------handleDeleteShipping-------------------------------------------------
  const handleDeleteShipping = (param, e) =>{
    e.preventDefault()
      const config = {
        headers:{  
        'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true
    }
    const id = param
    axios.delete(urlDeleteShipping+id, config)
    .then(()=>{
      setConfirmMessage('Done!!!')
      timerRef.current = setTimeout(() => {
        window.location.reload()
      }, 1500)
    })
    .catch(error=>{console.log(error,'error')})
  }
// ---------------------handleClose----------------------------------------------------------
  const handleClose = (param,e) =>{
    e.preventDefault()
    setDisplayChildren({...displayChildren, [param]: !displayChildren[param]})
  }
// ---------------------handleCloseShipping--------------------------------------------------
  const handleCloseShipping = () =>{
    setShowAddShippingFlag(!showAddShippingFlag)
  }
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div >
      {!showAddShippingFlag&&<ListItem>
        <Tooltip title='Add shipping' placement="top-start" arrow>
          <IconButton onClick={()=>setShowAddShippingFlag(!showAddShippingFlag)}>
              <AddCircleOutlineOutlinedIcon />&nbsp;<span style={{fontSize:'15px', color:'black'}}>ADD METHOD</span>
          </IconButton>
        </Tooltip>
      </ListItem>}
      {showAddShippingFlag&&<Shipping handleCloseShipping={handleCloseShipping} />}
      <form>
      {shippingList&&shippingList.map(x=>
        <ListItem key={x._id}>
          {!displayChildren[x.shippingMethod]&&<Tooltip title='Update' placement="top-start" arrow>
          <IconButton onClick={(e)=>{
          e.preventDefault()
          setDisplayChildren({...displayChildren, [x.shippingMethod]: !displayChildren[x.shippingMethod]})

          }}>
              <CachedOutlinedIcon /> 
          </IconButton>
          </Tooltip>}
          {!displayChildren[x.shippingMethod]&&<div>{x.shippingMethod}&nbsp;&nbsp;{x.shippingPrice}&nbsp;pln</div>}
          {!displayChildren[x.shippingMethod]&&<Tooltip title='Delete item' placement="top-start" arrow>
            <IconButton onClick={(e)=>{if(window.confirm('Delete the item?')){handleDeleteShipping(x._id,e)}}}>
                <DeleteForeverOutlinedIcon />
            </IconButton>
          </Tooltip>}
          {displayChildren[x.shippingMethod]&&<ShippingListUpdate 
            shippingMethod={x.shippingMethod} 
            shippingPrice={x.shippingPrice}
            _id={x._id}
            handleClose={handleClose}
          />}
        </ListItem>)}
      </form>
    </div>
  );
}
export default ShippingList;
