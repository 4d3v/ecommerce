import React from 'react'
import { Link } from 'react-router-dom'
import MainSideNav from '../components/MainSideNav'
import { IMainNavProps } from '../type'

const CategoryScreen = ({ leftNavToggled, leftNavDefVis }: IMainNavProps) => {
  return (
    <div className='category _mctt01'>
      <MainSideNav
        leftNavToggled={leftNavToggled}
        leftNavDefVis={leftNavDefVis}
      />

      <div>
        <div className='content-title dki02'>
          <h2 className='u-txt-center'>CATEGORIES</h2>
        </div>

        {/* {productList && productList.loading && <Loader />} */}
        <div className='cat-card-wrapper'>
          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img src='/images/categories/hardware.png' alt='sample' />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Hardware</h2>
              </div>
            </Link>
          </div>

          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img src='/images/categories/peripherals.png' alt='sample' />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Peripherals</h2>
              </div>
            </Link>
          </div>

          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img src='/images/categories/games.png' alt='sample' />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Games</h2>
              </div>
            </Link>
          </div>

          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img src='/images/categories/security.png' alt='sample' />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Security</h2>
              </div>
            </Link>
          </div>

          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img
                  src='/images/categories/digital-services.png'
                  alt='sample'
                />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Digital Services</h2>
              </div>
            </Link>
          </div>

          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img src='/images/categories/cameras.png' alt='sample' />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Cameras</h2>
              </div>
            </Link>
          </div>

          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img src='/images/categories/smartphones.png' alt='sample' />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Smartphones</h2>
              </div>
            </Link>
          </div>

          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img src='/images/categories/smartwatches.png' alt='sample' />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Smartwatches</h2>
              </div>
            </Link>
          </div>

          <div className='cat-card'>
            <Link className='cat-card__link' to='/'>
              <div className='cat-card__imgwrapper'>
                <img src='/images/default-thumb.png' alt='sample' />
              </div>

              <div className='cat-card__txtwrapper'>
                <h2>Other</h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryScreen
