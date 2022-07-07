import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import './App.css'
import Cookies from 'js-cookie'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './views/Home'
import Login from './views/Login'
import UserProfile from './views/UserProfile'
import AddProductCard from './views/AddProductCard'
import ProductCard from './views/ProductCard'
import UserRegister from './views/UserRegister'
import ChangePassword from './views/ChangePassword'
import ResetPassword from './views/ResetPassword'
import PageNotFound from './views/PageNotFound'
import ShoppingCard from './views/ShoppingCard'
import PaymentFail from './views/PaymentFail'
import UsersDelete from './views/UsersDelete'
import ConfirmationUserRegister from './views/ConfirmationUserRegister'
import FinalOrdersCard from './views/FinalOrdersCard'
import CompanyData from './views/CompanyData'
import CategoryDbContext from './contexts/CategoryDbContext'
import ProductByCategoryPathContext from './contexts/ProductByCategoryPathContext'
import ServerResContext from './contexts/ServerResContext'
import AccessTokenContext from './contexts/AccessTokenContext'
import UserDataContext from './contexts/UserDataContext'
import AllProductsByCategoryPathContext from './contexts/AllProductsByCategoryPathContext'
import IsAdminContext from './contexts/IsAdminContext'
import ShoppingCardContext from './contexts/ShoppingCardContext'
import ShippingListContext from './contexts/ShippingListContext'
import TotalPriceContext from './contexts/TotalPriceContext'
import SearchProductContext from './contexts/SearchProductContext'
import ProductToDisplayContext from './contexts/ProductToDisplayContext'
import ScidContext from './contexts/ScidContext'
import PridContext from './contexts/PridContext'
import SortIconVisibilityContext from './contexts/SortIconVisibilityContext'
import CompanyDataContext from './contexts/CompanyDataContext'
import CopyOfFilteredProductContext from './contexts/CopyOfFilteredProductContext'

import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import AddToPhotosOutlinedIcon from '@material-ui/icons/AddToPhotosOutlined';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DirectionsBikeOutlinedIcon from '@material-ui/icons/DirectionsBikeOutlined';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import FormatLineSpacingOutlinedIcon from '@material-ui/icons/FormatLineSpacingOutlined';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

const  App = () => {

  const [openSort, setOpenSort] = useState(false);

  const anchorRefSort = useRef(null);

  const isSmallScreen = useMediaQuery({ query: '(min-width: 360px)' })
 
  const url = '/allCategories'
  const urlProducts = '/products'
  const urlRefreshAccessToken = '/refreshAccessToken'
  const urlRefreshAccessTokenWithUserData = '/refreshAccessTokenWithUserData'
  const urlGetShoppingCard = '/getShoppingCard'
  const urlGetShipping = '/getShipping'
  const urlLogout = '/logout'
  const urlCompanyData = '/companyData'
  const urlAddToShoppingCardNotLoggedUser = '/addToShoppingCardNotLoggedUser'


  const [categoryDb, setCategoryDb] = useState('')
  const [productByCategoryPath, setProductByCategoryPath] = useState('')
  const [serverRes, setServerRes] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [userData, setUserData] = useState('')
  const [refreshTokenExist, setRefreshTokenExist] = useState('')
  const [allProductsByCategoryPath, setAllProductsByCategoryPath] = useState('')
  const [isAdmin, setIsAdmin] = useState('')
  const [shoppingCard, setShoppingCard] = useState('')
  const [shippingList, setShippingList] = useState('')
  const [totalPrice, setTotalPrice] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [productToDisplay, setProductToDisplay] = useState('')
  const [scrollTop, setScrollTop] = useState(false)
  const [scid, setScid] = useState('')
  const [prid, setPrid] = useState('')
  const [forceRender, setForceRender] = useState(0)
  const [sortIconVisibility, setSortIconVisibility] = useState(true)
  const [companyData, setCompanyData] = useState('')
  const [copyOfFilteredProduct, setCopyOfFilteredProduct] = useState('')
  const checkSort = JSON.parse(sessionStorage.getItem('lsCheckSort'))
  const minPrice = JSON.parse(sessionStorage.getItem('ssMinPrice'))
  const maxPrice = JSON.parse(sessionStorage.getItem('ssMaxPrice'))
  const lsShoppingCard = JSON.parse(localStorage.getItem('lsShoppingCard'))


  const handleToggleSort = () => {
    setOpenSort((prevOpenSort) => !prevOpenSort);
  };
  const handleCloseSort = (event) => {
    if (anchorRefSort.current && anchorRefSort.current.contains(event.target)) {
      return;
    }

    setOpenSort(false);
  };
  function handleListKeyDownSort(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenSort(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpenSort = useRef(openSort);
  useEffect(() => {
    if (prevOpenSort.current === true && openSort === false) {
      sortIconVisibility&&anchorRefSort.current.focus();
    }
    prevOpenSort.current = openSort;
  }, [openSort]);
// ----------------------handleLogout----------------------------------------------------
  const handleLogout = (e) =>{
    e.preventDefault()
    const config = {
      headers:{
          'Authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    }
    axios.post(urlLogout, '' , config)
    .then(() =>{ 
        Cookies.remove('refreshTokenExist')
          setAccessToken(null)
          setUserData(null)
          window.location.href='/'
    })
    .catch(error => console.log(error, 'error'))
  }
// -----------------------refresh accessToken---------------------------------------------------
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if(!accessToken&&Cookies.get('refreshTokenExist')){
      axios.post(urlRefreshAccessTokenWithUserData, '', {withCredentials: true, cancelToken: source.token})
        .then(response => {
          localStorage.removeItem('lsShoppingCardArray')
          setIsAdmin(response.data[0].isAdmin)
          setAccessToken(response.data[0].accessToken)
          const newUserData = response.data
          newUserData
          .forEach(x=>{
            delete x.accessToken
          })
          setUserData(newUserData)
        })
        // .catch(error => console.log(error,'error'));
        .catch(error=>{
          if (axios.isCancel(error)) {
            console.log('refreshTokenExist cleaned up');
          } else {
            console.log(error,'error')
          }
        })
      return () => source.cancel() 
    } 
    else if(accessToken){
      const timer = setInterval(() => {
        axios.post(urlRefreshAccessToken, '', {withCredentials: true, cancelToken: source.token})
        .then(response => {
          setAccessToken(response.data.accessToken)
        })
        // .catch(error => console.log(error,'error'));
        .catch(error=>{
          if (axios.isCancel(error)) {
            console.log('refreshTokenExist cleaned up');
          } else {
            console.log(error,'error')
          }
        })
      }, 870000);
      return () => {
        clearInterval(timer)
        source.cancel()
      };
    }
  },[ accessToken, refreshTokenExist])
// ----------------------addNotLoggedUserShoppingCardToLoggedUser---------------------------------
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if(userData&&lsShoppingCard){
      const config = {
        headers:{
            'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true, 
        cancelToken: source.token
      }
      const id = userData[0]._id
      const shoppingCardData = {lsShoppingCard}
      localStorage.removeItem('lsShoppingCard')
      axios.put(urlAddToShoppingCardNotLoggedUser+'/'+id, shoppingCardData, config)
      .then(()=>{
        console.log("Not logged user shopping card cleaned.")
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
  },[userData&&lsShoppingCard])
// -----------------------getCategoriesByEffect---------------------------------------------------
  const recursiveFunction = (cat, parent) =>{
    let node = []
    cat
      .filter(x=>x.parentId===parent)
      .forEach(y=>{
        node.push({_id: y._id, categoryName: y.categoryName, parentId: y.parentId, children: recursiveFunction(cat, y._id)})
      })
      return node
  }
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setRefreshTokenExist(Cookies.get('refreshTokenExist'))
    axios.get(url,{cancelToken: source.token})
    .then(response =>{ 
      const newResponseData = recursiveFunction(response.data, '0')
      setCategoryDb(newResponseData) 
    })
    // .catch(error => console.log(error, 'error'))
    .catch(error=>{
      if (axios.isCancel(error)) {
        console.log('url cleaned up');
      } else {
        console.log(error,'error')
      }
    })
    return () => source.cancel() 
  },[]);
// -----------------------getProductsByEffect------------------------------------------------
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios.get(urlProducts,{cancelToken: source.token})
    .then(response =>{ 
      setProductByCategoryPath(response.data)
      setAllProductsByCategoryPath(response.data)
    })
    // .catch(error => console.log(error, 'error'))
    .catch(error=>{
      if (axios.isCancel(error)) {
        console.log('urlProducts cleaned up');
      } else {
        console.log(error,'error')
      }
    })
    return () => source.cancel() 
  },[])
// ---------------------getItemsShoppingCardEffect------------------------------------------------   
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
      const id = userData&&userData[0]._id
      axios.post(urlGetShoppingCard, {id}, config)
      .then(response=>{
        return setShoppingCard(response.data)
      })
      // .catch(error=>console.log(error))
      .catch(error=>{
        if (axios.isCancel(error)) {
          console.log('urlGetShoppingCard cleaned up');
        } else {
          console.log(error,'error')
        }
      })
    } 
    return () => source.cancel() 
  },[userData])
// ---------------------getShippingListEffect------------------------------------------------   
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios.get(urlGetShipping, {cancelToken: source.token})
    .then(response=>{
      return setShippingList(response.data)
    })
    // .catch(error=>console.log(error))
    .catch(error=>{
      if (axios.isCancel(error)) {
        console.log('urlGetShipping cleaned up');
      } else {
        console.log(error,'error')
      }
    })
    return () => source.cancel() 
  },[])
// --------------------------effectProductToDisplay------------------------------------------
  useEffect(()=>{
    if(searchProduct){
      setProductToDisplay(searchProduct)
    }
    else if(productByCategoryPath){
      setProductToDisplay(productByCategoryPath)
    }
  },[searchProduct, productByCategoryPath])

  useEffect(()=>{
    if(!minPrice && !maxPrice){
      setCopyOfFilteredProduct(productByCategoryPath)
      setProductToDisplay(productByCategoryPath)
    }
    else if(minPrice && !maxPrice){
      const firstProductToDisplay = productByCategoryPath
      const newProductToDisplay = firstProductToDisplay&&firstProductToDisplay.filter(x=>{
        return parseInt(x.price) >= parseInt(minPrice)
      })
      setProductToDisplay(newProductToDisplay)
      setCopyOfFilteredProduct(newProductToDisplay)
    }
    else if(!minPrice && maxPrice){
      const firstProductToDisplay = productByCategoryPath
      const newProductToDisplay = firstProductToDisplay&&firstProductToDisplay.filter(x=>{
        return parseInt(x.price) <= parseInt(maxPrice)
      })
      setCopyOfFilteredProduct(newProductToDisplay)
      setProductToDisplay(newProductToDisplay)
    }
    else if(minPrice && maxPrice){
      const firstProductToDisplay = productByCategoryPath
      const newProductToDisplay = firstProductToDisplay&&firstProductToDisplay.filter(x=>{
        return parseInt(x.price) >= parseInt(minPrice) && parseInt(x.price) <= parseInt(maxPrice)
      })
      setCopyOfFilteredProduct(newProductToDisplay)
      setProductToDisplay(newProductToDisplay)
    }
  },[productByCategoryPath])
// -------------------topScrollEffect--------------------------------------------------------
  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth' })
  }, [scrollTop])
// -------------------sortEffect----------------------------------------------------------
  useEffect(()=>{
    if(checkSort === 'descending'){
      descendingPriceFunction()
    }
    else if(checkSort === 'ascending'){
      ascendingPriceFunction()
    }
  },[productToDisplay])
// -------------------sortProducts--------------------------------------------------------
  const ascendingPriceFunction = () =>{
    const newProductToDisplay = productToDisplay&&productToDisplay.sort((a, b)=>{
      return a.price - b.price;
    })
    setProductToDisplay(newProductToDisplay)
    setForceRender(forceRender+1)
    sessionStorage.setItem('lsCheckSort',JSON.stringify('ascending'))
  }
  const descendingPriceFunction = () =>{
    const newProductToDisplay = productToDisplay&&productToDisplay.sort((a, b)=>{
      return a.price - b.price;
    }).reverse()
    setProductToDisplay(newProductToDisplay)
    setForceRender(forceRender-1)
    sessionStorage.setItem('lsCheckSort',JSON.stringify('descending'))
  }
