import React, { useEffect, useState, useContext } from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import ServerResContext from '../contexts/ServerResContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress';


const UserRegister = () => {

    const urlUserRegister = '/userRegister'

    const history = useHistory();

    const [email, setEmail] = useState('')
    const [password, setPassword]  =useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [flagConfirmPassword, setFlagConfirmPassword] = useState(false)
    const [showPassword, setShowPasword] = useState(false)
    const [showPasswordConfirm, setShowPaswordConfirm] = useState(false)
    const [flag, setFlag] = useState(false)
    const [load, setLoad] = useState(true)
    
    

    const [serverRes, setServerRes] = useContext(ServerResContext)
    const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// --------------------handleRegister--------------------------------------------------------
    const handleRegister = (e) =>{
        e.preventDefault()
        setFlag(true)
        const userData = {email, password}
        axios.post(urlUserRegister, userData)
        .then(response =>{
        return response.data==='Email already exist'?setServerRes(response.data):alert('Check Your email for account verification')&setEmail('')&setPassword('')&setConfirmPassword('')&history.go(-1)
        })
        .catch(error => console.log(error, 'error'))
    }
// --------------------handleRegister--------------------------------------------------------
    useEffect(()=>{
        return (password&&password===confirmPassword&&confirmPassword)?setFlagConfirmPassword(true):setFlagConfirmPassword(false)
    },[password,confirmPassword])
// -----------------sortIconVisibilityEffect-------------------------------------------------
    useEffect(()=>{
        setServerRes('')
        setSortIconVisibility(false)
        setLoad(false)
    },[])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='userRegisterView' >
        <form onSubmit={(e)=>handleRegister(e)} style={{marginTop:'10vh'}}>
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
                    {showPassword&&<VisibilityIcon fontSize='small' />}
                    {!showPassword&&<VisibilityOffIcon  fontSize='small'/>}
                </IconButton>
            </Tooltip>
            </div>
            <br/>
            <div className='divFacebookLoginInput'>
            <input
                className='facebookLoginInputPassword'
                name='confirmPassword'
                required
                type={showPasswordConfirm?'text':'password'}
                placeholder='confirm password'
                onChange={(e)=>{setConfirmPassword(e.target.value)}}
                value={confirmPassword}
            />
            <Tooltip  title='Show password' placement="top-start" arrow>
                <IconButton  onClick={()=>setShowPaswordConfirm(!showPasswordConfirm)}>
                    {showPasswordConfirm&&<VisibilityIcon fontSize='small'  />}
                    {!showPasswordConfirm&&<VisibilityOffIcon fontSize='small'  />}
                </IconButton>
            </Tooltip>
            </div>
            <br/>
            <Button  className='loginButton' variant='contained' color='inherit'  type='submit' disabled={!flagConfirmPassword} ><div style={{ color:'black'}}>Register</div></Button>
        </form>
        <br/>
        {flag&&!serverRes&&<div className='pageNotFoundView'>
            <div style={{marginTop:'1vh'}}><CircularProgress/><br/>loading...</div>
        </div>}
        {serverRes}
    </div>
  );
}

export default UserRegister;