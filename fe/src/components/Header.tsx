import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { logout } from '../actions/userActions'
import { IUserLoginRdx } from '../type'

interface IProps {
  toggleLeftNav: () => void
}

interface HistoryParams {}

const Header = ({ toggleLeftNav }: IProps) => {
  const history = useHistory<HistoryParams>()

  const dispatch = useDispatch()
  const userLogin = useSelector(
    (state: { userLogin: IUserLoginRdx }) => state.userLogin
  )

  const handleHambBtn = () => toggleLeftNav()

  const logoutHandler = () => {
    dispatch(logout())
    history.push('/')
  }

  return (
    <header id='header'>
      <nav className='dki01'>
        <button className='_3Cn68 _2Lj_X' onClick={handleHambBtn}>
          <span>
            <svg
              width='0'
              height='0'
              viewBox='0 0 24 24'
              version='1.1'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
            >
              <g>
                <path d='M6 4h12v3H6zM6 18h12v3H6zM2 11h20v3H2z'></path>
              </g>
            </svg>
          </span>
        </button>

        <div style={{ flex: '1' }}>
          {' '}
          {/* TEMP STYLING */}
          <Link to='/'>ECOMMERCE</Link>
        </div>
        <ul className='u-txt-center'>
          <li>
            <Link to='/cart' className='nav-link'>
              <i className='fas fa-shopping-cart'></i> Cart
            </Link>
          </li>
          <li className='userinfo-dropdown'>
            {userLogin && userLogin.userInfo && userLogin.userInfo.user ? (
              <>
                <span>{userLogin.userInfo.user.name}</span>
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
