import React, { useState, useEffect, useContext } from 'react'
import {useStripe, useElements, P24BankElement} from '@stripe/react-stripe-js'
import P24BankSection from './P24BankSection'
import axios from 'axios'

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function CheckoutForm(props ) {

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('')
  const [flag, setFlag] = useState(false)

// -----------------------------------------------------------------------------------------
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const dataToSend = {
      email: props.userData.email,
      name: props.userData.userName,
      adress: props.userData.adress,
      shipping: props.shippingMethodChoice,
      products: props.products
    }
    axios.post("/create-payment-intent", {dataToSend}, {cancelToken: source.token})
    .then(response => {
      setClientSecret(response.data.clientSecret);
      localStorage.setItem('lsOrdersCard_id',JSON.stringify(response.data.ordersCard_id))
    })
    // .catch(error=>console.log(error,'error'))
    .catch(error => {
      if (axios.isCancel(error)) {
        console.log('/create-payment-intent cleaned up');
      } else {
        console.log(error,'error')
      }
    })
  },[]);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    
    event.preventDefault();
    if(!stripe || !elements){
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    
    const p24Bank = elements.getElement(P24BankElement);
    // For brevity, this example is using uncontrolled components for
    // the accountholder's name. In a real world app you will
    // probably want to use controlled components.
    // https://reactjs.org/docs/uncontrolled-components.html
    // https://reactjs.org/docs/forms.html#controlled-components

    setFlag(true)
    const {error} = await stripe.confirmP24Payment(clientSecret, {
      payment_method: {
        p24: p24Bank,
        billing_details: {
          name: props.userData.userName,
          email: props.userData.email
        },
      },
      payment_method_options: {
        p24: {
          // In order to be able to pass the `tos_shown_and_accepted` parameter, you must
          // ensure that the P24 regulations and information obligation consent
          // text is clearly in the view of the customer. See
          // stripe.com/docs/payments/p24/accept-a-payment#requirements
          // for directions.
          tos_shown_and_accepted: true,
        }
      },
      return_url: `${process.env.REACT_APP_DOMIAN}/shoppingCard/`
      // return_url: 'http://localhost:3000/shoppingCard/'

    });
    if (error) {
      // Show error to your customer.
      setFlag(false)
      console.log(error.message);
    }
    // Otherwise the customer will be redirected away from your
    // page to complete the payment with their bank.
  };
  
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div>
      <form  onSubmit={handleSubmit}>
        <div >
          <P24BankSection />
        </div>
        <br/>
        <Button className='loginButton' variant='contained' type="submit" disabled={!stripe||flag}>
          Submit Payment
        </Button>
      </form>
      {flag&&<div className='pageNotFoundView'>
        <div style={{marginTop:'30px'}}><CircularProgress/><br/>loading...</div>
      </div>}
    </div>
  );
}