import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUser, updateUser, updateUserPass } from '../actions/userActions'
import {
  IMainNavProps,
  IUserInfoRdx,
  IUserLoginRdx,
  IUserUpdatePasswordRdx,
  IUserUpdateProfileRdx,
} from '../type'
import { userActions } from '../constants/userConstants'
import SideNav from '../components/SideNav'
import { UserRole } from '../enums'
import Alert from '../components/Alert'
import MainSideNav from '../components/MainSideNav'

interface HistoryParams {}

const ProfileScreen = ({ leftNavToggled, leftNavDefVis }: IMainNavProps) => {
  const history = useHistory<HistoryParams>()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [curPassword, setCurPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [passUpdatedSuccess, setPassUpdatedSuccess] = useState(false)
  const [profileUpdatedSuccess, setProfileUpdatedSuccess] = useState(false)

  const dispatch = useDispatch()
  const userDetails = useSelector(
    (state: { userDetails: IUserInfoRdx }) => state.userDetails
  )

  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  const userUpdateProfile = useSelector(
    (state: { userUpdateProfile: IUserUpdateProfileRdx }) =>
      state.userUpdateProfile
  )

  const userUpdatePassword = useSelector(
    (state: { userUpdatePassword: IUserUpdatePasswordRdx }) =>
      state.userUpdatePassword
  )

  useEffect(() => {
    if (!userLogin.userInfo) {
      history.push('/login')
    } else if (
      !userDetails.userInfo ||
      !userDetails.userInfo.name ||
      userUpdateProfile.success ||
      userUpdatePassword.success ||
      (userLogin.userInfo &&
        userDetails.userInfo &&
        userDetails.userInfo.id !== userLogin.userInfo.user.id)
    ) {
      dispatch({ type: userActions.USER_UPDATE_PROFILE_RESET })
      dispatch({ type: userActions.USER_UPDATE_PASSWORD_RESET })
      dispatch(getUser())
    } else {
      setName(userDetails.userInfo.name)
      setEmail(userDetails.userInfo.email)
    }

    if (userUpdateProfile.result && userUpdateProfile.result.ok) {
      setProfileUpdatedSuccess(true)
      setTimeout(() => {
        setProfileUpdatedSuccess(false)
      }, 2000)
    }

    if (userUpdatePassword.result && userUpdatePassword.result.ok) {
      setPassUpdatedSuccess(true)
      setTimeout(() => {
        setPassUpdatedSuccess(false)
      }, 2000)
    }
  }, [
    dispatch,
    history,
    userDetails,
    userLogin,
    userUpdateProfile.success,
    userUpdateProfile.result,
    userUpdatePassword.success,
    userUpdatePassword.result,
  ])

  const updateUserDetails = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault()
    dispatch(updateUser({ id: userDetails.userInfo.id, name, email }))
  }

  const updateUserPassword = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault()
    dispatch(updateUserPass(curPassword, newPassword, newPasswordConfirm))
  }

  return (
    <div className='_mctt02'>
      <MainSideNav
        leftNavToggled={leftNavToggled}
        leftNavDefVis={leftNavDefVis}
      />

      {userDetails && userDetails.error && (
        <div className='u-txt-center u-py-ss'>
          <Message error={userDetails.error} />
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
      {profileUpdatedSuccess && (
        <div className='u-txt-center u-py-ss'>
          <Alert type='success' msg='User profile updated successfully' />
        </div>
      )}
      {passUpdatedSuccess && (
        <div className='u-txt-center u-py-ss'>
          <Alert type='success' msg='User password updated successfully' />
        </div>
      )}

      {userDetails && userDetails.loading && <Loader />}

      <div className='prof--sep'>
        <SideNav
          isAdmin={
            userLogin.userInfo &&
            userLogin.userInfo.user.role !== UserRole.NORMAL
          }
        />

        <div className='prof--sep--r'>
          <h2 className='u-txt-center u-my-s'>MY PROFILE</h2>
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
      </div>
    </div>
  )
}

export default ProfileScreen
