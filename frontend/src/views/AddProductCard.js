import React, { useState, useContext, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import '../App.css'
import CategoryDbContext from '../contexts/CategoryDbContext'
import ServerResContext from '../contexts/ServerResContext'
import ProductByCategoryPathContext from '../contexts/ProductByCategoryPathContext'
import AccessTokenContext from '../contexts/AccessTokenContext'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined'
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import CachedOutlinedIcon from '@material-ui/icons/CachedOutlined'
import CircularProgress from '@material-ui/core/CircularProgress';


const AddProductCard = () => {

    const url = '/addProductCard'
    const urlUpdate = '/updateProduct'

    const params = useParams()

    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [pieces, setPieces] = useState('')
    const [description, setDescription] = useState('')
    const [categoryPath, setCategoryPath] = useState('')
    const [uploadedFile, setUploadedFile] = useState([])
    const [uploadedFileLast, setUploadedFileLast] = useState('')
    const [defImgCollection, setDefImgCollecton] = useState([])
    const [defImgToDelete, setDefImgToDelete] = useState([])
    const [defValue, setDefValue] = useState('')
    const [flag, setFlag] = useState(false)

    const [categoryDb, setCategoryDb] = useContext(CategoryDbContext)
    const [serverRes, setServerRes] = useContext(ServerResContext)
    const [productByCategoryPath, setProductByCategoryPath] = useContext(ProductByCategoryPathContext)
    const [accessToken, setAccessToken] = useContext(AccessTokenContext)
    const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// --------------------------handleSubmit------------------------------------------------------------
    const handleSubmit = (e) =>{ 
        e.preventDefault()
        setFlag(true)
        const config = {
            headers:{
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        }
        const sendData = {title, price, category, pieces, description, categoryPath};
        // ----------file upload-------------------------------
        var formData = new FormData();
        formData.append('uploadedFile', JSON.stringify(sendData));
        uploadedFile.forEach((x)=>{
            formData.append(`uploadedFile`, x.file)
        }); 
        //-----------------------------------------------------
        axios.post(url, formData, config)
        .then(response =>{ 
            return response.data==='Title already exist!!!'?setServerRes(response.data):setServerRes('Done!!!')&window.location.reload()                                                                           
        })
        .catch(error => console.log(error, 'error'))
    }
// --------------------------callRecursiveFunction-------------------------------------------------
    let node=[], node_1=[], node_2=[]
    const recursiveFunction = (param) =>{
        param
            .forEach(y=>{
                recursiveFunction(y.children)
                return y.parentId!=='0'?node_1.push(y):(node_1.push(y))&(node_1.reverse())&(node.push(node_1))*(node_2 = node.flat())*(node_1=[])
            })
        return node_2
    }
    const callRecursiveFunction = (par) => {
        recursiveFunction(par)
        const newNode_2 = node_2
            .map(z=>{
                return z.children.length!==0?(<optgroup key={z._id} label={z.categoryName}>{z.categoryName}</optgroup>):(<option key={z._id} label={z.categoryName}>{z.categoryName}</option>)
            })
        return newNode_2
    }
// --------------------------handleSetCategory----------------------------------------------------
    let category_1 = []
    const recursiveCategoryPath = (cat_id) =>{
        node_2
            .filter(x=>x._id==cat_id)
            .forEach(x=>{
                category_1.push(x.categoryName)
                recursiveCategoryPath(x.parentId)
            })
            
        return category_1
    }
    const handleSetCategory = (e) =>{
            e.preventDefault()
            setCategory(e.target.value)
    }

    useEffect(()=>{
        
        const newNode_2 = node_2
            .filter(x=>x.categoryName===category)
            .map(x=>{
                return x._id
            })
        const newCategoryPath = recursiveCategoryPath(newNode_2[0])
        setCategoryPath([...newCategoryPath])
    },[category,defValue])
// -------------------------handleUpdateProduct--------------------------------------------------
    useEffect(()=>{
        const newProductByCategoryPath = productByCategoryPath&&productByCategoryPath
            .filter(y=>y._id===params._id)
            .map(x=>{
                return x
            })
            setDefValue(...newProductByCategoryPath)
    },[params])

    useEffect(()=>{
        const newDefValue = defValue&&defValue.imgCollection
            .map(x=>{
                return x
            })
        setDefImgCollecton(newDefValue)
    },[defValue])

    const handleDeleteDefImgCollection = (param,e) =>{
        setDefImgToDelete(arr=>[...arr,param])
        const newDefImgCollection = defImgCollection
            .filter(x=>x!==param)
            .map(y=>{
                return y
            })
        setDefImgCollecton(newDefImgCollection)
    }

    useEffect(()=>{
        defValue&&setTitle(defValue.title)
        defValue&&setPrice(defValue.price)
        defValue&&setCategory(defValue.category)
        defValue&&setPieces(defValue.pieces)
        defValue&&setDescription(defValue.description)
        defValue&&setCategoryPath(defValue.categoryPath)
    },[defValue])

    const handleUpdateProduct = (id,e) =>{
        e.preventDefault()
        setFlag(true)
        const config = {
            headers:{
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        }
        const sendData = {title, price, category, pieces, description, categoryPath, defImgCollection, defImgToDelete};
        // ----------file upload-------------------------------
        var formData = new FormData();
        formData.append('uploadedFile', JSON.stringify(sendData) );
        uploadedFile.forEach((x)=>{
            formData.append(`uploadedFile`, x.file)
        }); 
        axios.put(urlUpdate+'/'+id, formData, config)
        .then(response =>{
            return response.data==='Done!!!'?setServerRes(response.data)&window.location.reload(): null
        })
        .catch(error => console.log(error, 'error'))
    }
// -------------------------handleAddImg------------------------------------------------------
    const handleAddImg = (e) =>{
        e.preventDefault()
        setUploadedFile(arr=>[...arr,{key:e.timeStamp}])
    }
    useEffect(() => {
        const newUploadFile = uploadedFile
            .map(x=>{
                return x.key!==uploadedFileLast.key ? x : uploadedFileLast
            })
        setUploadedFile(newUploadFile)
    },[uploadedFileLast])
        // -------------------------imgPreview--------------------
        const functionObjectUrl = (param) => {
            if(!param) {
                return undefined
            }
            else{
                const newObjectUrl = URL.createObjectURL(param)
                return newObjectUrl
            }
        }
// -------------------------handleDeleteImg--------------------------------------------------
    const handleDeleteImg = (param, e) =>{
        e.preventDefault()
        const newUploadFile = uploadedFile
            .filter(x=>x.key!==param)
            .map(y=>{
                return y
            })
        return setUploadedFile(newUploadFile)
    }
// -------------------------sortIconVisibilityEffect-----------------------------------------
    useEffect(()=>{
        setSortIconVisibility(false)
    },[])
// -------------------------setFlagFalse-----------------------------------------------------
    useEffect(()=>{
        setFlag(false)
    },[serverRes])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
    return (
        <div className='addProductCardView' >
            <br/><br/>
            <form onSubmit={(e)=>params._id===':_id'?handleSubmit(e):handleUpdateProduct(params._id,e)}>
                <div className='inputDivAddProduct'>
                    <input
                        className='inputAddProduct'
                        name='title'
                        required
                        type='text'
                        placeholder='title'
                        onChange={(e)=>setTitle(e.target.value)}
                        defaultValue={defValue&&params._id!==':_id'?defValue.title:null}
                    />
                </div>
                <br/>
                <br/>
                <div className='inputDivAddProduct'>
                    <input
                        className='inputAddProduct'
                        name='price'
                        required
                        type='text'
                        placeholder='price'
                        onChange={(e)=>setPrice(e.target.value.replace(/[^0-9]/,''))}
                        value={price}
                    />
                </div>
                <br/>
                <br/>
                <div className='divSelectAddProduct'>
                    <select 
                        style={{textAlignLast:'center'}}
                        required 
                        className='selectAddProduct'
                        name='category' 
                        onChange={(e)=>handleSetCategory(e)} 
                    >
                        {defValue&&params._id!==':_id'?<option value={defValue.category}>{defValue.category}</option>:<option value='' >category</option>}
                        {categoryDb&&callRecursiveFunction(categoryDb)}
                    </select>
                </div>
                <br/>
                <br/>
                <div className='divNumberAddProduct'>
                    <input
                        className='inputNumberAddProduct'
                        name='pieces'
                        placeholder='pieces'
                        required
                        type='number'
                        min='0'
                        onChange={(e)=>setPieces(e.target.value.replace(/[^0-9]/,''))}
                        value={parseInt(pieces)}
                    />
                </div>
                <br/>
                <br/>
                <br/>
                <div className='divTextAreaAddProduct'>
                    <textarea
                        className='textAreaAddProduct'
                        rows='10' 
                        cols='43'
                        name='description'
                        required
                        type='text'
                        autoComplete='off'
                        placeholder='description'
                        onChange={(e)=>setDescription(e.target.value)} 
                        value={description}
                    />
                </div>
                <br/>       
                <br/>
                <div className='uploadImgGroup'>
                    {defImgCollection&&params._id!==':_id'?defImgCollection.map((x)=>
                        <div className='uploadImg' key={x}>uploaded img
                            <Tooltip  title='Delete photo' placement="top-start" arrow>
                                <IconButton  onClick={(e)=>handleDeleteDefImgCollection(x,e)}>
                                    <DeleteForeverOutlinedIcon  style={{fontSize: '1.55vw'}}/>
                                </IconButton>
                            </Tooltip>
                            <img src={x} alt={x} width='90%' height='70%'/>
                        </div>):null}
                </div>
                <br/>     
                <div className='uploadImgGroup'>
                    {uploadedFile&&uploadedFile.map(x=>
                        <div className='uploadImg' key={x.key}>
                            <br/>
                            {x.objectUrl&&<img src={x.objectUrl} alt='AddProductCardSmall'  width='90%' height='70%'/>}
                            <Tooltip title='1600x1200' placement="top-start" arrow>
                                <IconButton  variant='contained' component="label">
                                    <AddPhotoAlternateOutlinedIcon fontSize='small' />
                                        <input
                                            id='file'
                                            hidden
                                            required
                                            type='file'
                                            onChange={(e)=>{
                                                if(e.target.files[0].size > 2200000){
                                                    alert("File is too big!");
                                                    e.target.value=''
                                                } else{
                                                    setUploadedFileLast({key:x.key, file:e.target.files[0], objectUrl: functionObjectUrl(e.target.files[0])})
                                                }
                                            }}
                                        />
                            </IconButton>
                        </Tooltip>
                        <Tooltip  title='Delete photo2' placement="top-start" arrow>
                            <IconButton  onClick={(e)=>handleDeleteImg(x.key,e)}>
                                <DeleteForeverOutlinedIcon fontSize='small' />
                            </IconButton>
                        </Tooltip>
                        </div>
                    )}
                </div>
                <div className='addOrUpdateProduct'>
                    <Tooltip  title='Add photo' placement="top-start" arrow>
                        <IconButton  onClick={(e)=>handleAddImg(e)}>
                            <AddPhotoAlternateOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {params._id===':_id'?<Tooltip  title='Add product' placement="top-start" arrow>
                        <IconButton  type='submit'>
                            <CheckOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>:<Tooltip  title='Update product' placement="top-start" arrow>
                        <IconButton  type='submit'>
                            <CachedOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>}
                </div>
                <br/>
                {flag&&!serverRes&&<div className='pageNotFoundView'>
                    <div><CircularProgress/><br/>loading...</div>
                </div>}
                <br/>
            </form>
        </div>
    );
}

export default AddProductCard;