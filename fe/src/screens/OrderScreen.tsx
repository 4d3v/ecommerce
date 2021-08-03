import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  getOrderDetails,
  getOrderedProdsDetails,
  payOrder,
} from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { IOrderDetailsRdx, IOrderedProdsRdx, IOrderPayRdx } from '../type'
import OrderSummary from '../components/OrderSummary'
import OrderItemsInfo from '../components/OrderItemsInfo'
import { BASE_URL } from '../constants/endPoints'
import { useState } from 'react'
import { orderActions } from '../constants/orderConstants'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import {
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
  UnknownObject,
} from '@paypal/paypal-js/types/components/buttons'

interface RouteParams {
  orderid: string
}

const OrderScreen = () => {
  const [paypalClientId, setPaypalClientId] = useState('NOT_SET')

  const dispatch = useDispatch()
  const params = useParams<RouteParams>()

  const orderDetails = useSelector(
      (state: { orderDetails: IOrderDetailsRdx }) => state.orderDetails
    ),
    { orderItem, loading, error } = orderDetails

  const orderedProdsDetails = useSelector(
      (state: { orderedProdsDetails: IOrderedProdsRdx }) =>
        state.orderedProdsDetails
    ),
    { orderedProds } = orderedProdsDetails

  const orderPay = useSelector(
    (state: { orderPay: IOrderPayRdx }) => state.orderPay
  ) // , { loading: loadingPaypal, success: successPaypal } = orderPay // renaming properties...

  const initialPaypalOptions = {
    'client-id': paypalClientId,
    currency: 'USD',
    intent: 'capture',
    // 'data-client-token': 'abc123xyz==',
  }

  useEffect(() => {
    const getPaypalClientId = async () => {
      const {
        data: {
          data: { paypal_client_id },
        },
      } = await axios.get(`${BASE_URL}/config/paypal`)

      setPaypalClientId(paypal_client_id)
    }

    if (paypalClientId === 'NOT_SET') getPaypalClientId()

    // if (!orderItem || orderItem.id !== params.orderid) {
    if (!orderItem || (orderPay && orderPay.success)) {
      dispatch({ type: orderActions.ORDER_PAY_RESET })
      dispatch(getOrderDetails(Number(params.orderid)))
      dispatch(getOrderedProdsDetails(Number(params.orderid)))
    }
  }, [dispatch, params.orderid, orderItem, orderPay, paypalClientId])

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
          <div className='order-summary'>
            <OrderSummary orderedProds={orderedProds} />
            {!orderItem.is_paid && (
              <div className='u-my-ss'>
                {orderPay && orderPay.loading && <Loader />}
                {/* {!paypalSdkReady ? (
                  <Loader />
                ) : (
                  <PayPalScriptProvider options={{ 'client-id': 'test' }}>
                    <PayPalButtons />
                  </PayPalScriptProvider>
                )} */}
                <PayPalScriptProvider options={initialPaypalOptions}>
                  <PayPalButtons
                    createOrder={(
                      data: UnknownObject,
                      actions: CreateOrderActions
                    ) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: orderItem.total_price,
                            },
                          },
                        ],
                      })
                    }}
                    onApprove={async (
                      data: OnApproveData,
                      actions: OnApproveActions
                    ) => {
                      console.log(data)
                      return actions.order.capture().then(function (details) {
                        // This function shows a transaction success message to your buyer.
                        console.log(details)

                        dispatch(
                          payOrder(orderItem.id, {
                            paymentResultId: details.id,
                            paymentResultStatus: details.status,
                            paymentResultEmailAddress:
                              details.payer.email_address,
                            paymentResultUpdateTime: details.update_time,
                          })
                        )

                        alert(
                          'Transaction completed by ' +
                            details.payer.name.given_name
                        )
                      })
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default OrderScreen
