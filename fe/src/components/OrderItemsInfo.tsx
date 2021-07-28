import React from 'react'
import { Link } from 'react-router-dom'
import { ICart, IOrderedProds } from '../type'
import Message from './Message'

interface IProps {
  products?: IOrderedProds[]
  cartProds?: ICart[]
}

const OrderItemsInfo = ({ products, cartProds }: IProps) => {
  return (
    <ul className='orderinfo-items'>
      {products && products.length > 0 ? (
        products.map((prod: any, idx: number) => (
          <li key={idx} className='orderinfo-item'>
            <div className='orderinfo-item__imgwrapper'>
              <img src={`/images/${prod.prod_image}`} alt={prod.prod_name} />
            </div>

            <div>
              <Link to={`/product/${prod.id}`}>
                {prod.prod_name} {prod.prod_brand}
              </Link>
            </div>

            <div>Quantity: {prod.prod_qty}</div>
            <div>Price: {prod.prod_price}</div>
            <div>Total Price: {prod.prod_price * prod.prod_qty}</div>
          </li>
        ))
      ) : cartProds && cartProds.length > 0 ? (
        <ul className='orderinfo-items'>
          {cartProds.map((prod, idx) => (
            <li key={idx} className='orderinfo-item'>
              <div className='orderinfo-item__imgwrapper'>
                <img src={`/images/${prod.image}`} alt={prod.name} />
              </div>

              <div>
                <Link to={`/product/${prod.productId}`}>{prod.name}</Link>
              </div>

              <div>Quantity: {prod.qty}</div>
              <div>Price: {prod.price}</div>
              <div>Total Price: {prod.price * prod.qty}</div>
            </li>
          ))}
        </ul>
      ) : (
        <Message info='Your cart is empty' />
      )}
    </ul>
  )
}

export default OrderItemsInfo
