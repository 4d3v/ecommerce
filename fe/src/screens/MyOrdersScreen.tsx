import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { listMyOrders } from '../actions/orderActions'
import Loader from '../components/Loader'
import MainSideNav from '../components/MainSideNav'
import Message from '../components/Message'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import { IMainNavProps, IOrderDetails, IUserLoginRdx } from '../type'

const MyOrdersScreen = ({ leftNavToggled, leftNavDefVis }: IMainNavProps) => {
  const dispatch = useDispatch()

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  const orderListUser = useSelector(
    (state: { orderListUser: any }) => state.orderListUser
  )

  useEffect(() => {
    dispatch(listMyOrders())
  }, [dispatch])

  return (
    <div className='_mctt02'>
      <MainSideNav
        leftNavToggled={leftNavToggled}
        leftNavDefVis={leftNavDefVis}
      />

      <div className='prof--sep'>
        <SideNav
          isAdmin={
            userLogin.userInfo &&
            userLogin.userInfo.user.role !== UserRole.NORMAL
          }
        />

        <div className='prof--sep--r'>
          <h2 className='u-txt-center u-my-s'>MY ORDERS</h2>
          {orderListUser.loading ? (
            <Loader />
          ) : orderListUser.error ? (
            <Message error={orderListUser.error} />
          ) : (
            orderListUser.result &&
            orderListUser.result.orders.length && (
              <table className='orderstable'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orderListUser.result.orders.map((order: IOrderDetails) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.created_at}</td>
                      <td>{order.total_price}</td>
                      <td>{order.is_paid ? order.paid_at : 'Not paid'}</td>
                      <td>
                        {order.is_delivered
                          ? order.delivered_at
                          : 'Not delivered'}
                      </td>
                      <td>
                        <Link
                          to={`/order/${order.id}`}
                          className='btn u-txt-center'
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrdersScreen
