import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { deleteUser, listUsers } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Pagination from '../components/Pagination'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import { IUser, IUserDeleteRdx, IUserListRdx, IUserLoginRdx } from '../type'

interface HistoryParams {}

const AdminUserListScreen = () => {
  const history = useHistory<HistoryParams>()
  const dispatch = useDispatch()
  const limit = 10

  const [page, setPage] = useState(0)

  const userList = useSelector(
    (state: { userList: IUserListRdx }) => state.userList
  )
  console.log(userList)

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  const userDelete = useSelector(
    (state: { userDelete: IUserDeleteRdx }) => state.userDelete
  )

  useEffect(() => {
    if (
      (userLogin.userInfo &&
        userLogin.userInfo.user.role === UserRole.NORMAL) ||
      !userLogin.userInfo
    )
      history.push('/')
    else dispatch(listUsers({ limit: limit, offset: page * limit }))
  }, [dispatch, history, userLogin.userInfo, userDelete.success, page])

  const deleteUserHandler = (userId: number) => {
    // TEMP temporarily using window.confirm
    if (window.confirm('Are you sure')) dispatch(deleteUser(userId))
  }

  const handlePageClick = (pg: number) => {
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
          {userList.loading ? (
            <Loader />
          ) : userList.error && !userList.error.ok ? (
            <Message error={userList.error.errorMsg} />
          ) : (
            userList.result &&
            userList.result.users.length && (
              <>
                <table className='orderstable'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>ADMIN</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {userList.result.users.map((user: IUser) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>
                          <a href={`mailto:${user.email}`}>{user.email}</a>
                        </td>
                        <td>
                          {user.role === UserRole.OWNER ||
                          user.role === UserRole.ADMIN
                            ? 'Yes'
                            : 'No'}
                        </td>
                        <td>
                          <Link
                            to={`/admin/user/${user.id}`}
                            className='u-mx-ss u-mk-cursor-ptr'
                          >
                            <i className='fas fa-edit'></i>
                          </Link>
                          <button
                            className='u-mx-ss u-mk-cursor-ptr'
                            onClick={() => deleteUserHandler(user.id)}
                          >
                            <i className='fas fa-trash'></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className='u-pagination-bar'>
                  {userList.result.data.total_users > 0 && (
                    <Pagination
                      page={page}
                      limit={limit}
                      total_prods={userList.result.data.total_users}
                      handlePageClick={handlePageClick}
                    />
                  )}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUserListScreen
