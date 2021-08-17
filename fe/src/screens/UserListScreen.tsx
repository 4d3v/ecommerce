import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { deleteUser, listUsers } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import { IUser, IUserDeleteRdx, IUserInfoRdx, IUserListRdx } from '../type'

interface HistoryParams {}

const UserListScreen = () => {
  const history = useHistory<HistoryParams>()
  const dispatch = useDispatch()

  const userList = useSelector(
    (state: { userList: IUserListRdx }) => state.userList
  )

  const userLogin = useSelector(
    (state: { userLogin: IUserInfoRdx }) => state.userLogin
  )

  const userDelete = useSelector(
    (state: { userDelete: IUserDeleteRdx }) => state.userDelete
  )

  useEffect(() => {
    if (
      (userLogin.userInfo && userLogin.userInfo.role === UserRole.NORMAL) ||
      !userLogin.userInfo
    )
      history.push('/')
    else dispatch(listUsers())
  }, [dispatch, history, userLogin.userInfo, userDelete.success])

  const deleteUserHandler = (userId: number) => {
    // TEMP temporarily using window.confirm
    if (window.confirm('Are you sure')) dispatch(deleteUser(userId))
  }

  return (
    <div className='container'>
      <div className='prof--sep u-my-s'>
        <SideNav
          isAdmin={
            userLogin.userInfo && userLogin.userInfo.role !== UserRole.NORMAL
          }
        />

        <div className='prof--sep--r'>
          <h1 className='u-txt-center u-my-s'>Users</h1>
          {userList.loading ? (
            <Loader />
          ) : userList.error && !userList.error.ok ? (
            <Message error={userList.error.errorMsg} />
          ) : (
            userList.users && (
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
                  {userList.users.map((user: IUser) => (
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
                        <Link to={`/admin/user/${user.id}`} className='u-mx-ss'>
                          <i className='fas fa-edit'></i>
                        </Link>
                        <button
                          className='u-mx-ss'
                          onClick={() => deleteUserHandler(user.id)}
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
        </div>
      </div>
    </div>
  )
}

export default UserListScreen
