import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import { IUserInfoRdx } from '../type'

interface LocationParams {
  search: string
}

interface HistoryParams {}

const LoginScreen = () => {
  const location = useLocation<LocationParams>()
  const history = useHistory<HistoryParams>()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const userLogin = useSelector(
    (state: { userLogin: IUserInfoRdx }) => state.userLogin
  )
  const { loading, userInfo, error } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'
  console.log('redirect', redirect)

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <div className='container'>
      <h1 className='u-txt-center u-py-ss'>Sign In</h1>
      {error && (
        <div className='u-txt-center u-py-ss'>
          <Message error={error} />
        </div>
      )}
      {loading && <Loader />}
      <form className='form' onSubmit={submitHandler}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          placeholder='Enter email'
          name='email'
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor='pass'>Password</label>
        <input
          type='password'
          placeholder='Enter password'
          name='pass'
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type='submit'>Login</button>

        <div className='u-py-s'>
          New customer?{' '}
          <Link
            className='btn btn-purple'
            to={redirect ? `/signup?redirect=${redirect}` : '/signup'}
          >
            Sign Up
          </Link>
        </div>

        <div className='u-py-s'>
          Forgot Password? <Link to='/forgotpassword'>Reset Password</Link>
        </div>
      </form>
    </div>
  )
}

export default LoginScreen
