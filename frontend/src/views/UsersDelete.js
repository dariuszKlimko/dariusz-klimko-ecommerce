import React,{useState, useEffect, useContext} from 'react'
import axios from 'axios'
import AccessTokenContext from '../contexts/AccessTokenContext'
import UserDataContext from '../contexts/UserDataContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined'
import CircularProgress from '@material-ui/core/CircularProgress';


const UsersDelete = () => {

  const urlUsers = '/users'
  const urlDeleteUser = '/deleteUser'

  const [users, setUsers] = useState('')
  const [flag, setFlag] = useState(false)

  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [userData, setUserData] = useContext(UserDataContext)
  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// -------------------------handleDeleteUser-------------------------------------------------
  const handleDeleteUser = (id,e) => {
    e.preventDefault()
    setFlag(true)
    const config = {
      headers:{  
      'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
  }
    axios.delete(urlDeleteUser+'/'+id, config)
    .then(()=>{
      const newUsers = users
      .filter(x=>x._id!==id)
      .map(y=>{
        return y
      })
      console.log(newUsers,'newUsers')
      setUsers(newUsers)
    })
    .catch(error=>console.log(error,'error'))
  }
// -------------------------getUsersEffect---------------------------------------------------
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if(userData){ 
      const config = {
        headers:{
            'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
        cancelToken: source.token
      }
      axios.get(urlUsers, config)
      .then(response=>{
        return setUsers(response.data)
      })
      // .catch(error=>console.log(error,'error'))
      .catch(error=>{
        if (axios.isCancel(error)) {
          console.log('urlAddToShoppingCardNotLoggedUser cleaned up');
        } else {
          console.log(error,'error')
        }
      })
    }
    return () => source.cancel() 
  },[userData])
// -----------------sortIconVisibilityEffect-------------------------------------------------
  useEffect(()=>{
    setSortIconVisibility(false)
  },[])
// -----------------setFlagFalse------------------------------------------------------------
useEffect(()=>{
  if(users){
    setFlag(false)
  }
},[users])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='usersDeleteView'>
      {!users&&<div className='pageNotFoundView'>
            <div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>
        </div>}
      <div style={{marginTop:'5vh'}}/>
     {users&&users.map(x=><div key={x._id}>
      {x.email}
      <Tooltip  title='Delete user' placement="top-start" arrow>
        <IconButton   onClick={(e)=>{if(window.confirm('Delete the item?')){handleDeleteUser(x._id,e)}}}>
          <DeleteForeverOutlinedIcon />
        </IconButton>
      </Tooltip>
      <br/><br/>
     </div>)}
     {flag&&<div className='pageNotFoundView'>
            <div><CircularProgress/><br/>loading...</div>
        </div>}
    </div>
  );
}

export default UsersDelete;