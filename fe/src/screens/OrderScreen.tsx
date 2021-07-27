import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  getOrderDetails,
  getOrderedProdsDetails,
} from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { IOrderDetailsRdx, IOrderedProdsRdx } from '../type'

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
  console.log(orderedProds) ///////////// TODO orderDetails should have username and email
  console.log(orderDetails) //////////// TODO check TODOs on the orderScreen page (/order/:orderid)

  // Calcs
  // const addDecimals = (num: number) => (Math.round(num * 100) / 100).toFixed(2)

  const itemsPrice = orderedProds.reduce(
      (acc: number, curItem: any) => acc + curItem.price * curItem.qty, // TODO add qty on create
      0
    ),
    shippingPrice = itemsPrice > 100 ? 0 : 30,
    taxPrice = Number((0.15 * itemsPrice).toFixed(2)),
    totalPrice = itemsPrice + shippingPrice + taxPrice

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
      <>
        <div className='container'>
          <h1>Order {orderItem.id}</h1>
          <ul>
            <li>
              <h2>Shipping</h2>
              <div>
                <strong>Name: {orderedProds[0].user_name}</strong>
              </div>
              <div>
                <strong>
                  <a href={`mailto:${orderedProds[0].user_email}`}>
                    Email: {orderedProds[0].user_email}
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
              {orderedProds.length === 0 ? (
                <Message info='Your cart is empty' />
              ) : (
                <ul>
                  {orderedProds.map((prod: any, idx: number) => (
                    <li key={idx}>
                      <div>
                        <img
                          height='150px'
                          src={`/images/${prod.prod_image}`}
                          alt={prod.prod_name}
                        />
                      </div>

                      <div>
                        {/* <Link to={`/product/${prod.productId}`}> */}
                        {prod.prod_name} {prod.prod_brand}
                        {/* </Link> */}
                      </div>

                      <div>
                        {prod.prod_price}, total_price: {orderItem.total_price}
                      </div>
                      <div style={{ color: '#ffff00' }}>
                        <p>TODO Qty: TODO add qty on create for orderedProds</p>
                        <p>
                          TODO Price: TODO remove price from orderedProds cos we
                          have this data on orderItem.total_price
                        </p>
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
            </ul>
          </div>
        </div>
      </>
    )
  )
}

export default OrderScreen
