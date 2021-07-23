import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { addPaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
import { ICart, IPaymentMethod, IShippingAddress } from '../type'

interface HistoryParams {}

interface ICartItems {
  cartItems: ICart[]
  shippingAddress: IShippingAddress
  paymentMethod: IPaymentMethod
}

const PaymentScreen = () => {
  const history = useHistory<HistoryParams>()

  const dispatch = useDispatch()
  const cart = useSelector((state: { cart: ICartItems }) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress) history.push('/shipping')

  const [paymentMethod, setPaymentMethod] = useState('Paypal')

  const submitHandler = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(addPaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <div className='container'>
      <CheckoutSteps step1 step2 step3 />
      <h1 className='u-txt-center u-my-s'>Shipping</h1>
      <form className='form' onSubmit={submitHandler}>
        <div>Select Payment Method</div>
        <div className='radio-input'>
          <input
            className='form__radio'
            id='Paypal'
            type='radio'
            name='methodPaypal'
            value='Paypal'
            onChange={(e) => setPaymentMethod(e.target.value)}
            checked
          />
          Paypal
        </div>

        <div className='radio-input'>
          <input
            className='form__radio'
            id='Stripe'
            type='radio'
            name='methodStripe'
            value='Stripe'
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Stripe
        </div>
        <button type='submit'>Continue</button>
      </form>
    </div>
  )
}

export default PaymentScreen
