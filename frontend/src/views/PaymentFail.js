import React, {useContext, useEffect, useState} from 'react'
import '../App.css'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'


import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';



const PaymentFail = () => {

  const [fail, setFail] = useState('')

  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// ---------------------paymentSuccessUpdate------------------------------------------------
  useEffect(()=>{
      setSortIconVisibility(false)
      setFail('Paymant fail')
      const timer= setTimeout(() => {
        setFail('')
        window.location.href='/'
      }, 3000)
      return () => clearTimeout(timer)
  },[])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div style={{ margin:'auto', textAlign:'center'}}>
      {!fail&&<div className='pageNotFoundView'>
        <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
      {fail&&<div style={{marginTop:'15vh'}}>
        <h1 className='serverRes'>{fail}</h1>
        <div >
            <ThumbDownAltOutlinedIcon fontSize='large'/>
        </div>
      </div>}
    </div>
  );
}

export default PaymentFail;