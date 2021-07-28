import React from 'react'
import { Link } from 'react-router-dom'

interface IProps {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
}

const CheckoutSteps = ({
  step1 = false,
  step2 = false,
  step3 = false,
  step4 = false,
}: IProps) => {
  return (
    <nav>
      <ul className='checkoutsteps u-txt-center u-my-ss'>
        <li>
          <Link
            to={step1 ? '/login' : '#'}
            className={step1 ? 'nav-link' : 'nav-link disabled'}
          >
            Sign In
          </Link>
        </li>

        <li>
          <Link
            to={step2 ? '/shipping' : '#'}
            className={step2 ? 'nav-link' : 'nav-link disabled'}
          >
            Shipping
          </Link>
        </li>

        <li>
          <Link
            to={step3 ? '/payment' : '#'}
            className={step3 ? 'nav-link' : 'nav-link disabled'}
          >
            Payment
          </Link>
        </li>

        <li>
          <Link
            to={step4 ? '/placeorder' : '#'}
            className={step4 ? 'nav-link' : 'nav-link disabled'}
          >
            Place Order
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default CheckoutSteps
