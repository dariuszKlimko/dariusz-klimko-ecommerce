import React from 'react'
import '../App.css'
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import CheckoutForm from "../components/CheckoutForm"

const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_KEY_STRIPE, {
  stripeAccount: process.env.REACT_APP_CONNECTED_STRIPE_ACCOUNT_ID
});


const FinalShoppingCardComponent = (props) => {
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div className='shoppingCardResponsive'>
      <div className='shoppingCardResponsiveDiv1' >
        {props.shoppingCard&&props.shoppingCard.map(x=>
          <ul style={{padding:'0', listStyleType:'none', overflowX:'auto', whiteSpace:'nowrap'}} key={x._id}>
          <div style={{ display:'flex', alignItems:'center', overflowX:'auto'}}>
            <span><img  src={x.productImg} alt='shoppingCard' width='60' height='38'/></span>
              &nbsp;&nbsp;
              <span>{x.productTitle}</span>
              &nbsp;&nbsp;
              <span>{x.productQuantity}pcs</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
            <span>{x.productPrice} pln/szt</span>
          </div>
          <hr/>
          </ul>
        )}
      </div>
      <div className='shoppingCardResponsiveDiv2'>
      <div>
          <h4>email: {props.userData.email}</h4>
          <h4>name: {props.userData.userName}</h4>
          <h4>adress: {props.userData.adress}</h4>
        </div>
        <h4>Products price: {props.productsPrice} pln</h4>
        <h4>Shipping method: {props.shippingMethodChoice.shippingMethod}&nbsp;&nbsp;{props.shippingMethodChoice.shippingPrice}&nbsp;pln</h4>
        <h2>Total price: {props.totalPrice}&nbsp;pln</h2>
      <br/>
        {!props.showFlag&&<div className='stripeElements'>
          <Elements  stripe={stripePromise}>
            <CheckoutForm 
              shippingMethodChoice={props.shippingMethodChoice}
              products={props.products}
              userData={props.userData}
            />
          </Elements>
        </div>}
        <br/>
        <br/>
      </div>
    </div>
  );
}

export default FinalShoppingCardComponent;