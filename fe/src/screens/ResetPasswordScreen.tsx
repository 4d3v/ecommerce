import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { resetPassword } from '../actions/userActions'
import { IUserResetPasswordRdx } from '../type'
import { userActions } from '../constants/userConstants'
import Alert from '../components/Alert'

interface HistoryParams {}

interface RouteParams {
  resetpasstoken: string
}

const ResetPasswordScreen = () => {
  const history = useHistory<HistoryParams>()
  const params = useParams<RouteParams>()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [userResetPassSuccess, setUserResetPassSuccess] = useState(false)

  const dispatch = useDispatch()

  const userResetPassword = useSelector(
    (state: { userResetPassword: IUserResetPasswordRdx }) =>
      state.userResetPassword
  )
  console.log(userResetPassword)

  useEffect(() => {
    if (
      userResetPassword &&
      userResetPassword.result &&
      userResetPassword.result.ok
    ) {
      setUserResetPassSuccess(true)
      setTimeout(() => {
        dispatch({ type: userActions.USER_RESET_PASSWORD_RESET })
        setUserResetPassSuccess(false)
      }, 2000)
    }
  }, [dispatch, userResetPassword, history])

  const submitHandler = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(resetPassword(password, passwordConfirm, params.resetpasstoken))
  }

  return (
    <div className='container'>
      <h1 className='u-txt-center u-py-ss'>Reset Password</h1>
      {userResetPassword &&
        userResetPassword.result &&
        userResetPassword.result.ok &&
        userResetPassSuccess && (
          <div className='u-txt-center u-py-ss'>
            <Alert type='success' msg={userResetPassword.result.message} />
          </div>
        )}
      {userResetPassword && userResetPassword.error && (
        <div className='u-txt-center u-py-ss'>
          <Message error={userResetPassword.error} />
        </div>
      )}
      {userResetPassword && userResetPassword.loading && <Loader />}
      <form className='form' onSubmit={submitHandler}>
        <label htmlFor='newpass'>New password</label>
        <input
          type='password'
          placeholder='Enter new password'
          name='newpass'
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor='newpassconfirm'>Confirm New password</label>
        <input
          type='password'
          placeholder='Confirm new password'
          name='newpassconfirm'
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />

        <button type='submit'>Update My Password</button>

        <div className='u-py-s'>
          <Link className='btn btn-purple' to='/login'>
            Go Back
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ResetPasswordScreen
