import axios from 'axios'
import { cartActions } from '../constants/cartConstants'
import { BASE_URL } from '../constants/endPoints'
import { AppDispatch } from '../store'
import { IPaymentMethod, IShippingAddress } from '../type'

// TEMP using getState as any
export const addToCart =
  (id: string, qty: number) => async (dispatch: AppDispatch, getState: any) => {
    const { data } = await axios.get(`${BASE_URL}/products/${id}`)

    dispatch({
      type: cartActions.CART_ADD_ITEM,
      payload: {
        productId: data.id,
        name: data.name,
        image: data.image,
        price: data.price,
        count_in_stock: data.count_in_stock,
        qty,
      },
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  }

export const removeFromCart =
  (id: number) => (dispatch: AppDispatch, getState: any) => {
    dispatch({
      type: cartActions.CART_REMOVE_ITEM,
      payload: id,
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  }

export const removeAllFromCart =
  () => (dispatch: AppDispatch, getState: any) => {
    dispatch({
      type: cartActions.CART_REMOVE_ALL_ITEMS,
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  }

export const addShippingAddress =
  (shippingAddress: IShippingAddress) => (dispatch: AppDispatch) => {
    dispatch({
      type: cartActions.CART_ADD_SHIPPING_ADDRESS,
      payload: shippingAddress,
    })

    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress))
  }

export const addPaymentMethod =
  (paymentMethod: IPaymentMethod) => (dispatch: AppDispatch) => {
    dispatch({
      type: cartActions.CART_ADD_PAYMENT_METHOD,
      payload: paymentMethod,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod))
  }
