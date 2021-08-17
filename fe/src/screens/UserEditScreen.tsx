import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import { adminUpdateUser, getUserById } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import SideNav from '../components/SideNav'
import Alert from '../components/Alert'
import { UserRole } from '../enums'
import { IAdminUserUpdateProfileRdx, IUserInfoRdx } from '../type'
import { userActions } from '../constants/userConstants'

interface HistoryParams {}

interface RouteParams {
  userid: string
}

const UserEditScreen = () => {
  const params = useParams<RouteParams>()
  const history = useHistory<HistoryParams>()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(0)
  const [userProfileUpdated, setUserProfileUpdated] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector(
    (state: { userLogin: IUserInfoRdx }) => state.userLogin
  )

  const userDetails = useSelector(
    (state: { userDetails: IUserInfoRdx }) => state.userDetails
  )

  const adminUserUpdateProfile = useSelector(
    (state: { adminUserUpdateProfile: IAdminUserUpdateProfileRdx }) =>
      state.adminUserUpdateProfile
  )

  useEffect(() => {
    if (
      !userLogin.userInfo ||
      (userLogin.userInfo && userLogin.userInfo.role === UserRole.NORMAL)
    ) {
      history.push('/login')
    } else if (
      !userDetails.userInfo ||
      (userDetails.userInfo &&
        userDetails.userInfo.id !== Number(params.userid))
    ) {
      dispatch(getUserById(Number(params.userid)))
    } else {
      setName(userDetails.userInfo.name)
      setEmail(userDetails.userInfo.email)
      setRole(userDetails.userInfo.role!)
    }
  }, [
    dispatch,
    history,
    userLogin.userInfo,
    userDetails.userInfo,
    params.userid,
  ])

  const updateUserDetails = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault()
    dispatch(
      adminUpdateUser({
        id: userDetails.userInfo.id,
        name: name,
        email: email,
        role: role,
      })
    )

    setUserProfileUpdated(true)
    setTimeout(() => {
      dispatch({ type: userActions.USER_DETAILS_RESET })
      setUserProfileUpdated(false)
    }, 2000)
  }

  const onChangeRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(Number(e.target.value))
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
          <h1 className='u-txt-center u-my-s'>Edit User</h1>
          {userDetails.loading || userLogin.loading ? (
            <Loader />
          ) : userDetails.error ? (
            <Message error={userDetails.error} />
          ) : userLogin.error ? (
            <Message error={userDetails.error} />
          ) : (
            userDetails.userInfo && (
              <>
                <form className='form' onSubmit={updateUserDetails}>
                  <label htmlFor='name'>Name</label>
                  <input
                    type='text'
                    placeholder='Enter name'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <label htmlFor='email'>Email</label>
                  <input
                    type='email'
                    placeholder='Enter email'
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <input
                    className='form__radio'
                    type='radio'
                    id='roleOwner'
                    name='role'
                    value={UserRole.OWNER}
                    onChange={onChangeRole}
                    checked={role === UserRole.OWNER}
                  />
                  <label htmlFor='roleOwner'>Owner</label>

                  <input
                    className='form__radio'
                    type='radio'
                    id='roleAdmin'
                    name='role'
                    value={UserRole.ADMIN}
                    onChange={onChangeRole}
                    checked={role === UserRole.ADMIN}
                  />
                  <label htmlFor='roleAdmin'>Admin</label>

                  <input
                    className='form__radio'
                    type='radio'
                    id='roleNormal'
                    name='role'
                    value={UserRole.NORMAL}
                    onChange={onChangeRole}
                    checked={role === UserRole.NORMAL}
                  />
                  <label htmlFor='roleNormal'>Normal</label>

                  <button type='submit'>Update user details</button>
                </form>
              </>
            )
          )}

          <div className='u-txt-center'>
            <Link to='/admin/users' className='btn'>
              Go Back
            </Link>
          </div>
        </div>
      </div>

      {adminUserUpdateProfile.result && adminUserUpdateProfile.result.ok ? (
        userProfileUpdated && (
          <Alert
            type='success'
            msg={`${adminUserUpdateProfile.result.message}`}
          />
        )
      ) : adminUserUpdateProfile.result && !adminUserUpdateProfile.result.ok ? (
        <Alert type='fail' msg={`${adminUserUpdateProfile.error}`} />
      ) : null}
    </div>
  )
}

export default UserEditScreen
