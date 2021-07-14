import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { signup } from '../actions/userActions'
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

const SignUpScreen = () => {
  const location = useLocation<LocationParams>()
  const history = useHistory<HistoryParams>()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setpasswordConfirm] = useState('')

  const dispatch = useDispatch()
  const userSignUp = useSelector(
    (state: { userSignUp: IUserInfo }) => state.userSignUp
  )
  const { loading, userInfo, error } = userSignUp

  const userDetails = useSelector(
    (state: { userDetails: IUserInfo }) => state.userDetails
  )

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(signup(name, email, password, passwordConfirm))
  }

  return (
    <div className='container'>
      <h1 className='u-txt-center u-py-ss'>Sign Up</h1>
      {error && (
        <div className='u-txt-center u-py-ss'>
          <Message error={error} />
        </div>
      )}
      {loading && <Loader />}
      <form className='form' onSubmit={submitHandler}>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          placeholder='Enter name'
          name='name'
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <label htmlFor='passconfirm'>Password</label>
        <input
          type='password'
          placeholder='Confirm password'
          name='passconfirm'
          onChange={(e) => setpasswordConfirm(e.target.value)}
          required
        />

        <button type='submit'>Sign Up</button>

        <div className='u-py-s'>
          Have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignUpScreen
