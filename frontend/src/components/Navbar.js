import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link} from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import axios from 'axios'
import Cookies from 'js-cookie'
import '../App.css'
import ProductSearch from '../components/ProductSearch'
import Filter from '../components/Filter'
import Categories from '../components/Categories'
import ShippingList from '../components/ShippingList'
import TooltipShoppingCard from '../components/TooltipShoppingCard'
import AccessTokenContext from '../contexts/AccessTokenContext'
import UserDataContext from '../contexts/UserDataContext'
import ShoppingCardContext from '../contexts/ShoppingCardContext'
import IsAdminContext from '../contexts/IsAdminContext'
import SearchProductContext from '../contexts/SearchProductContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'


import { makeStyles } from '@material-ui/styles';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddToPhotosOutlinedIcon from '@material-ui/icons/AddToPhotosOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import DirectionsBikeOutlinedIcon from '@material-ui/icons/DirectionsBikeOutlined';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import TuneOutlinedIcon from '@material-ui/icons/TuneOutlined';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';


const useStyles = makeStyles({
  font1: {
    fontSize: "1vw",
    height:"1.55vw",
    width:"1.55vw",
    borderRadius:"1.55vw"
   }
 });

const Navbar = () => {

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const anchorRef = useRef(null);
  const anchorRef1 = useRef(null);
  const anchorRefSearch = useRef(null);
  const anchorRefFilter = useRef(null);

  const isSmallScreen = useMediaQuery({ query: '(min-width: 360px)' })

  const classes = useStyles();

  const urlLogout = '/logout'

  const [lsShoppingCardData, setLsShoppingCardData] = useState('')

  const [accessToken, setAccessToken] = useContext(AccessTokenContext)
  const [userData, setUserData] = useContext(UserDataContext)
  const [shoppingCard, setShoppingCard] = useContext(ShoppingCardContext)
  const [isAdmin, setIsAdmin] = useContext(IsAdminContext)
  const [searchProduct, setSearchProduct] = useContext(SearchProductContext)
  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// ------------------------------------------------------------------------------------
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current&&anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
// -------------------------------------------------------------------------------------
  const handleToggle1 = () => {
    setOpen1((prevOpen1) => !prevOpen1);
  };
  const handleClose1 = (event) => {
    if (anchorRef1.current && anchorRef1.current.contains(event.target)) {
      return;
    }
    setOpen1(false);
  };
  function handleListKeyDown1(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen1(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpen1 = useRef(open1);
  useEffect(() => {
    if (prevOpen1.current === true && open1 === false) {
      anchorRef1.current&&anchorRef1.current.focus();
    }
    prevOpen1.current = open1;
  }, [open1]);
// -----------------------------------------------------------------------------------
  const handleToggleSearch = () => {
    setOpenSearch((prevOpenSearch) => !prevOpenSearch);
  };
  const handleCloseSearch = (event) => {
    if (anchorRefSearch.current && anchorRefSearch.current.contains(event.target)) {
      return;
    }
    setOpenSearch(false);
  };
  function handleListKeyDownSearch(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenSearch(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpenSearch = useRef(openSearch);
  useEffect(() => {
    if (prevOpenSearch.current === true && openSearch === false) {
      anchorRefSearch.current&&anchorRefSearch.current.focus();
    }
    prevOpenSearch.current = openSearch;
  }, [openSearch]);
  // ---------------------------------------------------------------------------------
  const handleToggleFilter = () => {
    setOpenFilter((prevOpenFilter) => !prevOpenFilter);
  };
  const handleCloseFilter = (event) => {
    if (anchorRefFilter.current && anchorRefFilter.current.contains(event.target)) {
      return;
    }
    setOpenFilter(false);
  };
  function handleListKeyDownFilter(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenFilter(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpenFilter = useRef(openFilter);
  useEffect(() => {
    if (prevOpenFilter.current === true && openFilter === false) {
      anchorRefSearch.current&&anchorRefSearch.current.focus();
    }
    prevOpenFilter.current = openFilter;
  }, [openFilter]);
  
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
// ----------------------handleSearchProduct-------------------------------------------------
  const handleSearch = (product) =>{
    setSearchProduct(product)
  }
// ----------------------effectLocalStore----------------------------------------------------
  useEffect(()=>{
    setLsShoppingCardData(JSON.parse(localStorage.getItem('lsShoppingCard')))
  },[])

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='navBar' >
          {sortIconVisibility&&<Tooltip  title='Categories' placement="top-start" arrow>
            <IconButton 
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle} 
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>}
          {isAdmin&&<Tooltip  title='Shipping' placement="top-start" arrow>
            <IconButton 
              ref={anchorRef1}
              aria-controls={open1 ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle1} 
            >
              <LocalShippingOutlinedIcon />
            </IconButton>
          </Tooltip>}
          {isSmallScreen&&isAdmin&&<Tooltip title='Add product' placement="top-start" arrow>
            <IconButton component={Link} to="/AddProductCard/:_id">
              <AddToPhotosOutlinedIcon />
            </IconButton>
          </Tooltip>}
          {isSmallScreen&&isAdmin&&<Tooltip title='All users' placement="top-start" arrow>
            <IconButton component={Link} to="/usersDelete" >
              <PeopleAltOutlinedIcon />
            </IconButton>
          </Tooltip>}
          {isSmallScreen&&isAdmin&&<Tooltip title='Completed orders' placement="top-start" arrow>
            <IconButton component={Link} to="/finalOrdersCard">
              <ListAltOutlinedIcon  />
            </IconButton>
          </Tooltip>}
        {sortIconVisibility&&<Tooltip  title='Search' placement="right" arrow>
          <IconButton
            ref={anchorRefSearch}
            aria-controls={openSearch ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggleSearch} 
          >
            <SearchOutlinedIcon />
          </IconButton>
        </Tooltip>}
        {sortIconVisibility&&<Tooltip  title='Filter' placement="right" arrow>
          <IconButton
            ref={anchorRefFilter}
            aria-controls={openFilter ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggleFilter} 
          >
            <TuneOutlinedIcon />
          </IconButton>
        </Tooltip>}
        {!sortIconVisibility&&<div style={{width:'80px'}}></div>}
         <span style={isAdmin?{width:'90vw'}:{width:'90vw'}}></span>
          {!isAdmin&&<Tooltip title={!isAdmin?<TooltipShoppingCard shoppingCard={userData?shoppingCard&&shoppingCard.products:lsShoppingCardData}/>:'Shooping card'}  arrow>
            <IconButton component={Link} to={!isAdmin?'/shoppingCard':'/'} >
              <Badge classes={{badge: classes.font1}}  badgeContent={shoppingCard&&shoppingCard.products?(shoppingCard.products.length?shoppingCard.products.length:'0'):(lsShoppingCardData?lsShoppingCardData.length:'0')}  color='primary'>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>}
          {isSmallScreen&&userData&&<Tooltip title={userData&&(<span>{userData[0].email}</span>)} placement="top-start" arrow>  
            <IconButton component={Link} to='/userProfile' >
              <PersonIcon />
            </IconButton>
          </Tooltip>}
          {isSmallScreen&&userData&&<Tooltip title='Logout' placement="top-start" arrow>
            <IconButton onClick={(e)=>handleLogout(e)}>
                <ExitToAppIcon />
            </IconButton>
          </Tooltip>}
          {isSmallScreen&&!userData&&<Tooltip title='Login' placement="top-start" arrow>
            <IconButton component={Link} to='/Login'>
                <DirectionsBikeOutlinedIcon />
            </IconButton>
          </Tooltip>}
          {isSmallScreen&&!userData&&<Tooltip title='Register' placement="top-start" arrow>
            <IconButton component={Link} to='/userRegister' >
              <BorderColorOutlinedIcon />
            </IconButton>
          </Tooltip>}
        <Popper 
          open={open} 
          anchorEl={anchorRef.current} 
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
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <Categories />
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Popper 
          open={open1} 
          anchorEl={anchorRef1.current} 
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
                <ClickAwayListener onClickAway={handleClose1}>
                  <MenuList autoFocusItem={open1} id="menu-list-grow" onKeyDown={handleListKeyDown1}>
                    {isAdmin&&<ShippingList/>}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Popper 
          open={openSearch} 
          anchorEl={anchorRefSearch.current} 
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
                <ClickAwayListener onClickAway={handleCloseSearch}>
                  <MenuList autoFocusItem={openSearch} id="menu-list-grow" onKeyDown={handleListKeyDownSearch}>
                    <ProductSearch 
                      handleSearch={handleSearch}
                    />
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Popper 
          className='popper'
          open={openFilter} 
          anchorEl={anchorRefFilter.current} 
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
                <ClickAwayListener onClickAway={handleCloseFilter}>
                  <MenuList autoFocusItem={openFilter} id="menu-list-grow" onKeyDown={handleListKeyDownFilter}>
                    <Filter />
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
    </div>
  );
}

export default Navbar;
