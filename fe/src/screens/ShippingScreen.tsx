import React, { useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { addShippingAddress } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
import { ICart, IShippingAddress } from '../type'

interface LocationParams {
  search: string
}

interface HistoryParams {}

interface ICartItems {
  cartItems: ICart[]
  shippingAddress: IShippingAddress
}

const ShippingScreen = () => {
  const location = useLocation<LocationParams>()
  const history = useHistory<HistoryParams>()

  const dispatch = useDispatch()
  const cart = useSelector((state: { cart: ICartItems }) => state.cart)
  const { shippingAddress } = cart

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)

  const submitHandler = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(addShippingAddress({ address, city, postalCode, country }))
    history.push('/payment')
  }

  return (
    <div className='container'>
      <CheckoutSteps step1 step2 />
      <h1 className='u-txt-center u-my-s'>Shipping</h1>
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
  )
}

export default ShippingScreen
