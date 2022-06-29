import React, { useEffect, useState, useContext, useRef } from 'react'
import {useParams} from 'react-router-dom'
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


const ResetPassword = () => {

    const urlResetPassword = '/resetPassword'

    const timerRef = useRef(null);

    const {id} = useParams();

    const [password, setPassword]  =useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [flagConfirmPassword, setFlagConfirmPassword] = useState(false)
    const [showPassword, setShowPasword] = useState(false)
    const [showPasswordConfirm, setShowPaswordConfirm] = useState(false)
    const [flag, setFlag] = useState(false)

    const [serverRes, setServerRes] = useContext(ServerResContext)
    const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// -----------------------------------------------------------------------------
    useEffect(()=>{
        return () => clearTimeout(timerRef.current)
    },[])
// --------------------handleResetPassword----------------------------------------------------
    const handleResetPassword = (e) =>{
        e.preventDefault()
        setFlag(true)
        axios.put(urlResetPassword+'/'+id, {password})
        .then(response =>{
            setServerRes(response.data)
            setPassword('')
            setConfirmPassword('')
            timerRef.current = setTimeout(() => {
                setServerRes('')
                window.location.href='/'
            }, 1500)
        })
        .catch(error => console.log(error, 'error'))
    }
// --------------------effectForPasswordCompara------------------------------------------------
    useEffect(()=>{
        return (password&&password===confirmPassword&&confirmPassword)?setFlagConfirmPassword(true):setFlagConfirmPassword(false)
    },[password,confirmPassword])
// -----------------sortIconVisibilityEffect-------------------------------------------------
    useEffect(()=>{
        setSortIconVisibility(false)
    },[])
// -----------------setFlagFalse-------------------------------------------------------------
    useEffect(()=>{
        if(serverRes){
            setFlag(false)
        }
    },[serverRes])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
    return (
        <div className='resetPasswordView' >
            <form onSubmit={(e)=>handleResetPassword(e)} style={{marginTop:'10vh'}}>
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
                            {showPassword&&<VisibilityIcon  fontSize='small'/>}
                            {!showPassword&&<VisibilityOffIcon  fontSize='small'/>}
                        </IconButton>
                    </Tooltip>
                </div>
                <br/>
                <div className='divFacebookLoginInput'>
                <input
                        className='facebookLoginInputPassword'
                        name='confirm password'
                        required
                        type={showPasswordConfirm?'text':'password'}
                        placeholder='confirm password'
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                    <Tooltip  title='Show password' placement="top-start" arrow>
                        <IconButton  onClick={()=>setShowPaswordConfirm(!showPasswordConfirm)}>
                            {showPasswordConfirm&&<VisibilityIcon  fontSize='small'/>}
                            {!showPasswordConfirm&&<VisibilityOffIcon  fontSize='small'/>}
                        </IconButton>
                    </Tooltip>
                </div>
                <br/>
            <Button className='loginButton' variant='contained' color='inherit' type='submit' disabled={!flagConfirmPassword} >Reset Password</Button>
            </form>
            <br/>
            {!serverRes&&flag&&<div className='pageNotFoundView'>
                <div ><CircularProgress/><br/>loading...</div>
            </div>}
            {serverRes}
        </div>
    );
}

export default ResetPassword;