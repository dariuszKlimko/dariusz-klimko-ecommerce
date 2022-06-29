import React,{useState, useContext, useEffect} from 'react'
import ProductByCategoryPathContext from '../contexts/ProductByCategoryPathContext'
import ProductToDisplayContext from '../contexts/ProductToDisplayContext'
import CopyOfFilteredProductContext from '../contexts/CopyOfFilteredProductContext'


const Filter = () => {

  const [refresh , setRefresh] = useState(0)
  const [miPrice, setMiPrice] = useState('')
  const [maPrice, setMaPrice] = useState('')
  const [productByCategoryPath, setProductByCategoryPath] = useContext(ProductByCategoryPathContext)
  const [productToDisplay, setProductToDisplay] = useContext(ProductToDisplayContext)
  const [copyOfFilteredProduct, setCopyOfFilteredProduct] = useContext(CopyOfFilteredProductContext)

  const minPrice = JSON.parse(sessionStorage.getItem('ssMinPrice'))
  const maxPrice = JSON.parse(sessionStorage.getItem('ssMaxPrice'))

// --------------------effectFilterByPrice--------------------------------------------------
  useEffect(()=>{
    if(!minPrice && !maxPrice){
      setCopyOfFilteredProduct(productByCategoryPath)
      setProductToDisplay(productByCategoryPath)
    }
    else if(minPrice && !maxPrice){
      const firstProductToDisplay = productByCategoryPath
      const newProductToDisplay = firstProductToDisplay.filter(x=>{
        return parseInt(x.price) >= parseInt(minPrice)
      })
      setCopyOfFilteredProduct(newProductToDisplay)
      setProductToDisplay(newProductToDisplay)
    }
    else if(!minPrice && maxPrice){
      const firstProductToDisplay = productByCategoryPath
      const newProductToDisplay = firstProductToDisplay.filter(x=>{
        return parseInt(x.price) <= parseInt(maxPrice)
      })
      setCopyOfFilteredProduct(newProductToDisplay)
      setProductToDisplay(newProductToDisplay)
    }
    else if(minPrice && maxPrice){
      const firstProductToDisplay = productByCategoryPath
      const newProductToDisplay = firstProductToDisplay.filter(x=>{
        return parseInt(x.price) >= parseInt(minPrice) && parseInt(x.price) <= parseInt(maxPrice)
      })
      setCopyOfFilteredProduct(newProductToDisplay)
      setProductToDisplay(newProductToDisplay)
    }
  },[refresh])
// -------------------------------------------------------------------------------------------
  useEffect(()=>{
    setMiPrice(JSON.parse(sessionStorage.getItem('ssMinPrice')))
    setMaPrice(JSON.parse(sessionStorage.getItem('ssMaxPrice')))
  },[])

  useEffect(()=>{
    if(miPrice!='')
    sessionStorage.setItem('ssMinPrice',JSON.stringify(miPrice))
    const timer = setTimeout(()=>{
      setRefresh(refresh + 1)
    },1000)
    return ()=>{clearTimeout(timer)}
  },[miPrice])

  useEffect(()=>{
    if(maPrice!='')
    sessionStorage.setItem('ssMaxPrice',JSON.stringify(maPrice))
    const timer = setTimeout(()=>{
      setRefresh(refresh + 1)
    },1000)
    return ()=>{clearTimeout(timer)}
  },[maPrice])
  
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div>
      <div >
        <span className='divSearchInput'>
          <input
            className='searchInput'
            placeholder='min price'
            type='text'
            defaultValue={JSON.parse(sessionStorage.getItem('ssMinPrice'))}
            value={miPrice}
            onChange={e=>setMiPrice(e.target.value.replace(/[^0-9]/,''))}
          />
        </span>
        -
        <span className='divSearchInput'>
          <input
            className='searchInput'
            placeholder='max price'
            type='text'
            defaultValue={JSON.parse(sessionStorage.getItem('ssMaxPrice'))}
            value={maPrice}
            onChange={e=>setMaPrice(e.target.value.replace(/[^0-9]/,""))}
          />
        </span>
      </div>
    </div>
  );
}

export default Filter;