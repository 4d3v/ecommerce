import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { logout } from '../actions/userActions'
import { IUserInfoRdx } from '../type'

interface HistoryParams {}

const Header = () => {
  const history = useHistory<HistoryParams>()

  const dispatch = useDispatch()
  const userLogin = useSelector(
    (state: { userLogin: IUserInfoRdx }) => state.userLogin
  )
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
    history.push('/')
  }

  return (
    <header id='header'>
      <nav className='container'>
        <div>
          <Link to='/'>ECOMMERCE</Link>
        </div>
        <ul className='u-txt-center'>
          <li>
            <Link to='/cart' className='nav-link'>
              <i className='fas fa-shopping-cart'></i> Cart
            </Link>
          </li>
          <li className='userinfo-dropdown'>
            {userInfo ? (
              <>
                <span>{userInfo.name}</span>
                <ul className='dropdown'>
                  <li className='dropdown__li'>
                    <Link to='/profile' className='nav-link'>
                      Profile
                    </Link>
                  </li>
                  <li className='dropdown__li'>
                    <span className='nav-link' onClick={logoutHandler}>
                      Logout
                    </span>
                  </li>
                </ul>
              </>
            ) : (
              <Link to='/login' className='nav-link'>
                <i className='fas fa-user'></i> Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
