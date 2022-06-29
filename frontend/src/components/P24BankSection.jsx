import React from 'react'
import '../App.css'
import {P24BankElement} from '@stripe/react-stripe-js'
import '../P24BankSectionStyles.css'

const P24_ELEMENT_OPTIONS = {
  // Custom styling can be passed to options when creating an Element
  style: {
    base: {
      padding: '10px 12px',
      color: '#32325d',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      },
    },
  },
};

function P24BankSection() {
  return (
    <div>
      <h3>Paymant method</h3>
      <P24BankElement  options={P24_ELEMENT_OPTIONS} />
    </div>
  );
};

export default P24BankSection;