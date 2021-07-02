import { AnyAction } from 'redux'
import { cartActions } from '../constants/cartConstants'

// Temporarily using any
const cart: any[] = []
const initialState: { cartItems: any[] } = {
  cartItems: cart,
}

export const cartReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case cartActions.CART_ADD_ITEM:
      const item = action.payload

      const existItem = state.cartItems.find(
        (el) => el.product === item.product
      )

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((el) =>
            el.product === existItem.product ? item : el
          ),
        }
      } else {
        return { ...state, cartItems: [...state.cartItems, item] }
      }

    case cartActions.CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (el) => el.product !== action.payload
        ),
      }

    default:
      return state
  }
}
