import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../actions/userActions'
import { IUser } from '../type'

interface IUserInfo {
  userInfo: IUser
  // loading: boolean
  // error: string
}

const Header = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector(
    (state: { userLogin: IUserInfo }) => state.userLogin
  )
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
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
                <a href='#'>{userInfo.name}</a>
                <ul className='dropdown'>
                  <li className='dropdown__li'>
                    <Link to='#' className='nav-link'>
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
