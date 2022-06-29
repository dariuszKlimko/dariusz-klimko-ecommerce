import React,{useState, useContext, useEffect} from 'react'
import axios from 'axios'
import CategoryNameContext from '../contexts/CategoryNameContext'
import ParentIdContext from '../contexts/ParentIdContext'
import ServerResContext from '../contexts/ServerResContext'
import AccessTokenContext from '../contexts/AccessTokenContext'
import UserDataContext from '../contexts/UserDataContext'
import IsAdminContext from '../contexts/IsAdminContext'
import ProductToDisplayContext from '../contexts/ProductToDisplayContext'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';


const SubList = ({categoryDb, shutAllSubCategories}) => {

    const urlDelete = '/delete'
    const urlUpdate = '/update'
    const urlProducts = '/products'

    const [category, setCategory] = useState('')
    const [parent, setParent] = useState('')
    const [categoryNameEdit, setCategoryNameEdit] = useState('')
    const [showAddCategoryInput, setShowAddCategoryInput] = useState({})
    const [showUpdateCategoryInput, setShowUpdateCategoryInput] = useState({})
    const [displayChildren, setDisplayChildren] = useState({})

    const [categoryName, setCategoryName] = useContext(CategoryNameContext)
    const [parentId, setParentId] = useContext(ParentIdContext)
    const [serverRes, setServerRes] = useContext(ServerResContext)
    const [accessToken, setAccessToken] = useContext(AccessTokenContext)
    const [userData, setUserData] = useContext(UserDataContext)
    const [isAdmin, setIsAdmin] = useContext(IsAdminContext)
    const [productToDisplay, setProductToDisplay] = useContext(ProductToDisplayContext)
    
// -----------------------------effectForAdmi/User-------------------------------------
    useEffect(()=>{
        userData&&setIsAdmin(userData[0].isAdmin)
    },[userData])
// -------------------handleSubmitSubCategor-----------------------------------------------
    const handleSubmitSubCategory = (e) =>{
        e.preventDefault();
        setCategoryName(category) 
        setParentId(parent)
    }
// -------------------handleDeleteSubCategory----------------------------------------------
    const handleDeleteSubCategory = (id, e) =>{
        e.preventDefault()
        const config = {
            headers:{
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        }
        axios.delete(urlDelete+'/'+id, config)
        .then(response =>{
            window.location.reload()
        })
        .catch(error => console.log(error, 'error'))
    }
// -------------------handleUpdateCategory------------------------------------------------
    const handleUpdateCategory = (id,e) =>{
        e.preventDefault();
        const config = {
            headers:{
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        }
        const sendData = {categoryName:categoryNameEdit}
        axios.put(urlUpdate+'/'+id, sendData, config)
        .then(response =>{
            return response.data==='Category name already exist!!!'?setServerRes(response.data):window.location.reload()
        })
        .catch(error => console.log(error, 'error'))
    }
// -------------------handleListClick-----------------------------------------------------
    const handleListClick = (x,e) =>{
        e.stopPropagation()
        setDisplayChildren({...displayChildren, [x.categoryName]: !displayChildren[x.categoryName]});
        axios.get(urlProducts)
        .then(response =>{
            const products = response.data
            const newProducts = products
                .filter(a=>a.categoryPath.some(b=>{
                    return b===x.categoryName
                }))
            setProductToDisplay(newProducts)
        })
        .catch(error => console.log(error, 'error'))
    }
// ----------------effectCloseAllCategories--------------------------------------------------
    useEffect(()=>{
        setDisplayChildren([shutAllSubCategories])
    },[shutAllSubCategories])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
    return(
        <List disablePadding> 
            {categoryDb&&categoryDb.map((x)=>{
            return (<ListItem button key={x._id} >
                <List disablePadding>
                {displayChildren[x.categoryName] ? <ExpandLessIcon onClick={(e) => handleListClick(x,e)}/> : <ExpandMoreIcon onClick={(e) => handleListClick(x,e)}/>}
                {isAdmin&&(!showAddCategoryInput[x.categoryName]&&!showUpdateCategoryInput[x.categoryName])&&<Tooltip title='Add category' placement="top-start" arrow>
                    <IconButton onClick={(e) => {
                            e.stopPropagation()
                            setShowAddCategoryInput({...showAddCategoryInput, [x.categoryName]: true});
                        }}>
                            <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Tooltip>}
                <span onClick={(e) => handleListClick(x,e)}>{x.categoryName}</span>
                {(showAddCategoryInput[x.categoryName]||showUpdateCategoryInput[x.categoryName])&&<form onSubmit={showUpdateCategoryInput[x.categoryName]?(e)=>handleUpdateCategory(x._id,e):handleSubmitSubCategory} className='Form'>
                {isAdmin&&(showAddCategoryInput[x.categoryName]&&!showUpdateCategoryInput[x.categoryName])&&<Tooltip title='Add category' placement="top-start" arrow>
                    <IconButton type='submit'>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Tooltip>}
                    <input
                        className='inputCategory'
                        size='10'
                        type='text'
                        placeholder='category...'
                        name={x._id}
                        defaultValue={showUpdateCategoryInput[x.categoryName]?x.categoryName:null}
                        onChange={showUpdateCategoryInput[x.categoryName]?(e)=>setCategoryNameEdit(e.target.value):(e)=>{
                                setCategory(e.target.value)
                                setParent(x._id)
                            }
                        }
                    />
                    {isAdmin&&(showAddCategoryInput[x.categoryName]&&!showUpdateCategoryInput[x.categoryName])&&<Tooltip title='Close' placement="top-start" arrow>
                        <IconButton onClick={(e) => {
                            e.stopPropagation()
                            setCategoryName('')
                            setServerRes('')
                            setShowAddCategoryInput({...showAddCategoryInput, [x.categoryName]: false})
                        }}>
                            <CancelOutlinedIcon />
                        </IconButton>
                    </Tooltip>}
                    {isAdmin&&(showUpdateCategoryInput[x.categoryName]&&!showAddCategoryInput[x.categoryName])&&<Tooltip title='Update' placement="top-start" arrow>
                        <IconButton type='submit'>
                                <CachedOutlinedIcon />
                        </IconButton>
                    </Tooltip>} 
                    {isAdmin&&(showUpdateCategoryInput[x.categoryName]&&!showAddCategoryInput[x.categoryName])&&<Tooltip title='Close' placement="top-start" arrow>
                        <IconButton onClick={(e) => {
                            e.stopPropagation()
                            setShowUpdateCategoryInput({...showUpdateCategoryInput, [x.categoryName]: false});
                        }}>
                            <CancelOutlinedIcon />
                        </IconButton>
                    </Tooltip>}
                    <br/>
                    {serverRes}
                </form>}
                {isAdmin&&(!showUpdateCategoryInput[x.categoryName]&&!showAddCategoryInput[x.categoryName])&&<Tooltip title='Update' placement="top-start" arrow>
                    <IconButton onClick={(e) => {
                        e.stopPropagation()
                        setShowUpdateCategoryInput({...showUpdateCategoryInput, [x.categoryName]: true});
                    }}>
                        <CachedOutlinedIcon />
                    </IconButton>
                </Tooltip>}
                {isAdmin&&(!showAddCategoryInput[x.categoryName]&&!showUpdateCategoryInput[x.categoryName])&&<Tooltip title='Delete' placement="top-start" arrow>
                    <IconButton onClick={(e) => {
                    if(window.confirm('Delete the item?')){
                        handleDeleteSubCategory(x._id, e)};
                        }}>
                        <DeleteForeverOutlinedIcon />
                    </IconButton>
                </Tooltip>}
                {displayChildren[x.categoryName] && x.children && <SubList  categoryDb={x.children}/>}
                </List>
            </ListItem>)})}
        </List>
    );
}

export default SubList;