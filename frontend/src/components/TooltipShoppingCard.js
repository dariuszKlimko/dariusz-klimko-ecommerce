import React from 'react'


const TooltipShoppingCard = (props) => {
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  return (
    <div style={{ maxHeight:'60vh', overflow:'auto'}}>
      {(props.shoppingCard===null||props.shoppingCard.length===0)?'No items':props.shoppingCard.map(x=><div style={{fontSize:'1vw'}} key={x._id}>
        <img style={{verticalAlign:'middle'}} src={x.productImg} alt='shoppingCard' width='60' height='38'/>
        &nbsp;&nbsp;
        <span>{x.productTitle}</span>
        &nbsp;&nbsp;
        <span>{x.productQuantity}pcs</span>
        &nbsp;&nbsp;
        <span>{x.productPrice} pln/szt</span>
        <hr/>
      </div>)}
    </div>
  );
}

export default TooltipShoppingCard;