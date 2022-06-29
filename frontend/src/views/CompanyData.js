import React, { useContext, useEffect, useState } from 'react'
import '../App.css'
import axios from 'axios'
import AccessTokenContext from '../contexts/AccessTokenContext'
import CompanyDataContext from '../contexts/CompanyDataContext'
import IsAdminContext from '../contexts/IsAdminContext'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';


const CompanyData = () => {

  const urlPutCompanyData = '/putCompanyData'
  const urlCompanyData = '/companyData'

  const [logo, setLogo] = useState('')
  const [streetAndNumber, setStreetAndNumber] = useState('')
  const [postCodeAndCity, setPostCodeAndCity] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [editFlag, setEditFlag] = useState(true)

  const [isAdmin, setIsAdmin] = useContext(IsAdminContext)
  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [companyData, setCompanyData] = useContext(CompanyDataContext)

// -----------------------------submitData---------------------------------------------------
  const submitData = () =>{
    const config = {
      headers:{  
      'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    }
    const data = {logo, streetAndNumber, postCodeAndCity, tel, email}
    axios.put(urlPutCompanyData, data, config)
    .then(()=>{
      setEditFlag(!editFlag)
      window.location.reload()
    })
    .catch(error=>console.log(error,'error'))
  }
// ----------------------------effectDataUpdate----------------------------------------------
  useEffect(()=>{
    companyData&&setLogo(companyData[0].logo)
    companyData&&setStreetAndNumber(companyData[0].streetAndNumber)
    companyData&&setPostCodeAndCity(companyData[0].postCodeAndCity)
    companyData&&setTel(companyData[0].tel)
    companyData&&setEmail(companyData[0].email)
  },[companyData])

  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios.get(urlCompanyData, {cancelToken: source.token})
    .then(response =>{ 
      console.log(response.data,'companyData')
      setCompanyData(response.data) 
    })
    // .catch(error => console.log(error, 'error'))
    .catch(error => {
      if (axios.isCancel(error)) {
        console.log('urlGetFinalOrdersCard cleaned up');
      } else {
        console.log(error,'error')
      }
    })
    return () => source.cancel()
  },[])
// ------------------------------------------------------------------------------------------   
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div>
      {!companyData&&<div className='pageNotFoundView'>
        <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
      </div>}
      <form onSubmit={submitData} className='companyData'>
        <div><b>{companyData&&companyData[0].logo}</b></div>
          {!editFlag&&isAdmin&&<div className='divFacebookLoginInput'>
          <input
            className='facebookLoginInput'
            name='logo'
            required
            type='text'
            placeholder='logo'
            onChange={(e)=>setLogo(e.target.value)}
            value={logo}
          />
        </div>}
        {!editFlag&&<br/>}
        {companyData&&<div>str. {companyData[0].streetAndNumber}</div>}
        {!editFlag&&isAdmin&&<div className='divFacebookLoginInput'>
          <input
            className='facebookLoginInput'
            name='street and number'
            required
            type='text'
            placeholder='street and number'
            onChange={(e)=>setStreetAndNumber(e.target.value)}
            value={streetAndNumber}
          />
        </div>}
          {!editFlag&&<br/>}
        <div>{companyData&&companyData[0].postCodeAndCity}</div>
        {!editFlag&&isAdmin&&<div className='divFacebookLoginInput'>
          <input
            className='facebookLoginInput'
            name='postcode and city'
            required
            type='text'
            placeholder='postcode and city'
            onChange={(e)=>setPostCodeAndCity(e.target.value.replace(/[^0-9-]/,''))}
            value={postCodeAndCity}
          />
        </div>}
        <br/>
        {companyData&&<div>tel: {companyData[0].tel}</div>}
        {!editFlag&&isAdmin&&<div className='divFacebookLoginInput'>
          <input
            className='facebookLoginInput'
            name='tel'
            required
            type='text'
            placeholder='tel'
            onChange={(e)=>setTel(e.target.value.replace(/[^0-9-+\s]/,''))}
            value={tel}
          />
        </div>}
        {!editFlag&&<br/>}
        {companyData&&<div>email: {companyData[0].email}</div>}
        {!editFlag&&isAdmin&&<div className='divFacebookLoginInput'>
          <input
            className='facebookLoginInput'
            name='email'
            required
            type='email'
            placeholder='email'
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
          />
        </div>}
        {!editFlag&&<br/>}
        <br/>
        {!editFlag&&isAdmin&&<Tooltip  title='Update company data' placement="bottom-start" arrow>
          <IconButton  type='submit'>
            <CachedOutlinedIcon fontSize='large'/>
          </IconButton>
        </Tooltip>}
        {editFlag&&isAdmin&&<Tooltip  title='Edit company data' placement="bottom-start" arrow>
          <IconButton  onClick={()=>setEditFlag(!editFlag)}>
            <EditOutlinedIcon fontSize='large'/>
          </IconButton>
        </Tooltip>}
        {!editFlag&&isAdmin&&<Tooltip  title='Cancel' placement="bottom-start" arrow>
          <IconButton  onClick={()=>setEditFlag(!editFlag)}>
            <CancelOutlinedIcon fontSize='large'/>
          </IconButton>
        </Tooltip>}
      </form>
    </div>
  );
}

export default CompanyData;