import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUser } from '../actions/userActions'
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

const ProfileScreen = () => {
  const location = useLocation<LocationParams>()
  const history = useHistory<HistoryParams>()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setpasswordConfirm] = useState('')

  const dispatch = useDispatch()
  const userDetails = useSelector(
    (state: { userDetails: IUserInfo }) => state.userDetails
  )
  const { loading, userInfo, error } = userDetails

  const userLogin = useSelector(
    (state: { userLogin: IUserInfo }) => state.userLogin
  )

  useEffect(() => {
    console.log(userInfo)
    console.log(userLogin)
    if (userInfo) {
      //   history.push(redirect)
    }
  }, [history, userInfo, userLogin])

  const submitHandler = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault()
    // dispatch(signup(name, email, password, passwordConfirm))
  }

  return (
    <div className='container'>
      <h1>Sign In</h1>
      {error && <Message error={error} />}
      {loading && <Loader />}
      <form onSubmit={submitHandler}>
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

        <button className='btn' type='submit'>
          Update
        </button>
      </form>
    </div>
  )
}

export default ProfileScreen
