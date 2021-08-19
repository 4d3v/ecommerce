import React from 'react'
import { Link } from 'react-router-dom'

interface IProps {
  isAdmin: boolean
}

const SideNav = ({ isAdmin }: IProps) => {
  return (
    <ul className='side__nav'>
      {[
        ['Profile', '/profile'],
        ['My Orders', '/myorders'],
      ].map((el, idx) => (
        <li key={idx} className='side__nav--li'>
          <Link to={el[1]}>{el[0]}</Link>
        </li>
      ))}

      {isAdmin &&
        [
          ['Admin Users', '/admin/users'],
          ['Admin Products', '/admin/products'],
        ].map((el, idx) => (
          <li key={idx} className='side__nav--li'>
            <Link to={el[1]}>{el[0]}</Link>
          </li>
        ))}
    </ul>
  )
}

export default SideNav
