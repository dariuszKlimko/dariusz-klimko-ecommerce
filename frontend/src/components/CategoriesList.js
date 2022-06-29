import React, { useState, useContext, useEffect} from 'react'
import SubList from './CategoriesSubList'
import CategoryNameContext from '../contexts/CategoryNameContext'
import ServerResContext from '../contexts/ServerResContext'
import UserDataContext from '../contexts/UserDataContext'
import AllProductsByCategoryPathContext from '../contexts/AllProductsByCategoryPathContext'
import IsAdminContext from '../contexts/IsAdminContext'
import ProductToDisplayContext from '../contexts/ProductToDisplayContext'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ListItem from '@material-ui/core/ListItem';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';


const List = ({categoryDb}) => {

    const [category, setCategory] = useState('')
    const [showAddCategoryInput, setShowAddCategoryInput] = useState(false)
    const [showAllCategories, setShowAllCategories] = useState(false)
    const [shutAllSubCategories, setShutAllSubCategories] = useState('')

    const [categoryName, setCategoryName] = useContext(CategoryNameContext)
    const [serverRes, setServerRes] = useContext(ServerResContext)
    const [userData, setUserData] = useContext(UserDataContext)
    const [allProductsByCategoryPath, setAllProductsByCategoryPath] = useContext(AllProductsByCategoryPathContext)
    const [isAdmin, setIsAdmin] = useContext(IsAdminContext)
    const [productToDisplay, setProductToDisplay] = useContext(ProductToDisplayContext)

// -----------------------------effectForAdmi/User-------------------------------------
    useEffect(()=>{
        userData&&setIsAdmin(userData[0].isAdmin)
    },[userData])
// -----------------------------handleClickAllCatagories--------------------------------
    const handleClickAllCatagories = (e) =>{
        e.preventDefault();
        setShowAllCategories(!showAllCategories)
        setProductToDisplay(allProductsByCategoryPath)
    }
// -----------------------------handleSubmitCategory-------------------------------------
    const handleSubmitCategory = (e) =>{
        e.preventDefault();
        setCategoryName(category)
    }
// -----------------------------handleAddCategorySubmit----------------------------------
    const handleAddCategorySubmit = (e) =>{
        e.preventDefault();
        setShowAddCategoryInput(true)
    }
// -----------------------------handleCloseCategorySubmit--------------------------------
    const handleCloseCategorySubmit = (e) =>{
        e.preventDefault();
        setServerRes('')
        setCategoryName('')
        setShowAddCategoryInput(false)
    }

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
    return(
        <div >
            <div style={{display:'flex'}}>
                {isAdmin&&!showAddCategoryInput&&<Tooltip title='Add category' placement="top-start" arrow>
                    <IconButton onClick={handleAddCategorySubmit}>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Tooltip>}
                {isAdmin&&<ListItem button onClick={(e)=>handleClickAllCatagories(e)}>CATEGORIES</ListItem>}
            </div>
            {showAddCategoryInput&&<form  onSubmit={handleSubmitCategory}>
                <Tooltip title='Add category' placement="top-start" arrow>
                    <IconButton type='submit'>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <input
                    className='inputCategory'
                    size='10'
                    id='categoryName'
                    type='text'
                    placeholder='category...'
                    onChange={(e)=>setCategory(e.target.value)}
                />
                <Tooltip title='Close' placement="top-start" arrow>
                    <IconButton onClick={handleCloseCategorySubmit}>
                        <CancelOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <br/>
            {serverRes} 
            </form>}
            {(showAllCategories||!isAdmin)&&<SubList
                categoryDb={categoryDb}
                shutAllSubCategories={shutAllSubCategories}
            />}
        </div>
    );
}

export default List;