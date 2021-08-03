import React from 'react'
import { Link } from 'react-router-dom'
import { ICart, IOrderedProds } from '../type'

interface IProps {
  products?: IOrderedProds[]
  cartProds?: ICart[]
}

const OrderItemsInfo = ({ products, cartProds }: IProps) => {
  const prods = products && products.length > 0 ? products : cartProds
  const type = products && products.length > 0 ? true : false // true for products and false for cartProds

  return (
    <ul className='orderinfo-items'>
      {prods &&
        prods.map((prod: any, idx: number) => (
          <li key={idx} className='orderinfo-item'>
            <div className='orderinfo-item__imgwrapper'>
              <img
                src={`/images/${type ? prod.prod_image : prod.image}`}
                alt={type ? prod.prod_name : prod.name}
              />
            </div>

            <div>
              <Link to={`/product/${type ? prod.id : prod.productId}`}>
                {type ? prod.prod_name : prod.name}
              </Link>
            </div>

            <div>Quantity: {type ? prod.prod_qty : prod.qty}</div>
            <div>Price: {type ? prod.prod_price : prod.price}</div>
            <div>
              Total Price:{' '}
              {type ? prod.prod_price * prod.prod_qty : prod.price * prod.qty}
            </div>
          </li>
        ))}
    </ul>
  )
}

export default OrderItemsInfo
