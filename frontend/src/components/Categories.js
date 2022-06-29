import React,{useState, useEffect, useContext} from 'react'
import axios from 'axios'
import List from './CategoriesList'
import CategoryDbContext from '../contexts/CategoryDbContext'
import CategoryNameContext from '../contexts/CategoryNameContext'
import ParentIdContext from '../contexts/ParentIdContext'
import ServerResContext from '../contexts/ServerResContext'
import UserDataContext from '../contexts/UserDataContext'
import AccessTokenContext from '../contexts/AccessTokenContext'
import IsAdminContext from '../contexts/IsAdminContext'


const Categories = () => {

  const urlCategories = '/categories'

  const [categoryName, setCategoryName] = useState('')
  const [parentId, setParentId] = useState(0)

  const [serverRes, setServerRes] = useContext(ServerResContext)
  const [categoryDb, setCategoryDb] = useContext(CategoryDbContext)
  const [userData, setUserData] = useContext(UserDataContext)
  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [isAdmin, setIsAdmin] = useContext(IsAdminContext)
  
// -----------------------------effectForAdmi/User-------------------------------------------
  useEffect(()=>{
    userData&&setIsAdmin(userData[0].isAdmin)
  },[userData])
// -------------------postCategoriesByEffect-------------------------------------------------
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if(categoryName!==''){
      const config = {
        headers:{
            'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
        cancelToken: source.token
      }
      const sendData = {categoryName, parentId}
      axios.post(urlCategories, sendData, config)
      .then(response =>{
        return response.data==='Category name already exist!!!'?setServerRes(response.data):window.location.reload()
      })
      // .catch(error => console.log(error, 'error'))
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('urlCategories cleaned up');
        } else {
          console.log(error,'error')
        }
      })
      return () => source.cancel()}
  },[categoryName]) 
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div>
      <CategoryNameContext.Provider value={[categoryName, setCategoryName]}>
      <ParentIdContext.Provider value={[parentId, setParentId]}>
        <List
          categoryDb={categoryDb}
        />
      </ParentIdContext.Provider>
      </CategoryNameContext.Provider>
    </div>
    
  );
}

export default Categories;