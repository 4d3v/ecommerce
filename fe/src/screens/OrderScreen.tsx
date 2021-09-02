import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import {
  adminGetOrderDetails,
  adminGetOrderedProds,
  adminSetOrderAsDelivered,
  getOrderDetails,
  getOrderedProds,
  payOrder,
} from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  IAdminOrderDeliverRdx,
  IOrderDetailsRdx,
  IOrderedProdsRdx,
  IOrderPayRdx,
  IUserInfoRdx,
  IUserLoginRdx,
} from '../type'
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
import Alert from '../components/Alert'
import { UserRole } from '../enums'

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

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  const adminOrderDeliver = useSelector(
    (state: { adminOrderDeliver: IAdminOrderDeliverRdx }) =>
      state.adminOrderDeliver
  )

  const [payerName, setPayerName] = useState<string>('')
  const [transactionCompleted, setTransactionCompleted] =
    useState<boolean>(false)

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
      (orderPay && orderPay.success) ||
      (adminOrderDeliver &&
        adminOrderDeliver.result &&
        adminOrderDeliver.result.ok)
    ) {
      dispatch({ type: orderActions.ORDER_PAY_RESET })
      dispatch({ type: orderActions.ORDER_DELIVER_RESET })

      if (
        userLogin.userInfo &&
        userLogin.userInfo.user.role !== UserRole.NORMAL
      ) {
        dispatch(adminGetOrderDetails(Number(params.orderid)))
        dispatch(adminGetOrderedProds(Number(params.orderid)))
      } else {
        dispatch(getOrderDetails(Number(params.orderid)))
        dispatch(getOrderedProds(Number(params.orderid)))
      }
    }
  }, [
    dispatch,
    history,
    params.orderid,
    orderDetails,
    orderPay,
    userLogin.userInfo,
    adminOrderDeliver,
  ])

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
      const onApproval = () => {
        return new Promise((resolve, reject) => {
          dispatch(
            payOrder(orderDetails.orderItem.id, {
              paymentResultId: details.id,
              paymentResultStatus: details.status,
              paymentResultEmailAddress: details.payer.email_address,
              paymentResultUpdateTime: details.update_time,
            })
          )

          resolve('Transaction completed by ' + details.payer.name.given_name)

          if (orderDetails && orderDetails.error) reject(orderDetails.error)
        })
      }

      onApproval()
        .then((data) => {
          console.log(data)
          setPayerName(details.payer.name.given_name)
          setTransactionCompleted(true)
          setTimeout(() => {
            setTransactionCompleted(false)
            dispatch(getOrderDetails(Number(params.orderid)))
          }, 2000)
        })
        .catch((err) => console.error(err))
    })
  }

  const setOrderAsDelivered = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    dispatch(adminSetOrderAsDelivered(Number(params.orderid)))
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
                <strong>Name: {orderDetails.orderItem.user!.name}</strong>
              </div>
              <div>
                <strong>
                  <a href={`mailto:${orderDetails.orderItem.user!.email}`}>
                    Email: {orderDetails.orderItem.user!.email}
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

            {userLogin.userInfo &&
              userLogin.userInfo.user.role !== UserRole.NORMAL &&
              orderDetails.orderItem.is_paid &&
              !orderDetails.orderItem.is_delivered && (
                <div>
                  {adminOrderDeliver.loading && <Loader />}
                  <button
                    className='btn u-txt-center btn-set-delivered'
                    onClick={setOrderAsDelivered}
                  >
                    Mark As Delivered
                  </button>
                </div>
              )}
          </div>
        </div>

        {transactionCompleted && (
          <Alert type='success' msg={`Transaction completed by ${payerName}`} />
        )}
      </div>
    )
  )
}

export default OrderScreen
