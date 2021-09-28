import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { addShippingAddress } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
import MainSideNav from '../components/MainSideNav'
import { ICartItemsRdx, IMainNavProps } from '../type'

interface HistoryParams {}

const ShippingScreen = ({ leftNavToggled, leftNavDefVis }: IMainNavProps) => {
  const history = useHistory<HistoryParams>()

  const dispatch = useDispatch()
  const cart = useSelector((state: { cart: ICartItemsRdx }) => state.cart)
  const { shippingAddress } = cart

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postal_code)
  const [country, setCountry] = useState(shippingAddress.country)

  const submitHandler = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(
      addShippingAddress({ address, city, postal_code: postalCode, country })
    )
    history.push('/payment')
  }

  return (
    <div className='_mctt02'>
      <MainSideNav
        leftNavToggled={leftNavToggled}
        leftNavDefVis={leftNavDefVis}
      />

      <div>
        <div className='content-title dki02'>
          <h2 className='u-txt-center'>SHIPPING</h2>
        </div>

        <CheckoutSteps step1 step2 />

        <form className='form' onSubmit={submitHandler}>
          <label htmlFor='address'>Address</label>
          <input
            type='text'
            placeholder='Enter address'
            name='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <label htmlFor='city'>City</label>
          <input
            type='text'
            placeholder='Enter city'
            name='city'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <label htmlFor='postalcode'>Postal Code</label>
          <input
            type='text'
            placeholder='Enter postal code'
            name='postalcode'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />

          <label htmlFor='country'>Country</label>
          <input
            type='text'
            placeholder='Enter country'
            name='country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />

          <button type='submit'>Continue</button>
        </form>
      </div>
    </div>
  )
}

export default ShippingScreen
