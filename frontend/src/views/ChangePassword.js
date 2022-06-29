import React, { useEffect, useState, useContext } from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import ServerResContext from '../contexts/ServerResContext'
import UserDataContext from '../contexts/UserDataContext'
import AccessTokenContext from '../contexts/AccessTokenContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';


const ChangePassword = () => {

    const urlCompareActualtPassword = '/compareActualtPassword'
    const urlChangePassword = '/changePassword'

    const history = useHistory();

    const [password, setPassword]  =useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [flagConfirmPassword, setFlagConfirmPassword] = useState(false)
    const [showPassword, setShowPasword] = useState(false)
    const [showFlag, setShowFlag] = useState(true)
    const [actualPassword, setActualPassword] = useState('')
    const [showActualPassword, setShowActualPasword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [flag, setFlag] = useState(false)

    const [serverRes, setServerRes] = useContext(ServerResContext)
    const [userData, setUserData] = useContext(UserDataContext)
    const [accessToken, setAccessToken] = useContext(AccessTokenContext)
    const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// --------------------handleCompareActualPassword-----------------------------------------
    const handleCompareActualPassword = (e) =>{
        e.preventDefault()
        setFlag(true)
        setServerRes('')
        const config = {
            headers:{
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        }
        const actualEmail = userData[0].email
        const verifyData = {actualEmail, actualPassword}
        axios.post(urlCompareActualtPassword, verifyData, config)
        .then(response =>{
            return response.data===true?setShowFlag(false)&setServerRes('')&setFlag(false):setServerRes('Incorrect Password!!!')
        })
        .catch(error => console.log(error, 'error'))
    }
// --------------------handleResetPassword--------------------------------------------------
    const handleResetPassword = (e) =>{
        e.preventDefault()
        setFlag(true)
        const config = {
            headers:{
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        }
        const id = userData[0]._id
        axios.put(urlChangePassword+'/'+id, {password}, config)
        .then(response =>{
            return setPassword('')&setConfirmPassword('')&history.go(-1)
        })
        .catch(error => console.log(error, 'error'))
    }
// --------------------effectForPasswordCompara------------------------------------------------
    useEffect(()=>{
        return (password&&password===confirmPassword&&confirmPassword)?setFlagConfirmPassword(true):setFlagConfirmPassword(false)
    },[password,confirmPassword])
// --------------------sortIconVisibilityEffect----------------------------------------------
    useEffect(()=>{
        setSortIconVisibility(false)
    },[])

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='changePasswordView'  >
        <form onSubmit={showFlag?(e)=>handleCompareActualPassword(e):(e)=>handleResetPassword(e)}>
        <br/><br/><br/><br/><br/>
            {showFlag&&<div>
                <div className='divFacebookLoginInput'>
                    <input
                        className='facebookLoginInputPassword'
                        name='actualPassword'
                        required
                        type={showActualPassword?'text':'password'}
                        placeholder='actual password'
                        onChange={(e)=>setActualPassword(e.target.value)}
                        value={actualPassword}
                    />
                    <Tooltip  title='Show password' placement="top-start" arrow>
                        <IconButton  onClick={()=>setShowActualPasword(!showActualPassword)}>
                            {showActualPassword&&<VisibilityIcon  fontSize='small'/>}
                            {!showActualPassword&&<VisibilityOffIcon  fontSize='small'/>}
                        </IconButton>
                    </Tooltip>
                </div>
            </div>}
            {!showFlag&&<div>
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
                            {showPassword&&<VisibilityIcon fontSize='small'/>}
                            {!showPassword&&<VisibilityOffIcon  fontSize='small'/>}
                        </IconButton>
                    </Tooltip>
                </div>
                <br/>
                <div className='divFacebookLoginInput'>
                    <input
                        className='facebookLoginInputPassword'
                        name='password confirm'
                        required
                        type={showConfirmPassword?'text':'password'}
                        placeholder='actual password'
                        onChange={(e)=>{setConfirmPassword(e.target.value)}}
                        value={confirmPassword}
                    />
                    <Tooltip  title='Show password' placement="top-start" arrow>
                        <IconButton  onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword&&<VisibilityIcon  fontSize='small'/>}
                            {!showConfirmPassword&&<VisibilityOffIcon  fontSize='small'/>}
                        </IconButton>
                    </Tooltip>
                </div>
            </div>} 
            <br/>
           {showFlag?<Button className='loginButton' variant='contained' color='inherit' type='submit' >Check password</Button>:<Button className='loginButton' variant='contained' color='inherit' type='submit' disabled={!flagConfirmPassword}>Reset Password</Button>}
        </form>
        <br/>
        {serverRes}
        {flag&&!serverRes&&<div className='pageNotFoundView'>
        <div style={{marginTop:'1vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
    </div>
  );
}

export default ChangePassword;