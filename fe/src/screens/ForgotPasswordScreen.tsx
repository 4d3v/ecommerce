import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { forgotPassword } from '../actions/userActions'
import { IUserForgotPasswordRdx } from '../type'
import Alert from '../components/Alert'
import { userActions } from '../constants/userConstants'

interface HistoryParams {}

const ForgotPasswordScreen = () => {
  const history = useHistory<HistoryParams>()

  const [email, setEmail] = useState('')
  const [userForgotPassSuccess, setUserForgotPassSuccess] = useState(false)

  const dispatch = useDispatch()

  const userForgotPassword = useSelector(
    (state: { userForgotPassword: IUserForgotPasswordRdx }) =>
      state.userForgotPassword
  )

  useEffect(() => {
    if (
      userForgotPassword &&
      userForgotPassword.result &&
      userForgotPassword.result.ok
    ) {
      setUserForgotPassSuccess(true)
      setTimeout(() => {
        dispatch({ type: userActions.USER_FORGOT_PASSWORD_RESET })
        setUserForgotPassSuccess(false)
      }, 2000)
    }
  }, [dispatch, userForgotPassword, history])

  const submitHandler = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(forgotPassword(email))
  }

  return (
    <div className='container'>
      <h1 className='u-txt-center u-py-ss'>Forgot Password</h1>
      {userForgotPassword && userForgotPassword.error && (
        <div className='u-txt-center u-py-ss'>
          <Message error={userForgotPassword.error} />
        </div>
      )}
      {userForgotPassword &&
        userForgotPassword.result &&
        userForgotPassword.result.ok &&
        userForgotPassSuccess && (
          <div className='u-txt-center u-py-ss'>
            <Alert type='success' msg={userForgotPassword.result.message} />
          </div>
        )}
      {userForgotPassword && userForgotPassword.loading && <Loader />}
      <form className='form' onSubmit={submitHandler}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          placeholder='Enter email'
          name='email'
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type='submit'>Send</button>

        <div className='u-py-s'>
          <Link className='btn btn-purple' to='/login'>
            Go Back
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordScreen
