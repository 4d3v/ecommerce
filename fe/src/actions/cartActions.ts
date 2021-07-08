import axios from 'axios'
import { cartActions } from '../constants/cartConstants'
import { BASE_URL } from '../constants/endPoints'
import { AppDispatch } from '../store'

// TEMP using getState as any
export const addToCart =
  (id: string, qty: number) => async (dispatch: AppDispatch, getState: any) => {
    const { data } = await axios.get(`${BASE_URL}/products/${id}`)

    dispatch({
      type: cartActions.CART_ADD_ITEM,
      payload: {
        product: data.id,
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
