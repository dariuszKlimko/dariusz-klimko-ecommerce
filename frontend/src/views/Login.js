import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import AccessTokenContext from '../contexts/AccessTokenContext'
import UserDataContext from '../contexts/UserDataContext'
import IsAdminContext from '../contexts/IsAdminContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import { FacebookLoginButton } from "react-social-login-buttons"

import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress';


const Login = () => {

  const urlLogin = '/login'
  const urlVerifyAgain = '/verifyAgain'
  const urlResetPasswordLink = '/resetPasswordLink'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPasword] = useState(false)
  const [serverResLogin, setServerResLogin] = useState('')
  const [flag, setFlag] = useState(false)

  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [userData, setUserData] = useContext(UserDataContext)
  const [isAdmin, setIsAdmin] = useContext(IsAdminContext)
  const [sortIconVisibility, setSortIconVisibility]= useContext(SortIconVisibilityContext)
  
  const lsShoppingCard = JSON.parse(localStorage.getItem('lsShoppingCard'))
  
// ----------------------lsShoppingCardTrue-----------------------------------------------
  const addOrDeleteNotLoggedUserShoppingCardToLoogedUser = () =>{
    const condition = window.confirm('Do you want to add items to your shoppingCart?')
    if(condition){
      localStorage.removeItem('email')
      localStorage.removeItem('lsOrdersCard_id')
    }
    else{
      localStorage.removeItem('lsShoppingCard')
      localStorage.removeItem('email')
      localStorage.removeItem('lsOrdersCard_id')
    }
  }
  // ----------------------lsShoppingCardFalse-----------------------------------------------
  const cleanLocalStore = () =>{
    localStorage.removeItem('lsShoppingCard')
    localStorage.removeItem('email')
    localStorage.removeItem('lsOrdersCard_id')
  
  }
// ----------------------handleLogin-----------------------------------------------------
  const handleLogin = (e) =>{
    e.preventDefault()
    setFlag(true)
    setServerResLogin('')
    lsShoppingCard&&addOrDeleteNotLoggedUserShoppingCardToLoogedUser()
    !lsShoppingCard&&cleanLocalStore()
    const loginData = {email, password};
    axios.post(urlLogin, loginData , {withCredentials: true})
    .then(response =>{ 
        if(response.data[0].accessToken){
          setIsAdmin(response.data[0].isAdmin)
          setAccessToken(response.data[0].accessToken)
          const newUserData = response.data
          newUserData
          .forEach(x=>{
            delete x.accessToken
          })
          setUserData(newUserData)
          setServerResLogin(null)
        }
          return ((response.data==='Incorrect password')||(response.data==='Incorrect username')||(response.data==='User is not verified')) ?  setServerResLogin(response.data) : window.location.href='/';
    })
    .catch(error => console.log(error, 'error'))
  }
// ----------------------handleResendVerificationLink--------------------------------------
  const handleResendVerificationLink = (e) =>{
    e.preventDefault()
    setServerResLogin('')
    axios.post(urlVerifyAgain, {email})
    .then(() =>{ 
      setFlag(!flag)
      return alert('Check Your email for account verification')&setEmail('')&setPassword('')&setServerResLogin('')
      })
    .catch(error => console.log(error, 'error'))
  }
// ----------------------handleResetPassword------------------------------------------------
  const handleResetPassword = (e) =>{
    e.preventDefault()
    setServerResLogin('')
    axios.post(urlResetPasswordLink, {email})
      .then(() =>{ 
        setFlag(!flag)
        return alert('Check Your email for password reset')&setEmail('')&setPassword('')&setServerResLogin('')
        })
      .catch(error => console.log(error, 'error'))
  }
// ---------------------handleFacebookLogin--------------------------------------------------
  const handleFacebookLogin = () =>{
    setFlag(!flag)
    lsShoppingCard&&addOrDeleteNotLoggedUserShoppingCardToLoogedUser()
    !lsShoppingCard&&cleanLocalStore()
    window.location.href="/auth/facebook"
  }
// -----------------sortIconVisibilityEffect-------------------------------------------------
  useEffect(()=>{
    setSortIconVisibility(false)
  },[])
// -----------------loadingBarEffect---------------------------------------------------------
  useEffect(()=>{
    if(accessToken){
      setFlag(!flag)
    }
  },[accessToken])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='loginView'>
    {!userData&&<div onClick={()=>handleFacebookLogin()} className='facebookButton' style={{marginTop:'10vh'}} ><FacebookLoginButton style={{height: '40px'}}><div className='facebookButtonLink'>Login with Facebook</div></FacebookLoginButton></div>}
    <br/>
      {!userData&&<form onSubmit={(e)=>handleLogin(e)}>
      <div className='divFacebookLoginInput'>
       <input
            className='facebookLoginInput'
            name='email'
            required
            type='email'
            placeholder='email'
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
        />
      </div>
        <br/>
        <div className='divFacebookLoginInput'>
        <input
            className='facebookLoginInputPassword'
            name='password'
            required
            type={showPassword?'text':'password'}
            placeholder='password'
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
        />
        <Tooltip  title='Show password' placement="top-start" arrow>
          <IconButton  onClick={()=>setShowPasword(!showPassword)}>
            {showPassword&&<VisibilityIcon  fontSize='small' />}
            {!showPassword&&<VisibilityOffIcon  fontSize='small' />}
          </IconButton>
        </Tooltip>
        </div>
        <br/>
        <Button className='loginButton' variant='contained' color='inherit' type='submit'><div style={{ color:'black'}}>Login</div></Button>

        <br/><br/>
        {serverResLogin==='User is not verified'?<Button className='loginButton' variant='contained' color='inherit'  onClick={(e)=>handleResendVerificationLink(e)}>Verify profile</Button>:serverResLogin==='Incorrect password'?<Button className='loginButton' variant='contained' color='inherit' onClick={(e)=>handleResetPassword(e)}>Reset password</Button>:null}
        {serverResLogin&&<br/>}
        {serverResLogin&&<br/>}
        {serverResLogin}
      </form>}
      {!accessToken&&flag&&!serverResLogin&&<div className='pageNotFoundView'>
        <div style={{marginTop:'1vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
    </div>
  );
}

export default Login;