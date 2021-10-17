import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { adminListOrders } from '../actions/orderActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Pagination from '../components/Pagination'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import { IOrderDetails, IOrderListRdx, IUserLoginRdx } from '../type'

interface HistoryParams {}

const AdminOrderListScreen = () => {
  const history = useHistory<HistoryParams>()
  const dispatch = useDispatch()
  const limit = 10

  const [page, setPage] = useState(0)

  const adminOrderList = useSelector(
    (state: { adminOrderList: IOrderListRdx }) => state.adminOrderList
  )

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  useEffect(() => {
    if (
      (userLogin.userInfo &&
        userLogin.userInfo.user.role === UserRole.NORMAL) ||
      !userLogin.userInfo
    )
      history.push('/')
    else dispatch(adminListOrders({ limit: limit, offset: page * limit }))
  }, [dispatch, history, userLogin.userInfo, page])

  const handlePageClick = (pg: number) => {
    console.log(pg)

    setPage(Number(pg))
  }

  return (
    <div className='container'>
      <div className='prof--sep u-my-s'>
        <SideNav
          isAdmin={
            userLogin.userInfo &&
            userLogin.userInfo.user.role !== UserRole.NORMAL
          }
        />

        <div className='prof--sep--r'>
          <h1 className='u-txt-center u-my-s'>Users</h1>
          {adminOrderList.loading ? (
            <Loader />
          ) : adminOrderList.error ? (
            <Message error={adminOrderList.error} />
          ) : (
            adminOrderList.result &&
            adminOrderList.result.orders.length && (
              <table className='orderstable'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {adminOrderList.result.orders.map((order: IOrderDetails) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.user_id}</td>
                      <td>{order.created_at}</td>
                      <td>{order.total_price}</td>
                      <td>{order.is_paid ? 'Paid' : 'Not Paid'}</td>
                      <td>
                        {order.is_delivered ? 'Delivered' : 'Not Delivered'}
                      </td>
                      <td>
                        <Link
                          to={`/order/${order.id}`}
                          className='u-mx-ss u-mk-cursor-ptr'
                        >
                          <i className='fas fa-edit'></i>
                        </Link>
                        <button
                          className='u-mx-ss u-mk-cursor-ptr'
                          onClick={() => console.log('delete order')}
                        >
                          <i className='fas fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          <div className='u-pagination-bar'>
            {adminOrderList.result &&
              adminOrderList.result.data &&
              adminOrderList.result.data.admin_total_orders > 0 && (
                <Pagination
                  page={page}
                  limit={limit}
                  total_prods={adminOrderList.result.data.admin_total_orders}
                  handlePageClick={handlePageClick}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderListScreen
