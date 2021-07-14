import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUser, updateUser, updateUserPass } from '../actions/userActions'
import { IUser } from '../type'

interface LocationParams {
  search: string
}

interface HistoryParams {}

interface IUserInfo {
  loading: boolean
  userInfo: IUser
  error: string
}

interface IUserUpdateProfile {
  loading: boolean
  success: boolean
  userInfo: IUser
  error: string
}

interface IUserUpdatePassword {
  loading: boolean
  success: boolean
  error: string
}

const ProfileScreen = () => {
  const location = useLocation<LocationParams>()
  const history = useHistory<HistoryParams>()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [curPassword, setCurPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  const dispatch = useDispatch()
  const userDetails = useSelector(
    (state: { userDetails: IUserInfo }) => state.userDetails
  )
  const { loading, userInfo, error } = userDetails

  const userLogin = useSelector(
    (state: { userLogin: IUserInfo }) => state.userLogin
  )

  const userUpdateProfile = useSelector(
    (state: { userUpdateProfile: IUserUpdateProfile }) =>
      state.userUpdateProfile
  )

  const userUpdatePassword = useSelector(
    (state: { userUpdatePassword: IUserUpdatePassword }) =>
      state.userUpdatePassword
  )

  useEffect(() => {
    console.log('been called')
    console.log(userInfo)

    if (!userLogin.userInfo) {
      history.push('/login')
    } else if (!userInfo) {
      dispatch(getUser(userLogin.userInfo.id))
      console.log(1)
    } else {
      setName(userInfo.name)
      setEmail(userInfo.email)
      console.log(2)
    }
  }, [dispatch, history, userInfo, userLogin])

  const updateUserDetails = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault()
    dispatch(updateUser({ id: userInfo.id, name, email }))
  }

  const updateUserPassword = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault()
    dispatch(updateUserPass(curPassword, newPassword, newPasswordConfirm))
  }

  return (
    <div className='container'>
      <h1 className='u-txt-center u-my-s'>My Profile</h1>
      {error && (
        <div className='u-txt-center u-py-ss'>
          <Message error={error} />
        </div>
      )}
      {userUpdateProfile.error && (
        <div className='u-txt-center u-py-ss'>
          <Message error={userUpdateProfile.error} />
        </div>
      )}
      {userUpdatePassword.error && (
        <div className='u-txt-center u-py-ss'>
          <Message error={userUpdatePassword.error} />
        </div>
      )}
      {userUpdatePassword.success && (
        <div className='u-txt-center u-py-ss'>
          <Message info={'User password updated successfully'} />
        </div>
      )}
      {userUpdateProfile.success && (
        <div className='u-txt-center u-py-ss'>
          <Message info={'User updated successfully'} />
        </div>
      )}
      {loading && <Loader />}
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

        <button type='submit'>Update user details</button>
      </form>

      <form className='form' onSubmit={updateUserPassword}>
        <label htmlFor='curpass'>Current password</label>
        <input
          type='password'
          placeholder='Enter current password'
          name='curpass'
          onChange={(e) => setCurPassword(e.target.value)}
          required
        />

        <label htmlFor='newpass'>New password</label>
        <input
          type='password'
          placeholder='Enter new password'
          name='newpass'
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label htmlFor='newpassconfirm'>Confirm New password</label>
        <input
          type='password'
          placeholder='Confirm new password'
          name='newpassconfirm'
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          required
        />

        <button type='submit'>Update user password</button>
      </form>
    </div>
  )
}

export default ProfileScreen
