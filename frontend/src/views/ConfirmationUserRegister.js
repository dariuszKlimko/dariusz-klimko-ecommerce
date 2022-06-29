import React, {useContext, useEffect, useRef } from 'react'
import { useParams} from 'react-router-dom'
import '../App.css'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined'
import CircularProgress from '@material-ui/core/CircularProgress';


const ConfirmationUserRegister = () => {

  const {data} = useParams();

  const timerRef = useRef(null);

  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// ------------------------------------------------------------------------------------------
  useEffect(()=>{
    setSortIconVisibility(false)
    const timer = setTimeout(() => {
      window.location.href='/'
    }, 3000)
    return () => clearTimeout(timer)
  },[])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div style={{margin:'auto', textAlign:'center', fontSize:'1vw'}}>
      {!data&&<div className='pageNotFoundView'>
        <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
      {(data&&data==='ok')&&<div style={{marginTop:'30vh'}}>
        <h1>Your account has been successfully verified.</h1>
        <div >
          <ThumbUpAltOutlinedIcon fontSize='large'/>
        </div>
      </div>}
      {(data&&data==='userVerified')&&<div>
        <h1>User has been already verified.</h1>
        <div >
          <ThumbUpAltOutlinedIcon fontSize='large'/>
        </div>
      </div>}
      {(data&&data==='noUserInDataBase')&&<div>
        <h1>User not exixt in database.</h1>
        <div >
          <ThumbDownAltOutlinedIcon fontSize='large'/>
        </div>
      </div>}
      {(data&&data==='linkExpired')&&<div>
        <h1>Your verification link may have expired. Please verify your account again.</h1>
        <div >
          <ThumbDownAltOutlinedIcon fontSize='large'/>
        </div>
      </div>}
    </div>
  );
}

export default ConfirmationUserRegister;