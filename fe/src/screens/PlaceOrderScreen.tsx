import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { createOrder, createOrderedProds } from '../actions/orderActions'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { ICart, IPaymentMethod, IShippingAddress } from '../type'

interface IOrderSt {
  loading: boolean
  success: boolean
  error: string
  order: {
    ok: boolean
    message: string
    data: { order_id: number }
    // error: string
    // errors: string[]
  }
}

interface HistoryParams {}

interface ICartItems {
  cartItems: ICart[]
  shippingAddress: IShippingAddress
  paymentMethod: IPaymentMethod
}

const PlaceOrderScreen = () => {
  const dispatch = useDispatch()
  const history = useHistory<HistoryParams>()

  const cart = useSelector((state: { cart: ICartItems }) => state.cart)

  // Calcs
  // const addDecimals = (num: number) => (Math.round(num * 100) / 100).toFixed(2)

  const itemsPrice = cart.cartItems.reduce(
      (acc: number, curItem: ICart) => acc + curItem.price * curItem.qty,
      0
    ),
    shippingPrice = itemsPrice > 100 ? 0 : 30,
    taxPrice = Number((0.15 * itemsPrice).toFixed(2)),
    totalPrice = itemsPrice + shippingPrice + taxPrice

  const orderCreate = useSelector(
    (state: { orderCreate: IOrderSt }) => state.orderCreate
  )
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      // that means we made an order
      cart.cartItems.forEach(async (item) => {
        dispatch(createOrderedProds(item.productId, order.data.order_id))
      })
      history.push(`/order/${order.data.order_id}`)
    }
  }, [dispatch, history, success, cart.cartItems, order.data.order_id])

  const placeOrderHandler = () => {
    if (cart.cartItems.length === 0) {
      return
    }

    dispatch(
      createOrder({
        postalCode: cart.shippingAddress.postalCode,
        address: cart.shippingAddress.address,
        country: cart.shippingAddress.country,
        city: cart.shippingAddress.city,
        paymentMethod: cart.paymentMethod,
        totalPrice: totalPrice,
      })
    )
  }

  return (
    <div className='container'>
      <CheckoutSteps step1 step2 step3 step4 />
      {/*LEFT COL*/}
      <div>
        <ul>
          <li>
            <h2>Shipping</h2>
            <p>
              <strong>Address: </strong>
              {cart.shippingAddress.postalCode},{cart.shippingAddress.address},
              {cart.shippingAddress.country},{cart.shippingAddress.city}
            </p>
          </li>

          <li>
            <h2>Payment Method</h2>
            <strong>Method: </strong>
            {cart.paymentMethod}
          </li>

          <li>
            <h2>Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message info='Your cart is empty' />
            ) : (
              <ul>
                {cart.cartItems.map((item, idx) => (
                  <li key={idx}>
                    <div>
                      {/* TEMP using height */}
                      <img
                        height='150px'
                        src={`/images/${item.image}`}
                        alt={item.name}
                      />
                    </div>

                    <div>
                      {/* TEMP item.product is the id ... change to product_id */}
                      <Link to={`/product/${item.productId}`}>{item.name}</Link>
                    </div>

                    <div>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/*RIGHT COL*/}
      <div>
        <div>
          <ul>
            <li>
              <h2>Order Summary</h2>
            </li>

            <li>
              <div>Items</div>
              <div>${itemsPrice}</div>
            </li>

            <li>
              <div>Shipping</div>
              <div>${shippingPrice}</div>
            </li>

            <li>
              <div>Tax</div>
              <div>${taxPrice}</div>
            </li>

            <li>
              <div>Total</div>
              <div>${totalPrice}</div>
            </li>

            <li>{error && <Message error={error} />}</li>

            <li>
              <button
                className='btn'
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderScreen
