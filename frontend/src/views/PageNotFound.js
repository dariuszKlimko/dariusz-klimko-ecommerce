import React, { useState, useEffect, useContext } from 'react'
import '../App.css'
import SortIconVisibilityContext from '../contexts/SortIconVisibilityContext';
import CircularProgress from '@material-ui/core/CircularProgress';


const PageNotFound = () => {

  const [loading, setLoading] = useState(true)

  const [sortIconVisibility, setSortIconVisibility] = useContext(SortIconVisibilityContext)

// ------------------------------------------------------------------------------------------
  useEffect(()=>{
    setSortIconVisibility(false)
    const timer = setTimeout(()=>{
      setLoading(!loading)
    },4000)
    return ()=>clearTimeout(timer)
  },[])
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='pageNotFoundView'>
      {loading?(<div style={{marginTop:'30vh'}}><CircularProgress/><br/>loading...</div>):(<h1 style={{marginTop:'30vh'}}>404 Page Not Found</h1>)}
    </div>
  );
}

export default PageNotFound;