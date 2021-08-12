import React from 'react'
import { Link } from 'react-router-dom'

const SideNav = () => {
  return (
    <ul className='side__nav'>
      {[
        ['Profile', 'profile'],
        ['My Orders', 'myorders'],
      ].map((el) => (
        <li className='side__nav--li'>
          <Link to={el[1]}>{el[0]}</Link>
        </li>
      ))}
    </ul>
  )
}

export default SideNav
