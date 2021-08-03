import React from 'react'
import { IOrderedProds } from '../type'

interface IProps {
  orderedProds?: IOrderedProds[] | null
  cartItemsPrice?: number | null
}

const OrderSummary = ({
  orderedProds = null,
  cartItemsPrice = null,
}: IProps) => {
  // Calcs
  // const addDecimals = (num: number) => (Math.round(num * 100) / 100).toFixed(2)

  let itemsPrice = 0
  if (orderedProds) {
    itemsPrice = orderedProds.reduce(
      (acc: number, orderedProd: IOrderedProds) =>
        acc + orderedProd.prod_price * orderedProd.prod_qty,
      0
    )
  } else if (cartItemsPrice) {
    itemsPrice = cartItemsPrice
  }
  const shippingPrice = itemsPrice > 100 ? 0 : 30,
    taxPrice = Number((0.15 * itemsPrice).toFixed(2)),
    totalPrice = itemsPrice + shippingPrice + taxPrice

  return (
    <ul className='order-summary__wrapper'>
      <li>
        <h2>Order Summary</h2>
      </li>

      <li>
        <div>Items ${itemsPrice}</div>
      </li>

      <li>
        <div>Shipping ${shippingPrice}</div>
      </li>

      <li>
        <div>Tax ${taxPrice}</div>
      </li>

      <li>
        <div>Total ${totalPrice}</div>
      </li>
    </ul>
  )
}

export default OrderSummary