// -------------------effectGetCompanyData---------------------------------------------------
  useEffect(()=>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios.get(urlCompanyData, {cancelToken: source.token})
    .then(response =>{ 
      setCompanyData(response.data) 
    })
    // .catch(error => console.log(error, 'error'))
    .catch(error=>{
      if (axios.isCancel(error)) {
        console.log('urlCompanyData cleaned up');
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
  return (
    <CategoryDbContext.Provider value={[categoryDb, setCategoryDb]}>
    <ProductByCategoryPathContext.Provider value={[productByCategoryPath, setProductByCategoryPath]}>
    <ServerResContext.Provider value={[serverRes, setServerRes]}>
    <AccessTokenContext.Provider value={[accessToken, setAccessToken]}> 
    <UserDataContext.Provider value={[userData, setUserData]}>
    <AllProductsByCategoryPathContext.Provider value={[allProductsByCategoryPath, setAllProductsByCategoryPath]}>
    <IsAdminContext.Provider value={[isAdmin, setIsAdmin]}>
    <ShoppingCardContext.Provider value={[shoppingCard, setShoppingCard]}>
    <ShippingListContext.Provider value={[shippingList, setShippingList]}>
    <TotalPriceContext.Provider value={[totalPrice, setTotalPrice]}>
    <SearchProductContext.Provider value={[searchProduct, setSearchProduct]}>
    <ProductToDisplayContext.Provider value={[productToDisplay, setProductToDisplay]}>
    <ScidContext.Provider value={[scid, setScid]}>
    <PridContext.Provider value={[prid, setPrid]}>
    <SortIconVisibilityContext.Provider value={[sortIconVisibility, setSortIconVisibility]}>
    <CompanyDataContext.Provider value={[companyData, setCompanyData]}>
    <CopyOfFilteredProductContext.Provider value={[copyOfFilteredProduct, setCopyOfFilteredProduct]}>
    <Router> 
      <div className='app'>
        <div>
            <Navbar/>
        </div>
            <div className='logoSpace'>
              <Link to='/companyData' style={{color:'inherit', textDecoration: 'inherit' }}>
                <div className='logo'>
                  {companyData&&companyData[0].logo}
                </div>
              </Link>
            </div>
            <div className='mainPage'>
                <Routes>
                  <Route exact path="/" element={<Home/>}/>
                  <Route path="/login"  element={<Login/>}/>
                  {userData&&<Route path="/userProfile" element={<UserProfile/>}/>}
                  {userData&&<Route path="/changePassword" element={<ChangePassword/>}/>}
                  {isAdmin&&<Route path="/usersDelete" element={<UsersDelete/>}/>}
                  <Route path="/productCard/:_id" element={<ProductCard/>}/>
                  {isAdmin&&<Route path="/addProductCard/:_id" element={<AddProductCard/>}/>}
                  {isAdmin&&<Route path="/finalOrdersCard" element={<FinalOrdersCard/>}/>}
                  <Route path="/userRegister" element={<UserRegister/>}/>
                  <Route path="/shoppingCard/" element={<ShoppingCard/>}/>
                  <Route path="/confirmationResetPasswordLink/:id" element={<ResetPassword />}/>
                  <Route path="/paymentFail" element={<PaymentFail/>}/>
                  <Route path="/confirmationUserRegister/:data" element={<ConfirmationUserRegister />}/>
                  <Route path="/companyData" element={<CompanyData />}/>
                  <Route path="*" element={<PageNotFound />}/>
                </Routes>
          <div className='isMobileHome'>
            {!isSmallScreen&&isAdmin&&<Tooltip title='Completed orders' placement="top-start" arrow>
              <IconButton component={Link} to="/finalOrdersCard">
                <ListAltOutlinedIcon  />
              </IconButton>
            </Tooltip>}
            {!isSmallScreen&&isAdmin&&<br/>}
            {!isSmallScreen&&!userData&&<Tooltip title='Login' placement="right" arrow>
              <IconButton component={Link} to='/Login'>
                  <DirectionsBikeOutlinedIcon />
              </IconButton>
            </Tooltip>}
            {!isSmallScreen&&!userData&&<br/>}
            {!isSmallScreen&&!userData&&<Tooltip title='Register' placement="right" arrow>
              <IconButton component={Link} to='/userRegister' >
                <BorderColorOutlinedIcon />
              </IconButton>
            </Tooltip>}
            {!isSmallScreen&&!userData&&<br/>}
            {!isSmallScreen&&userData&&<Tooltip title={userData&&(<span>{userData[0].email}</span>)} placement="right" arrow>  
              <IconButton component={Link} to='/userProfile' >
                <PersonIcon />
              </IconButton>
            </Tooltip>}
            {!isSmallScreen&&userData&&<br/>}
            {!isSmallScreen&&userData&&<Tooltip title='Logout' placement="right" arrow>
              <IconButton onClick={(e)=>handleLogout(e)}>
                  <ExitToAppIcon />
              </IconButton>
            </Tooltip>}
            {!isSmallScreen&&userData&&<br/>}
            {!isSmallScreen&&isAdmin&&<Tooltip title='Add product' placement="right" arrow>
              <IconButton component={Link} to="/AddProductCard/:_id">
                <AddToPhotosOutlinedIcon />
              </IconButton>
            </Tooltip>}
            {!isSmallScreen&&isAdmin&&<br/>}
            {!isSmallScreen&&isAdmin&&<Tooltip title='All users' placement="right" arrow>
              <IconButton component={Link} to="/usersDelete" >
                <PeopleAltOutlinedIcon />
              </IconButton>
            </Tooltip>}
            {!isSmallScreen&&isAdmin&&<br/>}
            <Tooltip title='Home' placement="right" arrow>
              <IconButton component={Link} to="/" onClick={()=>setProductToDisplay(allProductsByCategoryPath)}>
                <HomeOutlinedIcon />
              </IconButton>
            </Tooltip><br/>
            <Tooltip  title='Scroll to top' placement="right" arrow>
              <IconButton   onClick={()=>setScrollTop(!scrollTop)}>
                <ArrowUpwardIcon />
              </IconButton>
            </Tooltip><br/>
            {sortIconVisibility&&<Tooltip  title='Sort items' placement="right" arrow>
              <IconButton
                ref={anchorRefSort}
                aria-controls={openSort ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggleSort} 
                >
                <FormatLineSpacingOutlinedIcon/>
              </IconButton>
            </Tooltip>}
          </div>
            </div>  
        <div>
            <Footer/>
        </div>
        <Popper 
          open={openSort} 
          anchorEl={anchorRefSort.current} 
          role={undefined} 
          transition 
          disablePortal
        >
          {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseSort}>
                <MenuList autoFocusItem={openSort} id="menu-list-grow" onKeyDown={handleListKeyDownSort}>
                    <ListItem button onClick={ascendingPriceFunction} disablePadding >&nbsp;  ASCENDING &nbsp;&nbsp;&nbsp;<ArrowUpwardIcon fontSize='small'/></ListItem>
                  <br/>
                    <ListItem button onClick={descendingPriceFunction} disablePadding>&nbsp;  DESCENDING  &nbsp;<ArrowDownwardIcon fontSize='small'/></ListItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
          )}
        </Popper>
      </div>
    </Router>
    </CopyOfFilteredProductContext.Provider>
    </CompanyDataContext.Provider>
    </SortIconVisibilityContext.Provider>
    </PridContext.Provider>
    </ScidContext.Provider>
    </ProductToDisplayContext.Provider>
    </SearchProductContext.Provider>
    </TotalPriceContext.Provider>
    </ShippingListContext.Provider>
    </ShoppingCardContext.Provider>
    </IsAdminContext.Provider>
    </AllProductsByCategoryPathContext.Provider>
    </UserDataContext.Provider>
    </AccessTokenContext.Provider>
    </ServerResContext.Provider>
    </ProductByCategoryPathContext.Provider>
    </CategoryDbContext.Provider>
  );
}

export default App;