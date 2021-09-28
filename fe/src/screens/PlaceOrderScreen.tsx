import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { removeAllFromCart } from '../actions/cartActions'
import { createOrder, createOrderedProds } from '../actions/orderActions'
import CheckoutSteps from '../components/CheckoutSteps'
import MainSideNav from '../components/MainSideNav'
import Message from '../components/Message'
import OrderItemsInfo from '../components/OrderItemsInfo'
import OrderSummary from '../components/OrderSummary'
import { orderActions } from '../constants/orderConstants'
import { ICart, ICartItemsRdx, IMainNavProps, IOrderCreateRdx } from '../type'

interface HistoryParams {}

let orderedProdsCreated = 0

const PlaceOrderScreen = ({ leftNavToggled, leftNavDefVis }: IMainNavProps) => {
  const dispatch = useDispatch()
  const history = useHistory<HistoryParams>()

  const cart = useSelector((state: { cart: ICartItemsRdx }) => state.cart)

  const orderCreate = useSelector(
    (state: { orderCreate: IOrderCreateRdx }) => state.orderCreate
  )
  // const { order, success, error } = orderCreate

  // const orderedProdsCreate = useSelector(
  //   (state: any) => state.orderedProdsCreate
  // )

  const itemsPrice = cart.cartItems.reduce(
      (acc: number, curItem: ICart) => acc + curItem.price * curItem.qty,
      0
    ),
    shippingPrice = itemsPrice > 100 ? 0 : 30,
    taxPrice = Number((0.15 * itemsPrice).toFixed(2)),
    totalPrice = itemsPrice + shippingPrice + taxPrice

  useEffect(() => {
    // If order is created with success
    if (orderCreate && orderCreate.result && orderCreate.result.ok) {
      const orderCreatedId = orderCreate.result.data.order_id

      const createOrdProds = async () => {
        await Promise.all(
          cart.cartItems.map(async (item: ICart) => {
            dispatch(
              createOrderedProds(item.productId, orderCreatedId, item.qty)
            )
            orderedProdsCreated++
          })
        )
      }
      createOrdProds()

      dispatch({ type: orderActions.ORDER_DETAILS_RESET })
      dispatch({ type: orderActions.ORDER_CREATE_RESET })

      if (orderedProdsCreated === cart.cartItems.length) {
        orderedProdsCreated = 0
        dispatch(removeAllFromCart())
        history.push(`/order/${orderCreatedId}`)
      }
    }
  }, [dispatch, history, cart.cartItems, orderCreate])

  const placeOrderHandler = () => {
    if (cart.cartItems.length === 0) {
      return
    }

    dispatch(
      createOrder({
        postal_code: cart.shippingAddress.postal_code,
        address: cart.shippingAddress.address,
        country: cart.shippingAddress.country,
        city: cart.shippingAddress.city,
        payment_method: cart.paymentMethod,
        total_price: totalPrice,
      })
    )
  }

  return orderCreate && orderCreate.error ? (
    <Message error={orderCreate.error} />
  ) : (
    <div className='_mctt02'>
      <MainSideNav
        leftNavToggled={leftNavToggled}
        leftNavDefVis={leftNavDefVis}
      />

      <div>
        <div className='content-title dki02'>
          <h2 className='u-txt-center'>Place Order</h2>
        </div>

        <CheckoutSteps step1 step2 step3 step4 />

        {/*LEFT COL*/}
        <div className='placeorder-wrapper'>
          <ul className='placeorder-info'>
            <li>
              <h2>Shipping</h2>
              <div>
                <p>
                  <strong>Address: </strong>
                  {cart.shippingAddress.address}
                </p>
                <p>
                  <strong>PostalCode: </strong>
                  {cart.shippingAddress.postal_code}
                </p>
                <p>
                  <strong>Country: </strong>
                  {cart.shippingAddress.country}
                </p>
                <p>
                  <strong>City: </strong>
                  {cart.shippingAddress.city}
                </p>
              </div>
            </li>

            <li className='u-my-ss'>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </li>

            <li className='u-my-ss'>
              <h2>Order Items</h2>
              <OrderItemsInfo cartProds={cart.cartItems} />
            </li>

            <li className='u-my-ss'>
              <button
                className='btn'
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </button>
            </li>
          </ul>

          {/* RIGHT COL */}
          <OrderSummary cartItemsPrice={itemsPrice} />
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderScreen
