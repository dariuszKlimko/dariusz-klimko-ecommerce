import React, { useContext, useEffect } from 'react'
import '../App.css'
import { Link} from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import AccessTokenContext from '../contexts/AccessTokenContext'
import IsAdminContext from '../contexts/IsAdminContext'
import ProductToDisplayContext from '../contexts/ProductToDisplayContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined'
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined'
import CircularProgress from '@material-ui/core/CircularProgress';


const Home = () => {

    const urlDeleteProduct = '/deleteProduct'

    const [accessToken, setAccessToken] = useContext(AccessTokenContext)
    const [isAdmin, setIsAdmin] = useContext(IsAdminContext)
    const [productToDisplay, setProductTodisplay] = useContext(ProductToDisplayContext)
    const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// ---------------------------handleDeleteProduct---------------------------------------------
  const handleDeleteProduct = (id, e) =>{
    e.preventDefault()
    const config = {
      headers:{
          'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    }
    axios.delete(urlDeleteProduct+'/'+id, config)
    .then(() =>{
      window.location.reload()
    })
    .catch(error => console.log(error, 'error'))
  }
// --------------------------sortIconVisibilityEffect----------------------------------------
  useEffect(()=>{
    setSortIconVisibility(true)
  },[])
// ------------------------------------------------------------------------------------------   
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div>
      {!productToDisplay&&<div className='pageNotFoundView'>
        <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
      <div className='homeView'>
        {productToDisplay&&productToDisplay.map(x=><div key={x._id} className='icons' >
          <div style={{paddingBottom:'5px'}}><b style={{fontSize:'20px'}}>{x.title}</b></div>
          <Link to={`/productCard/${x._id}`}>
            <div className='iconsImg'>
              <img src={x.imgCollection[0]} alt='ProductIcon' width='100%' height='100%'  style={{objectFit:'contain'}}  />
            </div> 
          </Link>
          <div style={{paddingBottom:'5px'}}>
          <span >Price: &nbsp;<b style={{fontSize:'20px'}}>{x.price}</b> pln</span>
          {isAdmin&&<Tooltip  title='Delete product' placement="top-start" arrow>
            <IconButton 
              onClick={(e)=>{
                if(window.confirm('Delete the item?')){
                  handleDeleteProduct(x._id, e)
                }       
              }}
            >
              <DeleteForeverOutlinedIcon  />
            </IconButton>
          </Tooltip>}
          {isAdmin&&<Tooltip  title='Update product' placement="top-start" arrow>
            <IconButton  component={Link} to={`/addProductCard/${x._id}`} >
              <CachedOutlinedIcon  />
            </IconButton>
          </Tooltip>}
          </div>
        </div>)}
      </div>
    </div>
  );
}

export default Home;