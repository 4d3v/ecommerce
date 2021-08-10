import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import {
  getOrderDetails,
  getOrderedProds,
  payOrder,
} from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { IOrderDetailsRdx, IOrderedProdsRdx, IOrderPayRdx } from '../type'
import OrderSummary from '../components/OrderSummary'
import OrderItemsInfo from '../components/OrderItemsInfo'
import { orderActions } from '../constants/orderConstants'
import { PayPalButtons } from '@paypal/react-paypal-js'
import {
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
  UnknownObject,
} from '@paypal/paypal-js/types/components/buttons'

interface HistoryParams {}

interface RouteParams {
  orderid: string
}

const strconvPayMethod = new Map<number, string>([
  [1, 'paypal'],
  [2, 'stripe'],
])

const OrderScreen = () => {
  const dispatch = useDispatch()
  const params = useParams<RouteParams>()
  const history = useHistory<HistoryParams>()

  const orderDetails = useSelector(
    (state: { orderDetails: IOrderDetailsRdx }) => state.orderDetails
  )

  const orderedProdsList = useSelector(
      (state: { orderedProdsList: IOrderedProdsRdx }) => state.orderedProdsList
    ),
    { orderedProds } = orderedProdsList

  const orderPay = useSelector(
    (state: { orderPay: IOrderPayRdx }) => state.orderPay
  ) // , { loading: loadingPaypal, success: successPaypal } = orderPay // renaming properties...

  useEffect(() => {
    if (
      orderDetails &&
      orderDetails.error &&
      !orderDetails.error.ok &&
      orderDetails.error.errorMsg ===
        'Unauthenticated! http: named cookie not present'
    )
      history.push('/login')

    if (
      !orderDetails ||
      !orderDetails.orderItem ||
      (orderDetails.orderItem &&
        orderDetails.orderItem.id > 0 &&
        orderDetails.orderItem.id !== Number(params.orderid)) ||
      (orderPay && orderPay.success)
    ) {
      dispatch({ type: orderActions.ORDER_PAY_RESET })
      dispatch(getOrderDetails(Number(params.orderid)))
      dispatch(getOrderedProds(Number(params.orderid)))
    }
  }, [dispatch, history, params.orderid, orderDetails, orderPay])

  const paypalCreateOrder = (
    data: UnknownObject,
    actions: CreateOrderActions
  ) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: orderDetails.orderItem.total_price,
          },
        },
      ],
    })
  }

  const paypalOnApproveOrder = (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    return actions.order.capture().then(function (details) {
      // This function shows a transaction success message to your buyer.
      dispatch(
        payOrder(orderDetails.orderItem.id, {
          paymentResultId: details.id,
          paymentResultStatus: details.status,
          paymentResultEmailAddress: details.payer.email_address,
          paymentResultUpdateTime: details.update_time,
        })
      )

      console.log('Transaction completed by ' + details.payer.name.given_name)
      // if (details.status === 'COMPLETED')
      //   history.push(`/order/${orderDetails.orderItem.id}`)
    })
  }

  return orderDetails && orderDetails.loading ? (
    <Loader />
  ) : orderDetails && orderDetails.error ? (
    <Message error={orderDetails.error.errorMsg} />
  ) : (
    orderDetails &&
    orderDetails.orderItem && (
      <div className='container'>
        <div className='order-wrapper u-my-s'>
          <ul className='order-info'>
            <h1>Order {orderDetails.orderItem.id}</h1>
            <li>
              <h2>Shipping</h2>
              <div>
                <strong>Name: {orderDetails.orderItem.user.name}</strong>
              </div>
              <div>
                <strong>
                  <a href={`mailto:${orderDetails.orderItem.user.email}`}>
                    Email: {orderDetails.orderItem.user.email}
                  </a>
                </strong>
              </div>
              <div>
                <strong>Address: </strong>
                {orderDetails.orderItem.postal_code},{' '}
                {orderDetails.orderItem.address},{' '}
                {orderDetails.orderItem.country}, {orderDetails.orderItem.city}
              </div>
              <div>
                {orderDetails.orderItem.is_delivered ? (
                  <Message
                    info={`delivered on ${orderDetails.orderItem.delivered_at}`}
                  />
                ) : (
                  <Message info={`Not delivered`} />
                )}
              </div>
            </li>

            <li>
              <h2>Payment Method</h2>
              <div>
                <strong>Method: </strong>
                {strconvPayMethod.get(orderDetails.orderItem.payment_method)}
              </div>
              <div>
                {orderDetails.orderItem.is_paid ? (
                  <Message info={`paid on ${orderDetails.orderItem.paid_at}`} />
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

          <div className='order-summary'>
            <OrderSummary orderedProds={orderedProds} />
            {!orderDetails.orderItem.is_paid && (
              <div className='u-my-ss'>
                {orderPay && orderPay.loading && <Loader />}
                {true && (
                  <PayPalButtons
                    createOrder={(
                      data: UnknownObject,
                      actions: CreateOrderActions
                    ) => paypalCreateOrder(data, actions)}
                    onApprove={(
                      data: OnApproveData,
                      actions: OnApproveActions
                    ) => paypalOnApproveOrder(data, actions)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default OrderScreen
