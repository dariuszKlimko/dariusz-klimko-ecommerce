import React, { useContext } from 'react'
import '../App.css'
import CompanyDataContext from '../contexts/CompanyDataContext';

const Footer = () => {

  const [companyData, setCompanyData] = useContext(CompanyDataContext)

// ------------------------------------------------------------------------------------------   
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div  className="footer">
       <div style={{padding: '7px'}}>
        <div><b>{companyData&&companyData[0].logo}</b></div>
        <div>{companyData&&companyData[0].streetAndNumber}</div>
        <div>{companyData&&companyData[0].postCodeAndCity}</div>
        <br/>
        <div>{companyData&&companyData[0].tel}</div>
        <div>{companyData&&companyData[0].email}</div>
      </div>
    </div>
  );
}

export default Footer;