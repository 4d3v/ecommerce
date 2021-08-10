import { AnyAction } from 'redux'
import { cartActions } from '../constants/cartConstants'
import { ICart, IShippingAddress } from '../type'

const cart: ICart[] = []
const shippingAddress: IShippingAddress = {
  address: '',
  city: '',
  postal_code: '',
  country: '',
}
const initialState: { cartItems: ICart[]; shippingAddress: IShippingAddress } =
  {
    cartItems: cart,
    shippingAddress: shippingAddress,
  }

export const cartReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case cartActions.CART_ADD_ITEM:
      const item = action.payload

      const existItem = state.cartItems.find(
        (el) => el.productId === item.productId
      )

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((el) =>
            el.productId === existItem.productId ? item : el
          ),
        }
      } else {
        return { ...state, cartItems: [...state.cartItems, item] }
      }

    case cartActions.CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (el) => el.productId !== action.payload
        ),
      }

    case cartActions.CART_REMOVE_ALL_ITEMS:
      return {
        ...state,
        cartItems: [],
      }

    case cartActions.CART_ADD_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      }

    case cartActions.CART_ADD_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }

    default:
      return state
  }
}
