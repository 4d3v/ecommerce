import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {
  getOrderDetails,
  getOrderedProdsDetails,
} from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { IOrderDetailsRdx, IOrderedProds, IOrderedProdsRdx } from '../type'
import OrderSummary from '../components/OrderSummary'
import OrderItemsInfo from '../components/OrderItemsInfo'

interface RouteParams {
  orderid: string
}

const OrderScreen = () => {
  const dispatch = useDispatch()
  const params = useParams<RouteParams>()

  const orderDetails = useSelector(
    (state: { orderDetails: IOrderDetailsRdx }) => state.orderDetails
  )
  const { orderItem, loading, error } = orderDetails

  const orderedProdsDetails = useSelector(
    (state: { orderedProdsDetails: IOrderedProdsRdx }) =>
      state.orderedProdsDetails
  )
  const { orderedProds } = orderedProdsDetails
  console.log(orderDetails) //////////// TODO change IOrderDetailsRdx interface from any to proper typings

  useEffect(() => {
    dispatch(getOrderDetails(Number(params.orderid)))
    dispatch(getOrderedProdsDetails(Number(params.orderid)))
  }, [dispatch, params.orderid])

  return loading ? (
    <Loader />
  ) : error ? (
    <Message error={error} />
  ) : (
    !loading &&
    !orderedProdsDetails.loading &&
    orderItem && (
      <div className='container'>
        <div className='order-wrapper u-my-s'>
          <ul className='order-info'>
            <h1>Order {orderItem.id}</h1>
            <li>
              <h2>Shipping</h2>
              <div>
                <strong>Name: {orderItem.user.Name}</strong>
              </div>
              <div>
                <strong>
                  <a href={`mailto:${orderItem.user.Email}`}>
                    Email: {orderItem.user.Email}
                  </a>
                </strong>
              </div>
              <div>
                <strong>Address: </strong>
                {orderItem.postalCode}, {orderItem.address}, {orderItem.country}
                , {orderItem.city}
              </div>
              <div>
                {orderItem.is_delivered ? (
                  <Message info={`delivered on ${orderItem.delivered_at}`} />
                ) : (
                  <Message info={`Not delivered`} />
                )}
              </div>
            </li>

            <li>
              <h2>Payment Method</h2>
              <div>
                <strong>Method: </strong>
                {orderItem.payment_method}
              </div>
              <div>
                {orderItem.is_paid ? (
                  <Message info={`paid on ${orderItem.paid_at}`} />
                ) : (
                  <Message info={`Not paid`} />
                )}
              </div>
            </li>

            <li>
              <h2>Order Items</h2>
              <OrderItemsInfo products={orderedProds} />
            </li>
          </ul>

          {/* RIGHT COL */}
          <OrderSummary orderedProds={orderedProds} />
        </div>
      </div>
    )
  )
}

export default OrderScreen
