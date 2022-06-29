import React, { useState, useEffect, useContext } from 'react'
import { Link} from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import '../App.css'
import UserDataContext from '../contexts/UserDataContext'
import AccessTokenContext from '../contexts/AccessTokenContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined'
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined'
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';


const UserProfile = () => {
  
  const urlUpdateUser = '/updateUser'
  const urlDeleteUserByItself = '/deleteUserByItself'
  const urlUserShoppingHistory = '/userFinalOrdersCard'

  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [adress, setAdress] = useState('')
  const [tel, setTel] = useState('')
  const [displayChildren, setDisplayChildren] = useState({})
  const [serverRes, setServerRes] = useState('')
  const [shoppingHistory, setShoppingHistory] = useState('')
  const [flagHistory, setFlagHistory] = useState(true)
  const [flagHistoryProgress, setFlagHistoryProgress] = useState(false)

  const [userData, setUserData] = useContext(UserDataContext)
  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// ---------------------handleUpdate---------------------------------------------------------
  const handleUpdate = (id, e) =>{
    e.preventDefault()
    const config = {
      headers:{
          'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
  }
    const updateData = {email, userName, adress, tel}
    axios.put(urlUpdateUser+'/'+id, updateData, config)
    .then(()=>{
      window.location.reload()
    })
    .catch(error=>console.log(error,'error'))
  }
// -------------------------handleDeleteUser-------------------------------------------------
  const handleDeleteUser = (id,e) => {
    e.preventDefault()
    Cookies.remove('refreshTokenExist')
    const config = {
      headers:{  
      'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
  }
    axios.delete(urlDeleteUserByItself+'/'+id, config)
    .then(()=>{
      setAccessToken(null)
      setUserData(null)
      window.location.href='/'
    })
    .catch(error=>console.log(error,'error'))
  }
// ---------------------handleHistory-------------------------------------------------------
  const handleHistory = () =>{
    setFlagHistoryProgress(true)
    const config = {
      headers:{  
      'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    }
    const data = userData&&userData[0].email
    axios.post(urlUserShoppingHistory, {data}, config)
    .then(response=>{
      setShoppingHistory(response.data)
      setFlagHistory(!flagHistory)
    })
    .catch(error=>console.log(error,'error'))
  }
// ---------------------hideHistory---------------------------------------------------------
  const hideHistory = () =>{
    setFlagHistoryProgress(false)
    setFlagHistory(!flagHistory)
  }
// ---------------------handleUpdateEffect--------------------------------------------------
  useEffect(()=>{
    userData&&setEmail(userData[0].email)
    userData&&setUserName(userData[0].userName)
    userData&&setAdress(userData[0].adress)
    userData&&setTel(userData[0].tel)
  },[userData])
// -----------------sortIconVisibilityEffect-------------------------------------------------
  useEffect(()=>{
    setSortIconVisibility(false)
  },[])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='userProfileView'>
     {!userData&&<div className='pageNotFoundView'>
        <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
      <div>
        <div style={{marginTop:'5vh'}}/>
        <div >{userData&&userData[0].email}</div>
        <br/>
        <br/>
        <div>
          {userData&&<span>{userName===''?userData[0].userName:userName}</span>}
          {displayChildren[userData&&userData[0].userName]&&<br/>}
          {!userData[0].facebookId&&displayChildren[userData&&userData[0].userName]&&
          <div className='divFacebookLoginInput'>
            <input
              className='facebookLoginInput'
              type='text'
              placeholder='name'
              onChange={(e)=>setUserName(e.target.value.replace(/[^a-zA-Z]/,''))}
              value={userName}
            />
          </div>}
          {!userData[0].facebookId&&<Tooltip title={!displayChildren[userData&&userData[0].userName]?'Edit':'Confirm'} placement="right" arrow>
            <IconButton onClick={(e)=>setDisplayChildren({...displayChildren,[userData&&userData[0].userName]: !displayChildren[userData&&userData[0].userName]})}>
              {!displayChildren[userData&&userData[0].userName]?<EditOutlinedIcon />:<CheckCircleOutlineOutlinedIcon />}
            </IconButton>
          </Tooltip>}
        </div>
        <br/>
        <div>
        {userData&&<span>{adress===''?userData[0].adress:adress}</span>}
        {displayChildren[userData&&userData[0].adress]&&<br/>}
        {displayChildren[userData&&userData[0].adress]&&
        <div className='divFacebookLoginInput'>
          <input
            className='facebookLoginInput'
            type='text'
            placeholder='adress'
            onChange={(e)=>setAdress(e.target.value)}
            value={adress}
          />
        </div>}
        <Tooltip title={!displayChildren[userData&&userData[0].adress]?'Edit':'Confirm'} placement="right" arrow>
          <IconButton onClick={(e)=>setDisplayChildren({...displayChildren,[userData&&userData[0].adress]: !displayChildren[userData&&userData[0].adress]})}>
            {!displayChildren[userData&&userData[0].adress]?<EditOutlinedIcon />:<CheckCircleOutlineOutlinedIcon />}
          </IconButton>
        </Tooltip>
        </div>
        <br/>
        <div>
        {userData&&<span>{tel===''?userData[0].tel:tel}</span>}
          {displayChildren[userData&&userData[0].tel]&&<br/>}
          {displayChildren[userData&&userData[0].tel]&&
          <div className='divFacebookLoginInput'>
            <input
              className='facebookLoginInput'
              type='text'
              placeholder='tel'
              onChange={(e)=>setTel(e.target.value.replace(/[^0-9+-\s]/,''))}
              value={tel}
            />
          </div>}
          <Tooltip title={!displayChildren[userData&&userData[0].tel]?'Edit':'Confirm'} placement="right" arrow>
            <IconButton onClick={(e)=>setDisplayChildren({...displayChildren,[userData[0].tel]: !displayChildren[userData[0].tel]})}>
              {!displayChildren[userData&&userData[0].tel]?<EditOutlinedIcon />:<CheckCircleOutlineOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </div>
        <br/>
        <div>
          {userData&&userData[0].facebookId===''&&<Tooltip title='Edit' placement="top-start" arrow>
              <IconButton component={Link} to='/changePassword'>
                <div><span style={{fontSize:'17px', color:'black'}}>change password </span>&nbsp;<EditOutlinedIcon /></div>
              </IconButton>
            </Tooltip>}
        </div>
        <br/>
        <br/>
        {flagHistory&&<Tooltip  title='Show history' placement="top-start" arrow>
          <IconButton  onClick={handleHistory}>
            <HistoryOutlinedIcon fontSize='large' />
          </IconButton>
        </Tooltip>}
        {!flagHistory&&<Tooltip  title='Hide history' placement="top-start" arrow>
          <IconButton  onClick={hideHistory}>
            <CancelOutlinedIcon fontSize='large'/>
          </IconButton>
        </Tooltip>}
        &nbsp;&nbsp;&nbsp;
        <Tooltip  title='Update profile' placement="top-start" arrow>
          <IconButton  onClick={(e)=>handleUpdate(userData[0]._id,e)}>
            <CachedOutlinedIcon fontSize='large'/>
          </IconButton>
        </Tooltip>
        &nbsp;&nbsp;&nbsp;
        <Tooltip  title='Delete profile' placement="top-start" arrow>
          <IconButton  onClick={(e)=> {if(window.confirm('Delete the user?')){handleDeleteUser(userData[0]._id,e)}}}>
            <DeleteForeverOutlinedIcon fontSize='large' />
          </IconButton>
        </Tooltip>
        <br/>
        <div>{serverRes}</div>
        <br/><br/>
        {!flagHistory&&<h3>SHOPPING HISTORY</h3>}
        {flagHistoryProgress&&flagHistory&&userData&&<div className='pageNotFoundView'>
          <div ><CircularProgress/><br/>loading...</div>
        </div>}
        {!flagHistory&&<div className='userHistory'>
          {shoppingHistory&&shoppingHistory.map((x)=><ul style={{padding:'0', listStyleType:'none', whiteSpace:'nowrap', margin:'auto', textAlign:'center'}}  key={x._id}>
              {x.products.map((y)=><div style={{display:'flex', overflowX:'auto', alignItems:'center', padding:'5px'}} key={y._id}>
                <img src={y.productImg} className='finalOrdersCardImg' alt='finalOrdersCard' width='70' height='45' style={{objectFit:'contain'}}/>
                <div >
                  {y.productTitle}&nbsp;&nbsp;&nbsp;
                  {y.productQuantity}pcs&nbsp;&nbsp;&nbsp;
                  {y.productPrice}pln
                </div>
                <br/>
              </div>
              )}
            <b>{x.createdAt.substr(0,10)}</b>
            <hr/>
          </ul>)}
        </div>}
        <br/>
        <br/>
      </div>
    </div>
  );
}

export default UserProfile;
