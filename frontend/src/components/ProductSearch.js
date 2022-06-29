import React,{ useContext } from 'react'
import CopyOfFilteredProductContext from '../contexts/CopyOfFilteredProductContext'
import ProductToDisplayContext from '../contexts/ProductToDisplayContext'


const ProductSearch = (props) => {

  const [productToDisplay, setProductToDisplay] = useContext(ProductToDisplayContext)
  const [copyOfFilteredProduct, setCopyOfFilteredProduct] = useContext(CopyOfFilteredProductContext)

// -------------------search-----------------------------------------------------------
  const productWithoutSpecialChar = (arg) =>{
    const newProductToDisplay = copyOfFilteredProduct&&copyOfFilteredProduct.filter(x=>{
      return new RegExp('\^'+arg.toLowerCase()).test(x.title.toLowerCase()) 
    })
    props.handleSearch(newProductToDisplay)
  }

  const setProductFunction = (x) =>{
    if(x===''){
      setProductToDisplay(copyOfFilteredProduct)
    } else{
    const newX = x.replace(/[^a-zA-Z0-9]/g, '')
      setProductToDisplay(copyOfFilteredProduct)
      productWithoutSpecialChar(newX)
    }
  }
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div>
      <div className='spanSearchProductInput'>
          <input
            className='searchProductInput'
            type='text'
            placeholder='search product...'
            onChange={(e)=>setProductFunction(e.target.value)}
          />
      </div>
    </div>
  );
}

export default ProductSearch;


