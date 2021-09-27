import React from 'react'
import { Link } from 'react-router-dom'

interface IProps {
  leftNavToggled: boolean
  leftNavDefVis: boolean
}

const MainSideNav = ({ leftNavToggled, leftNavDefVis }: IProps) => {
  return (
    <div className='main__lmenu'>
      <div
        className={`main__lmenu--content 
        ${leftNavToggled ? 'main__lmenu--opened' : ''}
        ${!leftNavToggled && !leftNavDefVis ? 'u-dnone' : ''}`}
      >
        <nav className='main__lmenu--nav'>
          <ul>
            <li>
              <div className='main__lmenu--nav--item'>
                <div className='navitem navitemselected'>
                  <Link className='_wd2ds u-crsptr' to='/'>
                    <div className='_1wd2ds'>
                      <span className='item'>
                        <i className='fas fa-home'></i>
                      </span>
                    </div>
                    {leftNavToggled && 'Home'}
                  </Link>
                </div>
              </div>
            </li>

            <li>
              <div className='main__lmenu--nav--item'>
                <div className='navitem'>
                  <Link className='_wd2ds u-crsptr' to='/'>
                    <div className='_1wd2ds'>
                      <span className='item'>
                        <i className='fas fa-tag'></i>
                      </span>
                    </div>
                    {leftNavToggled && 'Category'}
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default MainSideNav
